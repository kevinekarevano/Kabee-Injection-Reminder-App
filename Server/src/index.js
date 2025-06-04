import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
const PORT = process.env.PORT || 5000;
import cors from "cors";

import connectDB from "./config/connectDB.js";
import userRoutes from "./routers/userRoutes.js";
import authRoutes from "./routers/authRoutes.js";
import cronRoutes from "./routers/cronRoutes.js";
import cookieParser from "cookie-parser";
import "./services/telegramBot.js";
import "./services/injectionReminder.js";

// Connect to MongoDB
connectDB();

// allow cross-origin requests
const allowedOrigins = [process.env.CLIENT_URL];

// Middleware
app.use(express.json()); // for parsing application/json
app.use(cookieParser()); // for parsing cookies
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors({ origin: allowedOrigins, credentials: true })); // allow cross-origin requests with credentials

// API routes
app.get("/", (req, res) => res.send("Kabee!"));
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cron", cronRoutes);

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
