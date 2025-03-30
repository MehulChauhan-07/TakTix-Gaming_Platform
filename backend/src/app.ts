import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/errorMiddleware";
import authRoutes from "./routes/auth.Routes";
import userRoutes from "./routes/user.Routes";
import gameRoutes from "./routes/game.Routes";
import leaderboardRoutes from "./routes/leaderboard.routes";
import tournamentRoutes from "./routes/tournament.routes";
import { globalLimiter, authLimiter } from "./middleware/rateLimit";

const app: Application = express();
// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposedHeaders: ["set-cookie"],
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cookieParser());

// Rate limiting
app.use(globalLimiter);

// Use morgan logger only in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "TakTix Gaming Platform API",
    version: "1.0.0",
  });
});

// Apply specific rate limiters to sensitive routes
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/leaderboards", leaderboardRoutes);
app.use("/api/tournaments", tournamentRoutes);

// Error handling
app.use(errorMiddleware);

// 404 Route
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
});

export default app;
