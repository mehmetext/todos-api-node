import { z } from "zod";

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, "Başlık boş olamaz")
    .max(100, "Başlık 100 karakterden uzun olamaz"),
  description: z
    .string()
    .max(500, "Açıklama 500 karakterden uzun olamaz")
    .optional(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
