import { z } from "zod";
import type { PartialBlock } from "@blocknote/core";

export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(80);
export const mediaSchema = z.object({
  src: z.string().regex(/^\/portfolio\/media\/[a-z0-9-]+\/[a-zA-Z0-9._-]+$/),
  alt: z.string().min(1).max(500),
});
export type Media = z.infer<typeof mediaSchema>;
const blockSchema = z.object({ type: z.string() }).passthrough();
export const projectSchema = z.object({
  slug: slugSchema,
  cover: mediaSchema.optional(),
  title: z.string().trim().min(1).max(160),
  category: z.enum(["game", "tool"]),
  description: z.string().max(2000),
  role: z.string().max(2000),
  tags: z.array(z.string().trim().min(1).max(60)).max(30),
  links: z
    .array(
      z.object({
        label: z.string().min(1).max(100),
        href: z
          .url()
          .refine(
            (value) => /^https?:/.test(value),
            "http(s)のURLを指定してください",
          ),
      }),
    )
    .max(20),
  published: z.boolean(),
  team: z.string().max(300),
  period: z.string().max(300),
  lastUpdated: z.string().max(300).optional(),
  blocks: z.array(blockSchema).min(1).max(3000),
});
export type Project = Omit<z.infer<typeof projectSchema>, "blocks"> & {
  blocks: PartialBlock[];
};

export const skillsSchema = z.object({
  strengths: z.array(
    z.object({
      title: z.string().min(1).max(100),
      description: z.string().max(1000),
    }),
  ),
  skills: z.array(
    z.object({
      name: z.string().min(1).max(80),
      category: z.enum(["言語", "ツール", "フレームワーク"]),
      level: z.number().int().min(1).max(5).nullable(),
      note: z.string().max(1000).default(""),
    }),
  ),
});
export type Skills = z.infer<typeof skillsSchema>;
export const levels = [
  "",
  "学習中",
  "使用経験あり",
  "基本を使える",
  "制作で使える",
  "得意",
] as const;

export const workEntrySchema = z.object({
  id: slugSchema,
  title: z.string().min(1),
  description: z.string(),
  detail: z.string().optional(),
  tags: z.array(z.string().min(1)),
  image: mediaSchema.optional(),
  links: z.array(z.object({ label: z.string(), href: z.url() })).optional(),
});
export const collectionsSchema = z.object({
  experience: z.array(workEntrySchema),
  inProgress: z.array(workEntrySchema),
});
export type WorkEntry = z.infer<typeof workEntrySchema>;
