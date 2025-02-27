import express, { Request, Response } from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  registerSchema,
  loginSchema,
  RegisterSchema,
} from "../schema/routes/auth";
import config from "../config";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const userData: RegisterSchema = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: "24h" }
    );

    const { password, ...userWithoutPassword } = user;

    return res.status(201).json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    } else {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const credentials = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: "24h" }
    );

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    } else {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
});

export default router;
