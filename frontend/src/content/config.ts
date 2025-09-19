import { defineCollection, z } from 'astro:content';

// ページコレクション（home, aboutなど）
const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

// プロジェクトコレクション
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    thumb: z.string().optional(),
    featured: z.boolean().optional().default(false),
    summary: z.string(),
    category: z.string(),
    role: z.string(),
    technologies: z.array(z.string()),
    achievements: z.array(z.string()),
    links: z.object({
      demo: z.string().optional(),
      repo: z.string().optional(),
      architecture: z.string().optional(),
    }).optional(),
  }),
});

export const collections = {
  pages,
  projects,
};