import express from "express";
import { isAuthenticated, login, logout } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get('/is-auth', authMiddleware, isAuthenticated)

export default router;
