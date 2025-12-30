// Validating existence of required environment variables
const requiredEnvs = [
  "MONGODB_URI",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "CLOUDINARY_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "RESEND_API_KEY",
  "FRONTEND_URL",
];
// In production, we want to fail fast if keys are missing.
// In development, sometimes we might be lazy, but it's better to be strict.
requiredEnvs.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`WARNING: Missing Environment Variable: ${key}`);
    // throw new Error(`Missing Environment Variable: ${key}`); // Uncomment for strict mode
  }
});


const conf = {
  port: process.env.PORT || 8000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri: process.env.MONGODB_URI,
  corsOrigin: process.env.CORS_ORIGIN || "*",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  jwt: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    accessExpiry: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  resend: {
    apiKey: process.env.RESEND_API_KEY,
  },
};

export { conf };
