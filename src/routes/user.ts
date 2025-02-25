import express from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Zod schema for user creation
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).optional(),
  password: z.string().min(6),
});

router.post("/", async (req, res) => {
  try {
    // Validate request body
    const userData = createUserSchema.parse(req.body);

    const user = await prisma.user.create({
      data: userData,
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

export default router;
