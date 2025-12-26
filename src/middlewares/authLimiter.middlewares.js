import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
    windowsMs: 15*60*1000,
    max: 20,
    message: "Too many login attempts, please try again after 15 minutes",
    standardHeader: true,
    legacyHeaders: false, // X-RateLimit-Remaining, X-RateLimit-Limit, X-RateLimit-Reset 
})