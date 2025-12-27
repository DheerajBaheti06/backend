import mongoose, { Schema } from "mongoose";
import { SignJWT } from "jose";
import bcrypt from "bcrypt";

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
      type: String, // cloudinary url
    },
    coverImage: {
      type: String, // cloudinary url
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Validate password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Access Token (Async)
userSchema.methods.generateAccessToken = async function () {
  const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
  return await new SignJWT({
    _id: this._id,
    email: this.email,
    username: this.username,
    fullName: this.fullName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRY)
    .sign(secret);
};

// Generate Refresh Token (Async)
userSchema.methods.generateRefreshToken = async function () {
  const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);
  return await new SignJWT({
    _id: this._id,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.REFRESH_TOKEN_EXPIRY)
    .sign(secret);
};

export const User = mongoose.model("User", userSchema);
