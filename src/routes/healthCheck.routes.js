import { Router } from "express";
import healthCheck from "../controllers/healthCheck.controller.js";
import { verifyJWT } from "../middlewares/index.js";
const router = Router();
router.use(verifyJWT);

/**
 * @route   GET /api/v1/health-check
 * @desc    Check system health status.
 * @access  Protected
 */
router.route("/").get(healthCheck);

export default router;
