import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  LoginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import {
  verifyJWT,
  upload,
  validate,
  authLimiter,
} from "../middlewares/index.js";
import {
  userRegisterschema,
  userLoginSchema,
  changePasswordSchema,
  updateAccountSchema,
} from "../validators/auth.validators.js";

const router = Router();

// Public Routes
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  validate(userRegisterschema),
  registerUser
);

router.route("/login").post(authLimiter, validate(userLoginSchema), LoginUser);
router.route("/refresh-token").post(refreshAccessToken);

// Secured Routes
router.route("/logout").post(verifyJWT, logoutUser);
router
  .route("/change-password")
  .post(verifyJWT, validate(changePasswordSchema), changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router
  .route("/update-account")
  .patch(verifyJWT, validate(updateAccountSchema), updateAccountDetails);
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router
  .route("/forgot-password")
  .post(validate(forgotPasswordSchema), forgotPassword);
router
  .route("/reset-password/:token")
  .post(validate(resetPasswordSchema), resetPassword);

export default router;
