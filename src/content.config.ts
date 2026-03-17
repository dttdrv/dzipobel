import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const literature = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/literature" }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    author: z.string(),
    genre: z.string(),
    theme: z.string(),
    excerpt: z.string(),
    aboutAuthor: z.string(),
    aboutWork: z.string(),
    readUrl: z.string().url(),
    readSource: z.string(),
    motifs: z.array(z.string()),
    conflicts: z.array(z.string()),
    message: z.string(),
    tags: z.array(z.string()).default([]),
    sections: z.array(
      z.object({
        title: z.string(),
        items: z.array(z.string()),
      }),
    ),
  }),
});

const grammar = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/grammar" }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    module: z.string(),
    sectionTitle: z.string(),
    excerpt: z.string(),
    bullets: z.array(z.string()),
    tags: z.array(z.string()).default([]),
    sections: z.array(
      z.object({
        title: z.string(),
        items: z.array(z.string()),
      }),
    ),
  }),
});

export const collections = { literature, grammar };
