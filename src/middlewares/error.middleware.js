import mongoose from "mongoose";
import { ApiError } from "../utils/index.js";
import { ZodError } from "zod"; // This was missing!

const errorHandler = (err, req, res, next) => {
  let error = err;

  // 1. Handle Zod Errors
  if (error instanceof ZodError || error.name === "ZodError") {
    const issues = error.issues || error.errors || [];
    const exactMessage = issues
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ") || "Validation Error";

    error = new ApiError(400, exactMessage, issues, err.stack);
  }

  // 2. Handle MongoDB Unique Constraint
  else if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error = new ApiError(400, message);
  }

  // 3. Wrap other errors
  if (!(error instanceof ApiError)) {
    const statusCode = error instanceof mongoose.Error ? 400 : 500;
    const message = error?.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};

export { errorHandler };