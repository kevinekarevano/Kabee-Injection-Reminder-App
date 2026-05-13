import Article from "../models/articleModel.js";
import cloudinary from "../config/cloudinary.js";

const makeSlug = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Helper to upload buffer (multer memory) to Cloudinary using data URI
const uploadBufferToCloudinary = async (fileBuffer, mimeType, folder = "kabee/articles") => {
  const base64 = fileBuffer.toString("base64");
  const dataUri = `data:${mimeType};base64,${base64}`;
  const result = await cloudinary.uploader.upload(dataUri, { folder });
  return result;
};

export const createArticle = async (req, res) => {
  try {
    const { title, slug, excerpt, contentHtml, tags } = req.body;
    const nextSlug = slug?.trim() || makeSlug(title);

    let coverImage = null;
    let coverPublicId = null;

    if (req.file) {
      const result = await uploadBufferToCloudinary(req.file.buffer, req.file.mimetype);
      coverImage = result.secure_url;
      coverPublicId = result.public_id;
    }

    const newArticle = await Article.create({
      title,
      slug: nextSlug,
      excerpt,
      contentHtml,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim())) : [],
      coverImage,
      coverPublicId,
      author: req.user?.id,
      status: req.body.status || "draft",
    });

    res.status(201).json({ success: true, article: newArticle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create article" });
  }
};

export const getArticles = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status) query.status = status;

    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Article.countDocuments(query);

    res.json({ success: true, data: articles, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch articles" });
  }
};

export const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await Article.findOne({ slug });
    if (!article) return res.status(404).json({ success: false, message: "Article not found" });
    res.json({ success: true, article });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch article" });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ success: false, message: "Article not found" });
    res.json({ success: true, article });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch article" });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ success: false, message: "Article not found" });

    // If a new file provided, remove old and upload new
    if (req.file) {
      if (article.coverPublicId) {
        try {
          await cloudinary.uploader.destroy(article.coverPublicId);
        } catch (e) {
          console.warn("Failed to destroy old cloudinary image", e.message || e);
        }
      }
      const result = await uploadBufferToCloudinary(req.file.buffer, req.file.mimetype);
      article.coverImage = result.secure_url;
      article.coverPublicId = result.public_id;
    }

    const { title, slug, excerpt, contentHtml, tags, status } = req.body;
    if (title) article.title = title;
    article.slug = slug?.trim() || makeSlug(title || article.title);
    if (excerpt) article.excerpt = excerpt;
    if (contentHtml) article.contentHtml = contentHtml;
    if (tags) article.tags = Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim());
    if (status) article.status = status;

    await article.save();

    res.json({ success: true, article });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update article" });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ success: false, message: "Article not found" });

    if (article.coverPublicId) {
      try {
        await cloudinary.uploader.destroy(article.coverPublicId);
      } catch (e) {
        console.warn("Failed to destroy cloudinary image", e.message || e);
      }
    }

    await article.deleteOne();

    res.json({ success: true, message: "Article deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete article" });
  }
};
