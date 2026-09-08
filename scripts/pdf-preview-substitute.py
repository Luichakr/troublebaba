#!/usr/bin/env python3
"""
Подменяет текст в PDF на закрытых страницах, оставляя картинки и графику.

Запуск:  npm run pdf:substitute -- uk
         (или .venv-pdf/bin/python scripts/pdf-preview-substitute.py uk)

Зачем это, а не размытие оригинала: пока в файле лежит настоящий текст,
защита держится на стойкости размытия — то есть на оценке, что его не
расшифруют. Здесь текст книги удаляется из PDF совсем, и на его место
встаёт уведомление об авторском праве. После этого блюр нужен только
для вида, и он может быть честным полноразмерным и мягким: под ним
нечего прятать.

Что делает со страницей из списка visible: ничего.
Что делает с остальными:
  1. Собирает прямоугольники текстовых блоков.
  2. Применяет redaction — текст физически удаляется из content stream,
     а не закрашивается. Картинки и вектор сохраняются: без флагов
     apply_redactions() затирает и их тоже.
  3. Вписывает уведомление в область, где стоял текст, — тем же кеглем
     и по тем же координатам, чтобы страница выглядела так, будто этот
     текст в ней и был.

Шрифт: встроенные в PDF — сабсеты по 10–15 КБ (только использованные
глифы), для нового текста их не хватит. Поэтому берётся системный SFNS
с полным покрытием кириллицы.
"""
import json
import sys
from pathlib import Path

import fitz  # PyMuPDF

ROOT = Path(__file__).resolve().parent.parent
CFG = json.loads((ROOT / "scripts/pdf-preview.config.json").read_text(encoding="utf-8"))

FONT_FILE = "/System/Library/Fonts/SFNS.ttf"
FONT_ALIAS = "subst"

# Минимальная площадь блока, который считаем текстом. Мелкие сноски и
# колонтитулы тоже убираем, но по ним не выравниваем вставку.
MIN_ANCHOR_AREA = 12000

TITLE_INK = (0.10, 0.08, 0.05)
BODY_INK = (0.14, 0.11, 0.08)


def text_blocks(page):
    return [b for b in page.get_text("dict")["blocks"] if b["type"] == 0]


