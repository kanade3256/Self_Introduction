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

// プロジェクトコレクション（Phase5対応）
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(), // 年月形式（YYYY-MM）をサポート
    summary: z.string(),
    category: z.string(),
    role: z.string(),
    technologies: z.array(z.string()),
    tags: z.array(z.string()).default([]),
    achievements: z.array(z.string()).default([]),
    links: z.object({
      demo: z.string().url().optional(),
      repo: z.string().url().optional(),
      github: z.string().url().optional(),
      pdf: z.string().url().optional(),
      architecture: z.string().url().optional(),
    }).partial().optional(),
    thumb: z.string().optional(),
    cover: z.string().optional(), // 追加：カバー画像
    featured: z.boolean().default(false),
    period: z.string().optional(), // 追加：期間表示
    status: z.enum(['completed', 'ongoing', 'paused']).default('completed'),
  }),
});

export const collections = {
  pages,
  projects,
};