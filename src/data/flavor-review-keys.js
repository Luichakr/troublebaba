/**
 * Подбор отзывов под конкретный вкус.
 *
 * На странице вкуса показываем только те отзывы, где этот вкус реально
 * упомянут. Один отзыв может попасть на несколько страниц — «мій топ:
 * Вишня в шоколаді, Мак-цитрус, Фісташка-малина» относится к трём.
 *
 * Ключи — распознавательные корни на всех языках, где есть отзывы
 * (uk/ru/pl/en). Локали без своих отзывов показывают английские, поэтому
 * проверяются все ключи сразу, независимо от языка страницы.
 *
 * Почему корни, а не полные названия: в славянских языках имя склоняется
 * («Фісташку-малину», «Wiśnię w czekoladzie», «Pina Coladę»), и матчинг
 * по полному названию терял треть упоминаний.
 */
export const FLAVOR_REVIEW_KEYS = {
  'oreo-bento-cake':               ['oreo', 'орео'],
  'red-velvet-bento-cake':         ['red velvet', 'velvet', 'оксамит', 'бархат', 'aksamit'],
  'poppy-seed-citrus-bento-cake':  ['мак-цитрус', 'poppy', 'makowo', 'цитрус', 'cytrus'],
  'snickers-bento-cake':           ['snickers', 'сникерс', 'снікерс'],
  'raffaello-bento-cake':          ['raffaello', 'рафаэлло', 'рафаелло'],
  'ferrero-rocher-bento-cake':     ['ferrero', 'рошер', 'роше'],
  'cinnabon-bento-cake':           ['cinnabon', 'синнабон', 'сіннабон'],
  'pistachio-raspberry-bento-cake':['фісташ', 'фисташ', 'pistac', 'pistasz'],
  'pina-colada-bento-cake':        ['pina colad', 'піна колад', 'пина колад', 'ананас', 'ananas', 'pineapple'],
  'cherry-chocolate-bento-cake':   ['вишн', 'cherry', 'wiśni', 'wisni', 'черешн'],
};

/**
 * Граница слова СЛЕВА обязательна, справа — намеренно нет.
 *
 * Без левой границы ключ «мак» ловил «смак» (вкус по-украински) восемь
 * раз из одиннадцати — три четверти совпадений были мусором.
 * Без правой границы работает склонение: «Фісташку-малину» находится
 * по корню «фісташ».
 */
const hasMention = (text, keys) => {
  const t = String(text || '').toLowerCase();
  return keys.some((k) => {
    const esc = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^\\p{L}])${esc}`, 'u').test(t);
  });
};

/** Отзывы, в которых упомянут этот вкус. Порядок исходный. */
export function reviewsForFlavor(reviews, slug) {
  const keys = FLAVOR_REVIEW_KEYS[slug];
  if (!keys || !Array.isArray(reviews)) return [];
  return reviews.filter((r) => hasMention(r.text, keys));
}
