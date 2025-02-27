import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type RegisterSchema = z.infer<typeof registerSchema>;
type LoginSchema = z.infer<typeof loginSchema>;

export { registerSchema, loginSchema, RegisterSchema, LoginSchema };
