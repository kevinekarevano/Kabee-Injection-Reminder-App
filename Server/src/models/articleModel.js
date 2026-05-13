import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String },
    contentHtml: { type: String },
    coverImage: { type: String }, // URL
    coverPublicId: { type: String }, // cloudinary public id
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    tags: [{ type: String }],
  },
  { timestamps: true },
);

const Article = mongoose.model("Article", ArticleSchema);

export default Article;
