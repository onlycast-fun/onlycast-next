import { z } from "zod";

export const createPostSchema = z.object({
  description: z
    .string()
    .min(1, "Description cannot be empty")
    .max(500, "Description cannot exceed 200 characters"),
  encryptedContent: z
    .string()
    .max(10000, "Content cannot exceed 10000 characters")
    .optional(),
  encryptedImage: z.instanceof(File).optional(),
});

export const createTokenSchema = z
  .object({
    name: z
      .string()
      .min(1, "Token name cannot be empty")
      .max(50, "Name cannot exceed 50 characters"),
    symbol: z
      .string()
      .min(1, "Token symbol cannot be empty")
      .max(10, "Symbol cannot exceed 10 characters")
      .toUpperCase(),
    image: z.instanceof(File, { message: "Please upload a token image" }),
    percentage: z
      .number()
      .min(0, "Percentage cannot be negative")
      .max(100, "Percentage cannot exceed 100")
      .optional(),
    durationInDays: z
      .number()
      .min(0, "Duration cannot be negative")
      .max(365, "Duration cannot exceed 365 days")
      .optional(),
  })
  .refine(
    (data) => {
      // If percentage is set (> 0), duration must be at least 31 days
      if (data.percentage && data.percentage > 0) {
        return data.durationInDays && data.durationInDays >= 31;
      }
      return true;
    },
    {
      message: "Duration must be at least 31 days when percentage is set",
      path: ["durationInDays"],
    }
  );

export type CreatePostData = z.infer<typeof createPostSchema>;
export type CreateTokenData = z.infer<typeof createTokenSchema>;
