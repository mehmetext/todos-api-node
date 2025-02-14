import { z } from "zod";

export const createLabelSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/)
      .optional()
      .default("#000000"),
  }),
});

export const getLabelsSchema = z.object({
  query: z.object({
    page: z.number().optional(),
  }),
});

export type CreateLabelInput = z.infer<typeof createLabelSchema>;
export type UpdateLabelInput = z.infer<typeof createLabelSchema>;
export type GetLabelsInput = z.infer<typeof getLabelsSchema>;
