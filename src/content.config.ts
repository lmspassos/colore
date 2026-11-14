import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    order: z.number().default(99),
  }),
});

const materiais = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/materiais' }),
  schema: z.object({
    title: z.string(),
    file: z.string().describe('caminho em public/downloads, ex: /downloads/materiais/x.pdf'),
  }),
});

export const collections = { faq, materiais };
