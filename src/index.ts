import "dotenv/config";
import "dd-trace";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import config from "./config";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import { path } from "./lib/path";
import { jwtAuthentication } from "./middleware/jwt";

const app = express();

/**
 * Middleware
 */
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));

app.use(jwtAuthentication);

/**
 * Routes
 */
app.use(path.build.api("auth"), authRoutes);
app.use(path.build.api("users"), userRoutes);

/**
 * Error handling middleware, must be the last middleware
 */
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
    });
  }
);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
