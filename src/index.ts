import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { expressjwt as jwt } from "express-jwt";
import tracer from "dd-trace";

// Initialize Datadog tracer
tracer.init({
  logInjection: true,
});

// Import routes (we'll create these next)
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("combined")); // You can customize the format

// JWT authentication middleware
const authenticateJWT = jwt({
  secret: process.env.JWT_SECRET || "your-secret-key",
  algorithms: ["HS256"],
}).unless({
  path: [
    "/api/auth/login",
    "/api/auth/register",
    // Add other public routes here
  ],
});

app.use(authenticateJWT);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Error handling middleware
app.use(
  (
    err: any,
    // req: express.Request,
    res: express.Response
    // next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
    });
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
