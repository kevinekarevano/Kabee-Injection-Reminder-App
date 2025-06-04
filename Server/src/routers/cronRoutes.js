import express from "express";
import { handleCron, reminderStats } from "../controllers/cronController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
const router = express.Router();

router.get("/run-cron", handleCron);
router.get("/reminder-stats", authMiddleware, adminMiddleware, reminderStats);

export default router;
