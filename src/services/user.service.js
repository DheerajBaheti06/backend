import { User } from "../models/user.model.js";
import {
  ApiError,
  uploadOnCloudinary,
  deleteLocalFile,
  sendEmail,
} from "../utils/index.js";
import { jwtVerify } from "jose";
import { conf } from "../conf/index.js";
import crypto from "crypto";

/**
 * Service Layer for User Operations.
 * Separates business logic from Controller (HTTP) logic.
 */
class UserService {
  /**
   * Register a new user.
   *
   * @param {Object} data - User details (fullName, email, username, password)
   * @param {string} avatarLocalPath - Path to the uploaded avatar file
   * @param {string} coverImageLocalPath - (Optional) Path to the uploaded cover image file
   * @returns {Promise<Object>} Created user object
   */
  async registerUser({
    fullName,
    email,
    username,
    password,
    avatarLocalPath,
    coverImageLocalPath,
  }) {
    // 1. Check if user already exists
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      // Cleanup files if user exists
      if (avatarLocalPath) deleteLocalFile(avatarLocalPath);
      if (coverImageLocalPath) deleteLocalFile(coverImageLocalPath);

      throw new ApiError(409, "User already exists");
    }

    // 2. Validate Avatar
    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
    }

    // 3. Upload to Cloudinary
    // Pass folder name "avatars"
    const avatar = await uploadOnCloudinary(avatarLocalPath, "avatars");

    // Pass folder name "cover-images"
    const coverImage = coverImageLocalPath
      ? await uploadOnCloudinary(coverImageLocalPath, "cover-images")
      : null;

    if (!avatar) {
      throw new ApiError(400, "Avatar file is required");
    }

    // 4. Create User in DB
    const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase(),
    });

    // 5. Return Created User (sanitized)
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering user");
    }

    return createdUser;
  }

  /**
   * Login user and generate tokens.
   */
  async loginUser({ email, username, password }) {
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(String(password));
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } =
      await this.generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return { user: loggedInUser, accessToken, refreshToken };
  }

  /**
   * Logout user by clearing refresh token.
   */
  async logoutUser(userId) {
    await User.findByIdAndUpdate(
      userId,
      {
        $unset: { refreshToken: 1 },
      },
      {
        new: true,
      }
    );
  }

  /**
   * Refresh access token.
   */
  async refreshAccessToken(incomingRefreshToken) {
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    try {
      const secret = new TextEncoder().encode(conf.jwt.refreshSecret);
      const { payload } = await jwtVerify(incomingRefreshToken, secret);

      const user = await User.findById(payload?._id);
      if (!user) {
        throw new ApiError(401, "Invalid refresh token");
      }

      if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or used");
      }

      const { accessToken, newRefreshToken } =
        await this.generateAccessAndRefreshTokens(user._id);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid refresh token");
    }
  }

  /**
   * Change current password.
   */
  async changeCurrentPassword(userId, oldPassword, newPassword) {
    const user = await User.findById(userId);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
  }

  /**
   * Update account details.
   */
  async updateAccountDetails(userId, { fullName, email }) {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          fullName,
          email,
        },
      },
      { new: true }
    ).select("-password");

    return user;
  }

  /**
   * Update User Avatar.
   */
  async updateUserAvatar(userId, avatarLocalPath) {
    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath, "avatars");
    if (!avatar.url) {
      throw new ApiError(400, "Error while uploading avatar");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          avatar: avatar.url,
        },
      },
      { new: true }
    ).select("-password");

    return user;
  }

  /**
   * Update User Cover Image.
   */
  async updateUserCoverImage(userId, coverImageLocalPath) {
    if (!coverImageLocalPath) {
      throw new ApiError(400, "Cover image file is missing");
    }

    const coverImage = await uploadOnCloudinary(
      coverImageLocalPath,
      "cover-images"
    );
    if (!coverImage.url) {
      throw new ApiError(400, "Error while uploading cover image");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          coverImage: coverImage.url,
        },
      },
      { new: true }
    ).select("-password");

    return user;
  }

  /**
   * Forgot Password.
   */
  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Generate token
    const resetToken = crypto.randomInt(100000, 999999).toString();

    // Save to DB
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = Date.now() + 900000; // 15 minutes
    await user.save({ validateBeforeSave: false });

    // Send Email
    const resetLink = `${conf.frontendUrl}/reset-password/${resetToken}`;

    // Ideally, template logic could be in a separate "EmailService" or utility,
    // but for now, we keep the HTML generation here or pass it.
    // To keep it clean, let's keep the HTML here.
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f7; color: #51545e; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #eee;">
            <h1 style="margin: 0; color: #333; font-size: 24px;">Sentinel IAM</h1>
          </div>
          <div style="padding: 30px 20px;">
            <p>Hi ${user.fullName},</p>
            <p>You requested a password reset for your Sentinel IAM account.</p>
            <p>Click the button below to reset your password. This link is valid for <strong>15 minutes</strong>.</p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${resetLink}" style="display: inline-block; background-color: #007bff; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            </div>
            <p style="margin-top: 30px;">If you didn't ask to reset your password, you can safely ignore this email.</p>
          </div>
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #6b6e76;">
            <p>&copy; ${new Date().getFullYear()} Sentinel IAM. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await sendEmail(user.email, "Reset Password", html);

    if (!emailResponse) {
      throw new ApiError(
        500,
        "Failed to send email. Please check server logs."
      );
    }
  }

  /**
   * Reset Password.
   */
  async resetPassword(token, newPassword) {
    if (!token) {
      throw new ApiError(400, "Invalid reset token");
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(400, "Invalid or expired reset token");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save({ validateBeforeSave: false });
  }

  /**
   * Helper: Generate Tokens
   */
  async generateAccessAndRefreshTokens(userId) {
    try {
      const user = await User.findById(userId);
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(500, "Something went wrong while generating tokens");
    }
  }
}

export const userService = new UserService();
