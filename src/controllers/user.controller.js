import { ApiResponse, asyncHandler } from "../utils/index.js";
import { conf } from "../conf/index.js";
import { userService } from "../services/user.service.js";
import { userService } from "../services/user.service.js";

/**
 * Register a new user.
 * - Delegate business logic to UserService.
 */
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  // Extract file paths
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  // Call Service
  const createdUser = await userService.registerUser({
    fullName,
    email,
    username,
    password,
    avatarLocalPath,
    coverImageLocalPath,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

/**
 * Login user.
 */
const LoginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const { user, accessToken, refreshToken } = await userService.loginUser({
    email,
    username,
    password,
  });

  const options = {
    httpOnly: true,
    secure: conf.nodeEnv === "production",
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await userService.logoutUser(req.user._id);

  const options = {
    httpOnly: true,
    secure: conf.nodeEnv === "production",
    sameSite: "None",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  const { accessToken, refreshToken: newRefreshToken } =
    await userService.refreshAccessToken(incomingRefreshToken);

  const options = {
    httpOnly: true,
    secure: conf.nodeEnv === "production",
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Access token refreshed successfully"
      )
    );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  await userService.changeCurrentPassword(
    req.user?._id,
    oldPassword,
    newPassword
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  const user = await userService.updateAccountDetails(req.user._id, {
    fullName,
    email,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

// Update User Avatar
const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  const user = await userService.updateUserAvatar(
    req.user?._id,
    avatarLocalPath
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

// Update User Cover Image
const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  const user = await userService.updateUserCoverImage(
    req.user?._id,
    coverImageLocalPath
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

/**
 * Forgot Password.
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await userService.forgotPassword(email);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset link sent successfully"));
});

/**
 * Reset Password.
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  await userService.resetPassword(token, password);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

export {
  registerUser,
  LoginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  forgotPassword,
  resetPassword,
};
