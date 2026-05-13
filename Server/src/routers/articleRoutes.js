import express from "express";
import upload from "../middlewares/multer.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { createArticle, getArticles, getArticleBySlug, getArticleById, updateArticle, deleteArticle } from "../controllers/articleController.js";

const router = express.Router();

// Public: list & view
router.get("/", getArticles);
router.get("/id/:id", getArticleById);
router.get("/:slug", getArticleBySlug);

// Protected (admin): create, update, delete
router.post("/", authMiddleware, adminMiddleware, upload.single("cover"), createArticle);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("cover"), updateArticle);
router.delete("/:id", authMiddleware, adminMiddleware, deleteArticle);

export default router;
