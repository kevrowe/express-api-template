import { z } from "zod";

const registerRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).optional(),
});

const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type RegisterRequest = z.infer<typeof registerRequestSchema>;
type LoginRequest = z.infer<typeof loginRequestSchema>;

export {
  registerRequestSchema,
  loginRequestSchema,
  RegisterRequest,
  LoginRequest,
};
