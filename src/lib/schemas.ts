import { z } from "zod";

export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Content cannot be empty")
    .max(500, "Content cannot exceed 500 characters"),
  image: z.instanceof(File).optional(),
});

export const createTokenSchema = z.object({
  name: z
    .string()
    .min(1, "Token name cannot be empty")
    .max(50, "Name cannot exceed 50 characters"),
  symbol: z
    .string()
    .min(1, "Token symbol cannot be empty")
    .max(10, "Symbol cannot exceed 10 characters")
    .toUpperCase(),
  image: z.string().url("Please enter a valid image URL"),
  percentage: z
    .number()
    .min(0, "Percentage cannot be less than 0")
    .max(100, "Percentage cannot exceed 100")
    .optional(),
  durationInDays: z
    .number()
    .min(0, "Duration cannot be less than 1 day")
    .optional(),
});

export type CreatePostData = z.infer<typeof createPostSchema>;
export type CreateTokenData = z.infer<typeof createTokenSchema>;
