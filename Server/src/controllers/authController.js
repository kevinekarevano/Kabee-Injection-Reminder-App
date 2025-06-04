import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";

// login
export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  try {
    const findUser = await userModel.findOne({ username });
    if (!findUser) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // create token
    const token = jwt.sign({ id: findUser._id, role: findUser.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // set cookie
    res.cookie("token", token, {
      httpOnly: true, // only accessible by the web server
      secure: process.env.NODE_ENV === "production", // set to true if using https
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // set to 'none' for cross-site cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({ success: true, message: `Welcome ${findUser.username}!` });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// logout
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true, // only accessible by the web server
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// isAuthenticated
export const isAuthenticated = (req, res) => {
  try {
    return res.status(200).json({ success: true, message: "Authenticated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
