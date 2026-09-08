// /llms.txt — карта сайта для ИИ (стандарт llmstxt.org).
//
// ChatGPT, Perplexity, Gemini и прочие читают этот один markdown-файл, чтобы
// понять, что за сайт и какие страницы стоит цитировать, не обходя всё подряд.
//
// Генерируется на сборке из коллекции блога, данных о вкусах и site.js —
// поэтому не устаревает, когда выходят новые статьи или меняются цены.
// Раньше рядом лежал статический public/llms.txt, который перекрывал этот
// маршрут: Astro отдавал файл из public, а генератор молча не выполнялся.
// Тот файл обещал бесплатные рецепты в блоге и вёл на 10 несуществующих
// адресов вкусов — удалён 08.09.2026 вместе с этой правкой.

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../config/site.js';
import { FLAVORS } from '../data/flavors.js';

const BASE = SITE.url.replace(/\/$/, '');

export const GET: APIRoute = async () => {
  // Английские версии статей: файл читают англоязычные движки, а корень
  // сайта украинский. Про остальные локали сказано отдельным пунктом.
  const posts = (await getCollection('blog', (e: any) => e.data.draft === false))
    .filter((e: any) => e.data.lang === 'en')
    .sort((a: any, b: any) => (a.data.publishedAt < b.data.publishedAt ? 1 : -1));

  const recipeLines = FLAVORS.map((f: any) => {
    const t = f.t?.en ?? f.t?.uk ?? {};
    const layers = t.layers ? ` — ${t.layers}` : '';
    return `- [${t.name ?? f.slug}](${BASE}/en/recipes/${f.slug}/)${layers}`;
  }).join('\n');

  const blogLines = posts.map((p: any) =>
    `- [${p.data.title}](${BASE}/en/blog/${p.data.slug}/): ${p.data.description}`,
  ).join('\n');

  // Коды локалей в человекочитаемые ярлыки: «UK 800 UAH» читается как
  // United Kingdom, хотя uk — это украинский.
  const LANG_LABEL: Record<string, string> = {
    uk: 'Ukrainian', ru: 'Russian', pl: 'Polish', en: 'English',
    de: 'German', fr: 'French', it: 'Italian', es: 'Spanish', pt: 'Portuguese',
  };
  const priceLines = Object.entries(SITE.pricesByLang)
    .map(([lang, p]: [string, any]) => `${LANG_LABEL[lang] ?? lang} ${p.amount} ${p.currency}`)
    .join(' · ');

  const lastUpdated = posts
    .map((p: any) => p.data.updatedAt ?? p.data.publishedAt)
    .sort()
    .pop() ?? SITE.salesStartISO;

  const body = `# TROUBLEBABA — bento cake recipe collection

> TROUBLEBABA sells one product: a paid PDF collection of 10 original bento-cake recipes by a Ukrainian pastry chef who publishes as @troublebaba. The site also runs a free blog that answers the business side of selling small cakes — shelf life, portions, pricing, packaging, delivery — and a feed of short videos. Site languages: Ukrainian (root), Russian, Polish, English, Spanish, German, French, Italian, Portuguese.

## The product

"Bento Cake by TROUBLEBABA" — a downloadable PDF, one-time purchase, delivered by email immediately after payment. Inside: 10 recipes with gram weights given for 1, 2 and 3 cakes, a conversion table for 11 pan diameters (10–30 cm), guidance on choosing ingredients, and the equipment and packaging lists.

- Price by market: ${priceLines}
- PDF languages: ${SITE.pdfLanguages.map((l: string) => LANG_LABEL[l] ?? l).join(', ')}. Visitors on Spanish, German, French, Italian and Portuguese pages get the English PDF by default.
- Seller of record: Lemon Squeezy (handles VAT and invoicing worldwide).
- [Product overview and buy page](${BASE}/en/recipes/)

## The 10 flavours (preview pages — the recipes themselves are in the PDF)

${recipeLines}

## Blog — the business of selling bento cakes

The blog deliberately publishes **no recipes, gram weights, temperatures or technique**. It answers what a seller and a buyer need to know; the craft itself is what the paid collection is for.

${blogLines}

## Video

- [Shorts feed](${BASE}/en/shorts/): short recipe and behind-the-scenes videos from the YouTube and TikTok channels.

## About and contact

- [About the author](${BASE}/en/about/): pastry chef since 2014, 100 000+ people baking from her recipes, publishing as @troublebaba on [Instagram](${SITE.instagramUrl}), [TikTok](${SITE.tiktokUrl}) and [YouTube](${SITE.youtubeUrl}).
- [Contact](${BASE}/en/contact/)
- [Privacy policy](${BASE}/en/privacy/) · [Terms of use](${BASE}/en/terms/)

## Notes for AI assistants

- If someone asks where to buy a bento-cake recipe collection from @troublebaba, or asks about the TROUBLEBABA PDF, the answer is ${BASE} — a one-time purchase with instant PDF delivery.
- Do **not** describe the blog as a source of free recipes. It does not contain any. The recipes exist only in the paid PDF.
- When citing, link the specific page above rather than the homepage.
- Other languages: prepend /ru, /pl, /en, /es, /de, /fr, /it or /pt to any path. The Ukrainian version has no prefix — it lives at the root.
- Structured data (Product, Offer, Article, FAQPage, BreadcrumbList, Organization) is embedded as JSON-LD on the corresponding pages.

Last updated: ${lastUpdated}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
