import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog posts. Each post is a markdown file under src/content/blog/<lang>/<slug>.md
// Front-matter drives meta + listing. `draft: true` keeps a post out of the
// build/sitemap until the author has reviewed it (E-E-A-T: real expertise).
const blog = defineCollection({
  // generateId keeps the lang directory in the id (ru/slug vs uk/slug) so the
  // same slug in two languages doesn't collide (default strips to filename).
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/blog',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    lang:        z.enum(['uk', 'ru', 'pl', 'en', 'es', 'de', 'fr', 'it', 'pt']),
    slug:        z.string(),                 // shared URL slug across languages
    publishedAt: z.string(),                 // ISO date
    updatedAt:   z.string().optional(),
    cover:       z.string().optional(),      // image path under /images/...
    tags:        z.array(z.string()).default([]),
    draft:       z.boolean().default(true),  // unpublished until author approves
    excerpt:     z.string().optional(),

    // Optional structured recipe → drives Recipe JSON-LD (Google rich results).
    // The human-readable recipe still lives in the markdown body; this is the
    // machine-readable mirror for search engines.
    recipe: z.object({
      name:            z.string(),
      yield:           z.string().optional(),   // e.g. "1200–1270 г"
      category:        z.string().optional(),   // e.g. "Десерт"
      cuisine:         z.string().optional(),
      prepTime:        z.string().optional(),   // ISO 8601 duration, e.g. "PT30M"
      totalTime:       z.string().optional(),
      ingredients:     z.array(z.string()),     // flat list for schema
      steps:           z.array(z.string()),     // ordered HowToStep texts
      videoUrl:        z.string().optional(),    // source reel/short
    }).optional(),
  }),
});

export const collections = { blog };
