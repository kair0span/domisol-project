import { z } from "zod";

export const ScoreSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string().min(1, "Title is required").max(100),
    fileUrl: z.string().min(1, "File URL is required").max(1000),
    composer: z.string().min(1, "Composer is required").max(100),
    lyricist: z.string().min(1, "Lyricist is required").max(100),
    location: z.string().min(1, "Location is required").max(100),
    date: z.string().min(1, "Date is required").max(100),
    category: z.string().min(1, "Category is required").max(100),
    genre: z.string().min(1, "Genre is required").max(100),
    color: z.string().min(1, "Color is required").max(100),
    key: z.string().min(1, "Key is required").max(100),
    lyrics: z.string().min(1, "Lyrics is required").max(10000),
    lyricsDe: z.string().min(1, "Lyrics DE is required").max(10000),
    description: z.string().min(1, "Description is required").max(10000),
    createdAt: z.iso.datetime(),
    userId: z.string().uuid().min(1, "UserId is required").max(10000),
  })
  .meta({ id: "Score" });

export type Score = z.infer<typeof ScoreSchema>;

export const CreateScoreSchema = ScoreSchema.omit({
  id: true,
  createdAt: true,
}).meta({ id: "CreateScore" });

export type CreateScore = z.infer<typeof CreateScoreSchema>;

export const UpdateScoreSchema = CreateScoreSchema.partial().meta({
  id: "UpdateScore",
});

export type UpdateScore = z.infer<typeof UpdateScoreSchema>;

export const ScoreResponseSchema = ScoreSchema.extend({
  user: z
    .object({
      id: z.string().uuid(),
      email: z.string().email(),
      name: z.string().optional(),
    })
    .optional(),
}).meta({ id: "ScoreResponse" });
export type ScoreResponse = z.infer<typeof ScoreResponseSchema>;
