import rateLimit from "express-rate-limit";

/**
 * Rate Limiter for Email Endpoints.
 * - Limit: 3 requests per 15 minutes per IP.
 * - Protection against Email Bombing.
 */
export const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 requests per windowMs
  message: {
    success: false,
    statusCode: 429,
    message:
      "Too many password reset emails sent from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
