import express from "express";
import { confirmInjection, createUser, deleteUser, getAllUsers, getInjectionHistory, getUserById, getUserData, sendMessage, updatedUser } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();
import multer from "multer";
import adminMiddleware from "../middlewares/adminMiddleware.js";
const upload = multer();

router.get("/all", authMiddleware, adminMiddleware, getAllUsers);
router.get("/profile", authMiddleware, getUserData);
router.get("/injection-history/", authMiddleware, getInjectionHistory);
router.get("/injection-history/:id", authMiddleware, getInjectionHistory);
router.get("/id/:id", authMiddleware, adminMiddleware, getUserById);
router.post("/create", authMiddleware, adminMiddleware, upload.single("avatar"), createUser);
router.post("/send-message/:id", authMiddleware, adminMiddleware, sendMessage);
router.patch("/confirmation", authMiddleware, confirmInjection);
router.patch("/update/:id", authMiddleware, adminMiddleware, upload.single("avatar"), updatedUser);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteUser);

export default router;
