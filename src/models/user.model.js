import mongoose, { Schema } from "mongoose";
import { SignJWT } from "jose";
import bcrypt from "bcrypt";
import { conf } from "../conf/index.js";

/**
 * User Schema Definition
 * @typedef {Object} User
 * @property {string} username - Unique username (lowercase)
 * @property {string} email - Unique email address
 * @property {string} fullName - User's full name
 * @property {string} avatar - Cloudinary URL for avatar
 * @property {string} coverImage - Cloudinary URL for cover image
 * @property {string} password - bcrypt hashed password
 * @property {string} refreshToken - JWT Refresh Token
 * @property {string} resetPasswordToken - Token for password reset
 * @property {Date} resetPasswordTokenExpiry - Expiry time for reset token
 */
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // Cloudinary URL
      required: true,
    },
    coverImage: {
      type: String, // Cloudinary URL
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook to hash password if modified.
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/**
 * Validate password against hashed password.
 * @param {string} password - Plain text password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * Generate Short-lived Access Token.
 * - Expires in: 15 minutes (default)
 * @returns {Promise<string>} Signed JWT
 */
userSchema.methods.generateAccessToken = async function () {
  const secret = new TextEncoder().encode(conf.jwt.accessSecret);
  return await new SignJWT({
    _id: this._id.toString(), // Converted to string to avoid Object issue
    email: this.email,
    username: this.username,
    fullName: this.fullName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(conf.jwt.accessExpiry)
    .sign(secret);
};

/**
 * Generate Long-lived Refresh Token.
 * - Expires in: 7 days (default)
 * @returns {Promise<string>} Signed JWT
 */
userSchema.methods.generateRefreshToken = async function () {
  const secret = new TextEncoder().encode(conf.jwt.refreshSecret);
  return await new SignJWT({
    _id: this._id.toString(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(conf.jwt.refreshExpiry)
    .sign(secret);
};

export const User = mongoose.model("User", userSchema);
