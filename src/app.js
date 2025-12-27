import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

const app = express();

// Security: Helmet for headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// Middleware: Body parsing and cookies
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes Import
import userRouter from "./routes/user.routes.js";
import healthRouter from "./routes/healthCheck.routes.js";
import { errorHandler } from "./middlewares/index.js";

// Routes Declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/health", healthRouter);

app.use(errorHandler);

export { app };
