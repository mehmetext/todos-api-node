import { z } from "zod";

export const createTodoSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Başlık boş olamaz")
      .max(100, "Başlık 100 karakterden uzun olamaz"),
    content: z
      .string()
      .max(500, "Açıklama 500 karakterden uzun olamaz")
      .optional(),
    labels: z.array(
      z.object({
        id: z.string().optional(),
        name: z.string().optional(),
      })
    ),
  }),
});

export const updateTodoSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    completed: z.boolean().optional(),
  }),
});

export const getTodosSchema = z.object({
  query: z.object({
    sort: z
      .enum([
        "ascByCreatedAt",
        "descByCreatedAt",
        "ascByUpdatedAt",
        "descByUpdatedAt",
        "ascByCompleted",
        "descByCompleted",
        "ascByTitle",
        "descByTitle",
        "ascByContent",
        "descByContent",
      ])
      .optional(),
    q: z.string().optional(),
    page: z.coerce.number().min(1).optional(),
    labels: z.string().optional(),
  }),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type GetTodosInput = z.infer<typeof getTodosSchema>;