def dominant_size(blocks):
    """Кегль основного текста страницы — по нему масштабируем вставку."""
    sizes = [s["size"] for b in blocks for l in b["lines"] for s in l["spans"]]
    if not sizes:
        return 10.0
    sizes.sort()
    return sizes[len(sizes) // 2]


def anchor_rect(page, blocks):
    """Область, в которую вписываем уведомление.

    Берём объединение крупных текстовых блоков: так вставка ложится
    туда, где текст и был, а не в геометрический центр страницы —
    иначе на страницах с фото сверху уведомление уезжало на картинку.
    """
    def area(r):
        return max(0.0, r.x1 - r.x0) * max(0.0, r.y1 - r.y0)

    big = [fitz.Rect(b["bbox"]) for b in blocks if area(fitz.Rect(b["bbox"])) >= MIN_ANCHOR_AREA]
    if not big:
        big = [fitz.Rect(b["bbox"]) for b in blocks]
    if not big:
        r = page.rect
        return fitz.Rect(r.x0 + 56, r.y0 + 120, r.x1 - 56, r.y1 - 160)
    out = big[0]
    for r in big[1:]:
        out |= r
    # Немного расширяем: redaction съедает ровно bbox, а тексту нужен воздух.
    out = fitz.Rect(out.x0 - 4, out.y0 - 6, out.x1 + 4, out.y1 + 10)
    out = out & page.rect

    # Отодвигаем от картинок. Область текста на странице часто тянется
    # во всю ширину, включая колонку с фото: без этого заголовок заезжал
    # под фото бисквита и уведомление выглядело сломанной вёрсткой.
    for img in page.get_images(full=True):
        for r in page.get_image_rects(img[0]):
            if r.y0 > out.y1 or r.y1 < out.y0:
                continue                       # по вертикали не пересекаются
            if r.x0 > out.x0 + 80:             # фото справа — подрезаем справа
                out = fitz.Rect(out.x0, out.y0, min(out.x1, r.x0 - 10), out.y1)
            elif r.x1 < out.x1 - 80:           # фото слева — сдвигаем слева
                out = fitz.Rect(max(out.x0, r.x1 + 10), out.y0, out.x1, out.y1)
    return out


def substitute(page, notice, verbose=False):
    blocks = text_blocks(page)
    if not blocks:
        return 0

    size = dominant_size(blocks)
    box = anchor_rect(page, blocks)

    # Шаг 1: удаляем текст. fill=None — не закрашивать: под текстом
    # часто лежит фоновая заливка или фото, и белые плашки выдали бы
    # правку сразу.
    for b in blocks:
        page.add_redact_annot(fitz.Rect(b["bbox"]), fill=None)
    page.apply_redactions(
        images=fitz.PDF_REDACT_IMAGE_NONE,
        graphics=fitz.PDF_REDACT_LINE_ART_NONE,
        text=fitz.PDF_REDACT_TEXT_REMOVE,
    )

    # Шаг 2: вписываем уведомление. Кегль подбираем сверху вниз, пока
    # текст не поместится: площадь под текстом у страниц разная, и
    # фиксированный кегль либо обрезался, либо болтался.
    page.insert_font(fontname=FONT_ALIAS, fontfile=FONT_FILE)
    title = notice["title"]
    body = "\n".join([l for l in notice["body"] if l])
    tail = f'{notice["url"]}\n{notice["sign"]}'

    # Если текст на странице стоял в узкой полосе (подпись под фото,
    # колонка сбоку), уведомление в неё не влезет ни при каком кегле.
    # Тогда берём щедрое поле по странице: лучше поставить читаемый
    # блок не совсем на место текста, чем не поставить ничего.
    pr = page.rect
    roomy = fitz.Rect(pr.x0 + 52, pr.y0 + 96, pr.x1 - 52, pr.y1 - 96)
    boxes = [roomy] if (box.y1 - box.y0) < 240 or (box.x1 - box.x0) < 200 else [box, roomy]

    def rects(target, s):
        head_h = s * 2.6
        return (
            fitz.Rect(target.x0, target.y0, target.x1, target.y0 + head_h),
            fitz.Rect(target.x0, target.y0 + head_h, target.x1, target.y1 - s * 4.8),
            # Хвосту (адрес + подпись) нужно s*3.3 на две строки при
            # lineheight 1.5 плюс воздух. Первая версия давала s*3.4,
            # и примерка отвергала КАЖДЫЙ кегль: на страницу не попадало
            # вообще ничего.
            fitz.Rect(target.x0, target.y1 - s * 4.6, target.x1, target.y1),
        )

    def fits(target, s):
        """Примерка на черновой странице.

        Рисовать сразу нельзя: insert_textbox возвращает «не влезло»
        уже ПОСЛЕ отрисовки, и заголовок оставался на странице, а
        следующая попытка с меньшим кеглем ложилась поверх него —
        на выходе был заголовок в два слоя.
        """
        r1, r2, r3 = rects(target, s)
        if min(r1.height, r2.height, r3.height) < s * 1.2:
            return False
        if min(r1.width, r2.width) < s * 6:
            return False
        scratch = fitz.open()
        try:
            sp = scratch.new_page(width=page.rect.width, height=page.rect.height)
            sp.insert_font(fontname=FONT_ALIAS, fontfile=FONT_FILE)
            if sp.insert_textbox(r1, title, fontname=FONT_ALIAS, fontsize=s * 1.45) < 0:
                return False
            if sp.insert_textbox(r2, body, fontname=FONT_ALIAS, fontsize=s, lineheight=1.6) < 0:
                return False
            if sp.insert_textbox(r3, tail, fontname=FONT_ALIAS, fontsize=s * 1.1, lineheight=1.5) < 0:
                return False
            return True
        finally:
            scratch.close()

    for target in boxes:
        for scale in (2.2, 1.9, 1.6, 1.4, 1.2, 1.0, 0.85, 0.7):
            s = max(6.5, size * scale)
            if not fits(target, s):
                continue
            r1, r2, r3 = rects(target, s)
            page.insert_textbox(r1, title, fontname=FONT_ALIAS, fontsize=s * 1.45,
                                color=TITLE_INK, align=fitz.TEXT_ALIGN_LEFT)
            page.insert_textbox(r2, body, fontname=FONT_ALIAS, fontsize=s, lineheight=1.6,
                                color=BODY_INK, align=fitz.TEXT_ALIGN_LEFT)
            page.insert_textbox(r3, tail, fontname=FONT_ALIAS, fontsize=s * 1.1, lineheight=1.5,
                                color=TITLE_INK, align=fitz.TEXT_ALIGN_LEFT)
            if verbose:
                print(f"      кегль {s:.1f} (основной текст страницы {size:.1f}),"
                      f" область {target.width:.0f}x{target.height:.0f}")
            return len(blocks)

    return len(blocks)


def main():
    langs = [a for a in sys.argv[1:] if not a.startswith("-")]
    verbose = "-v" in sys.argv
    if not langs:
        print("укажи язык, например:  uk", file=sys.stderr)
        return 1

    for lang in langs:
        src = (ROOT / CFG["sources"][lang]).resolve()
        if not src.exists():
            print(f"  {lang}: нет файла {src}", file=sys.stderr)
            continue
        notice = CFG["decoy"].get(lang)
        if not notice:
            print(f"  {lang}: в конфиге нет decoy — пропущен", file=sys.stderr)
            continue

        visible = set(CFG["visible"].get(lang, []))
        doc = fitz.open(src)
        touched = removed = 0
        for n in range(doc.page_count):
            if (n + 1) in visible:
                continue
            removed += substitute(doc[n], notice, verbose and n < 3)
            touched += 1

        out = src.with_name(f"{lang}-preview.pdf")
        doc.save(out, garbage=4, deflate=True, clean=True)
        doc.close()
        mb = out.stat().st_size / 1024 / 1024
        print(f"  {lang}: подменено страниц {touched}, удалено текстовых блоков {removed}")
        print(f"      {out.name}: {mb:.1f} МБ (страницы {sorted(visible)} не тронуты)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
