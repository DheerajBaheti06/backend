import { jwtVerify } from "jose";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { conf } from "../conf/index.js";

/**
 * Middleware to verify JWT Access Token.
 * - Checks cookies or Authorization header.
 * - Decodes token and attaches user to `req.user`.
 */
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }

    const secret = new TextEncoder().encode(conf.jwt.accessSecret);
    const { payload } = await jwtVerify(token, secret);

    const user = await User.findById(payload?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
