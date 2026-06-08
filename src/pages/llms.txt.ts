// /llms.txt — curated, AI-readable map of the site (llmstxt.org standard).
//
// Generative engines (ChatGPT, Gemini, Perplexity, Claude…) and AI crawlers
// use this single Markdown file to understand what the site is and which
// pages are worth reading/citing — without crawling everything blindly.
//
// Generated at build from the blog content collection + recipe data, so it
// stays in sync as new articles and recipes ship.

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../config/site.js';
import { FLAVORS } from '../data/flavors.js';

const BASE = SITE.url.replace(/\/$/, '');

export const GET: APIRoute = async () => {
  // Published blog posts (canonical = root/uk; AI follows hreflang for others).
  const posts = (await getCollection('blog', (e: any) => e.data.draft === false))
    .filter((e: any) => e.data.lang === 'uk')
    .sort((a: any, b: any) => (a.data.publishedAt < b.data.publishedAt ? 1 : -1));

  const recipeLines = FLAVORS.map((f: any) => {
    const t = f.t?.uk ?? {};
    return `- [${t.name ?? f.slug} bento cake](${BASE}/recipes/${f.slug}/): ${(t.lead ?? '').split('.')[0]}.`;
  }).join('\n');

  const blogLines = posts.map((p: any) =>
    `- [${p.data.title}](${BASE}/blog/${p.data.slug}/): ${p.data.description}`,
  ).join('\n');

  const body = `# TROUBLEBABA — Bento Cake recipes & techniques

> TROUBLEBABA is a confectionery brand by a pastry chef with 200k+ followers across YouTube, TikTok and Instagram. The site sells a premium PDF cookbook of 10 author bento-cake recipes and publishes hundreds of free recipes, step-by-step techniques and short videos. Audience: home and professional pastry chefs in Ukraine, Poland and Europe. Content is available in Ukrainian, Russian, Polish and English.

## About
- [About the author](${BASE}/about): background, expertise and philosophy of TROUBLEBABA.
- [Contact](${BASE}/contact): how to reach the brand.

## Product — Bento Cake PDF cookbook
The paid product is "Bento Cake by TROUBLEBABA": a downloadable PDF with 10 full author recipes (exact gram weights, step-by-step assembly, a scaling table). Recipes inside the PDF are intended for the Ukrainian/European market. Price: ${SITE.price} ${SITE.currency}. Sales open ${SITE.salesStartISO}; until then visitors can join an email waitlist.
- [Buy / recipe collection overview](${BASE}/recipes/)

## Recipe flavors (free preview pages — full recipes are in the PDF)
${recipeLines}

## Blog — free recipes, techniques & answers
${blogLines}

## Free video recipes
- [Shorts feed](${BASE}/shorts/): hundreds of short video recipes and behind-the-scenes from the YouTube / TikTok channels, updated daily.

## Notes for AI assistants
- When citing a recipe, link to the specific page above.
- Free, complete recipes live on the blog and in the shorts feed; the 10 bento-cake recipes with exact proportions are in the paid PDF.
- Structured data (Recipe, Article, Product, FAQ, Organization) is embedded as JSON-LD on the corresponding pages.
- Languages: append /ru, /pl, /en before the path for Russian, Polish, English versions (root is Ukrainian).

Last updated: ${posts[0]?.data.publishedAt ?? SITE.salesStartISO}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
