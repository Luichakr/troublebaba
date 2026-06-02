import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog posts. Each post is a markdown file under src/content/blog/<lang>/<slug>.md
// Front-matter drives meta + listing. `draft: true` keeps a post out of the
// build/sitemap until the author has reviewed it (E-E-A-T: real expertise).
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    lang:        z.enum(['uk', 'ru', 'pl', 'en']),
    slug:        z.string(),                 // shared URL slug across languages
    publishedAt: z.string(),                 // ISO date
    updatedAt:   z.string().optional(),
    cover:       z.string().optional(),      // image path under /images/...
    tags:        z.array(z.string()).default([]),
    draft:       z.boolean().default(true),  // unpublished until author approves
    excerpt:     z.string().optional(),
  }),
});

export const collections = { blog };
