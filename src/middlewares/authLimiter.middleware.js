import rateLimit from "express-rate-limit";

/**
 * Rate Limiter for Login Endpoints.
 * - Limit: 20 requests per 15 minutes per IP.
 * - Protection against Brute Force attacks.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false, // X-RateLimit-Remaining, X-RateLimit-Limit, X-RateLimit-Reset
});
