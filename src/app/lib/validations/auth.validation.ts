import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(3),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string().min(3),
    password: z.string().min(3),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
