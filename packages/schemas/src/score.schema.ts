import { z } from "zod";

export const ScoreSchema = z
  .object({
    id: z.string(),
    title: z.string().min(1, "Title is required").max(100),
    composer: z.string().min(1, "Composer is required").max(100),
    lyricist: z.string().min(1, "Lyricist is required").max(100),
    description: z.string().min(1, "Description is required").max(10000),
    location: z.string().min(1, "Location is required").max(100),
    category: z.string().min(1, "Category is required").max(100),
    color: z.string().min(1, "Color is required").max(100),
    key: z.string().min(1, "Key is required").max(100),
    genre: z.string().min(1, "Genre is required").max(100),
    lyrics: z.string().min(1, "Lyrics is required").max(10000),
    date: z.string(),
    createdAt: z.string(),
    userId: z.string().nullable(),
  })
  .meta({ id: "Score" });

export type Score = z.infer<typeof ScoreSchema>;

export const CreateScoreSchema = ScoreSchema.omit({
  id: true,
  createdAt: true,
  userId: true,
}).extend({
  userId: z.string().uuid().optional(),
}).meta({ id: "CreateScore" });

export type CreateScore = z.infer<typeof CreateScoreSchema>;

export const UpdateScoreSchema = CreateScoreSchema.partial().meta({
  id: "UpdateScore",
});

export type UpdateScore = z.infer<typeof UpdateScoreSchema>;

export const ScoreResponseSchema = ScoreSchema.meta({ id: "ScoreResponse" });
export type ScoreResponse = z.infer<typeof ScoreResponseSchema>;
