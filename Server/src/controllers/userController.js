import userModel from "../models/userModel.js";
import reminderLogModel from "../models/reminderLogModel.js";
import injectionHistoryModel from "../models/injectionHistoryModel.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import bot from "../services/telegramBot.js";
import chatHistoryModel from "../models/chatHistoryModel.js";

dayjs.extend(isSameOrBefore);

const getNextPillDateTime = (dailyPillTime) => {
  if (!dailyPillTime) return null;

  const [hours, minutes] = dailyPillTime.split(":").map(Number);
  const now = dayjs();
  let nextPillDateTime = dayjs().hour(hours).minute(minutes).second(0).millisecond(0);

  if (nextPillDateTime.isSame(now) || nextPillDateTime.isBefore(now)) {
    nextPillDateTime = nextPillDateTime.add(1, "day");
  }

  return nextPillDateTime.toDate();
};

export const getUserData = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.nextInjectionDate) {
      const today = dayjs().startOf("day");
      const nextInjectionDay = dayjs(user.nextInjectionDate).startOf("day");

      if (user.isConfirmed && nextInjectionDay.isSameOrBefore(today)) {
        user.isConfirmed = false;
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "User data retrieved successfully",
      data: {
        id: user._id,
        username: user.username,
        telegramChatID: user.telegramChatID,
        registrationCode: user.registrationCode,
        avatar: user.avatar.url,
        injectionType: user.injectionType,
        contraceptiveMethod: user.contraceptiveMethod,
        dailyPillTime: user.dailyPillTime,
        nextInjectionDate: user.nextInjectionDate,
        lastInjectionDate: user.lastInjectionDate,
        registrationCode: user.registrationCode,
        role: user.role,
        isConfirmed: user.isConfirmed,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving user data", error: error.message });
  }
};

export const createUser = async (req, res) => {
  let { username, nik, weight, height, numberOfChildren, birthDate, address, religion, phoneNumber, password, contraceptiveMethod, dailyPillTime } = req.body;
  const avatarFile = req.file;

  username = username.trim();
  password = password.trim();
  phoneNumber = phoneNumber.trim();
  address = address.trim();
  nik = nik.trim();

  if (!username || !password || !nik || !birthDate || !address || !religion || !phoneNumber || !avatarFile || !weight || !height || !numberOfChildren) {
    return res.status(400).json({ success: false, message: "Please provide all required fields" });
  }

  const normalizedMethod = contraceptiveMethod || "injection";
  if (normalizedMethod === "pill" && (!dailyPillTime || !dailyPillTime.trim())) {
    return res.status(400).json({ success: false, message: "Daily pill time is required for pill method" });
  }

  // Check if the user already exists
  const existingUser = await userModel.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ success: false, message: "Username already exists" });
  }

  try {
    // Upload avatar to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "avatars" }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(avatarFile.buffer);
    });

    if (!uploadResponse) {
      return res.status(500).json({ success: false, message: "Failed to upload avatar" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // const lastInjectionDate = dayjs(); // Tetap sebagai objek dayjs
    // let nextInjectionDate;

    // if (injectionType === "1_month") {
    //   nextInjectionDate = lastInjectionDate.add(1, "month"); // Tambahkan 1 bulan
    // } else if (injectionType === "3_month") {
    //   nextInjectionDate = lastInjectionDate.add(3, "month"); // Tambahkan 3 bulan
    // }

    // const lastInjectionDateAsDate = lastInjectionDate.toDate();
    // const nextInjectionDateAsDate = nextInjectionDate.toDate();

    const initialNextPillDate = normalizedMethod === "pill" ? getNextPillDateTime(dailyPillTime) : null;

    const newUser = await userModel.create({
      username,
      nik,
      weight,
      height,
      numberOfChildren,
      birthDate: new Date(birthDate), // Convert to Date object
      address,
      religion,
      phoneNumber,
      password: hashedPassword,
      contraceptiveMethod: normalizedMethod,
      dailyPillTime: normalizedMethod === "pill" ? dailyPillTime : null,
      lastPillDate: null,
      lastInjectionDate: null,
      nextInjectionDate: normalizedMethod === "pill" ? initialNextPillDate : null,
      // injectionType
      // nextInjectionDate: nextInjectionDateAsDate,
      // lastInjectionDate: lastInjectionDateAsDate,

      avatar: {
        public_id: uploadResponse.public_id,
        url: uploadResponse.secure_url,
      },
    });

    // await injectionHistoryModel.create({
    //   user: newUser._id,
    //   injectionDate: lastInjectionDate,
    //   injectionType,
    // });

    res.status(201).json({ success: true, message: "User created successfully", data: newUser });
  } catch (error) {
    res.json({ success: false, message: "Error creating user", error: error.message });
    console.error("Error creating user:", error);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const user = await userModel.find({ role: "user" });

    if (!user || user.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No users found",
        data: [],
      });
    }

    res.status(200).json({ success: true, message: "Users retrieved successfully", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving users", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ success: false, message: "Please provide the User Id" });
    }

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User retrieved successfully", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving user", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ success: false, message: "Please provide a user ID" });
    }

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete avatar from Cloudinary if it exists
    if (user.avatar?.public_id) {
      try {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Error deleting avatar from Cloudinary",
          error: error.message,
        });
      }
    }

    await injectionHistoryModel.deleteMany({ user: id }); // Delete all injection history records for this user

    // Delete the user from the database
    await userModel.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting user", error: error.message });
  }
};

export const confirmInjection = async (req, res) => {
  const { id } = req.params;
  const { weight, height, bloodPressure } = req.body;
  const today = dayjs().startOf("day").toDate(); // Ambil tanggal hari ini tanpa waktu

  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!weight || !height || !bloodPressure) {
      return res.status(400).json({ success: false, message: "All vitals must be provided" });
    }

    if (user.nextInjectionDate && dayjs(user.nextInjectionDate).isAfter(dayjs(), "day")) {
      return res.status(400).json({ success: false, message: "You can only confirm injection on or after the scheduled date" });
    }

    // Update lastInjectionDate and nextInjectionDate
    const lastInjectionDate = dayjs(today); // Tetap sebagai objek dayjs
    let nextInjectionDate;

    if (user.injectionType === "1_month") {
      nextInjectionDate = lastInjectionDate.add(1, "month"); // Tambahkan 1 bulan
    } else if (user.injectionType === "3_month") {
      nextInjectionDate = lastInjectionDate.add(3, "month"); // Tambahkan 3 bulan
    }

    // Create injection history record
    await injectionHistoryModel.create({
      user: user._id,
      injectionDate: lastInjectionDate.toDate(),
      method: "injection",
      injectionType: user.injectionType,
      weight: parseFloat(weight),
      height: parseFloat(height),
      bloodPressure: bloodPressure.trim(),
    });

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        lastInjectionDate: lastInjectionDate.toDate(),
        nextInjectionDate: nextInjectionDate.toDate(),
        weight: parseFloat(weight),
        height: parseFloat(height),
        isConfirmed: true,
      },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Error updating user" });
    }

    res.status(200).json({
      success: true,
      message: "Injection confirmed successfully",
      data: {
        id: updatedUser._id,
        username: updatedUser.username,
        lastInjectionDate: updatedUser.lastInjectionDate,
        nextInjectionDate: updatedUser.nextInjectionDate,
        injectionType: updatedUser.injectionType,
        weight: updatedUser.weight,
        height: updatedUser.height,
        bloodPressure: bloodPressure.trim(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error confirming injection", error: error.message });
  }
};

export const confirmPillIntake = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.contraceptiveMethod !== "pill") {
      return res.status(400).json({ success: false, message: "This feature is only for pill users" });
    }

    if (!user.dailyPillTime) {
      return res.status(400).json({ success: false, message: "Daily pill time is not set" });
    }

    const now = dayjs();
    let scheduledAt = user.nextInjectionDate ? dayjs(user.nextInjectionDate) : null;

    if (!scheduledAt || !scheduledAt.isValid()) {
      const fallbackSchedule = getNextPillDateTime(user.dailyPillTime);
      if (!fallbackSchedule) {
        return res.status(400).json({ success: false, message: "Invalid daily pill time format" });
      }
      scheduledAt = dayjs(fallbackSchedule);
    }

    const delayMinutes = Math.max(0, now.diff(scheduledAt, "minute"));
    const nextPillDate = scheduledAt.add(1, "day");

    await injectionHistoryModel.create({
      user: user._id,
      method: "pill",
      injectionDate: now.toDate(),
      consumedAt: now.toDate(),
      scheduledAt: scheduledAt.toDate(),
      delayMinutes,
    });

    user.lastPillDate = now.toDate();
    user.lastInjectionDate = now.toDate();
    user.nextInjectionDate = nextPillDate.toDate();
    user.isConfirmed = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: delayMinutes > 0 ? `Pill confirmed. You were ${delayMinutes} minutes late.` : "Pill confirmed on time.",
      data: {
        lastPillDate: user.lastPillDate,
        nextPillDate: user.nextInjectionDate,
        scheduledAt: scheduledAt.toDate(),
        confirmedAt: now.toDate(),
        delayMinutes,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error confirming pill intake", error: error.message });
  }
};

export const getInjectionHistory = async (req, res) => {
  const id = req.params.id || req.user.id;

  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    const history = await injectionHistoryModel.find({ user: id }).sort({ injectionDate: -1 }).populate("user", "username");

    if (history.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No injection history found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Injection history retrieved successfully",
      data: history,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving injection history", error: error.message });
  }
};

export const getInjectionHistoryByMonth = async (req, res) => {
  try {
    const { month, year } = req.query;

    let filter = {}; // Include both injection and pill records

    if (year && month) {
      // Filter by specific month and year
      const start = dayjs(`${year}-${month}-01`).startOf("month").toDate();
      const end = dayjs(start).endOf("month").toDate();
      filter.injectionDate = { $gte: start, $lte: end };
    } else if (year && !month) {
      // Filter by whole year
      const start = dayjs(`${year}-01-01`).startOf("year").toDate();
      const end = dayjs(start).endOf("year").toDate();
      filter.injectionDate = { $gte: start, $lte: end };
    } else if (!year && month) {
      // Invalid: month without year → tolong frontend jangan kirim begini
      return res.status(400).json({
        success: false,
        message: "Month filter requires year to be specified.",
      });
    }

    const histories = await injectionHistoryModel.find(filter).populate("user").sort({ injectionDate: -1 });

    res.status(200).json({
      success: true,
      message: "Injection history fetched successfully",
      data: histories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching injection history",
      error: error.message,
    });
  }
};

export const updatedUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, injectionType, nik, weight, height, numberOfChildren, birthDate, address, phoneNumber, religion, initialInjectionDate, contraceptiveMethod, dailyPillTime } = req.body;
  const avatarFile = req.file;

  try {
    if (!id) {
      return res.status(400).json({ success: false, message: "Please provide the User Id" });
    }

    if (
      (!username || !username.trim()) &&
      (!password || !password.trim()) &&
      !injectionType &&
      !avatarFile &&
      !weight &&
      !height &&
      !numberOfChildren &&
      (!nik || !nik.trim()) &&
      !birthDate &&
      (!address || !address.trim()) &&
      (!phoneNumber || !phoneNumber.trim()) &&
      !religion &&
      !initialInjectionDate
    ) {
      return res.status(400).json({ success: false, message: "Please provide at least one field to update" });
    }

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if the username already exists
    if (username) {
      const existingUser = await userModel.findOne({ username });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({ success: false, message: "Username already exists" });
      }
      user.username = username.trim();
    }

    // update password
    if (password) {
      const hashedPassword = await bcrypt.hash(password.trim(), 10);
      user.password = hashedPassword;
    }

    // update injectionType & initialInjectionDate
    if (injectionType && contraceptiveMethod !== "pill") {
      user.injectionType = injectionType;
    }
    if (initialInjectionDate && contraceptiveMethod !== "pill") {
      user.initialInjectionDate = new Date(initialInjectionDate);
      user.nextInjectionDate = new Date(initialInjectionDate); // Next = initial date
      user.lastInjectionDate = null; // Belum pernah suntik
    }

    // update nik
    if (nik) {
      user.nik = nik.trim();
    }

    // update weight
    if (weight) {
      user.weight = parseFloat(weight);
    }

    // update height
    if (height) {
      user.height = parseFloat(height);
    }

    // update numberOfChildren
    if (numberOfChildren) {
      user.numberOfChildren = parseInt(numberOfChildren, 10);
    }

    // update birthDate
    if (birthDate) {
      user.birthDate = new Date(birthDate);
    }

    // update address
    if (address) {
      user.address = address.trim();
    }

    // update phoneNumber
    if (phoneNumber) {
      user.phoneNumber = phoneNumber.trim();
    }

    // update religion
    if (religion) {
      user.religion = religion;
    }

    // update contraceptive method & pill settings
    if (contraceptiveMethod) {
      user.contraceptiveMethod = contraceptiveMethod;
      if (contraceptiveMethod === "pill") {
        user.dailyPillTime = dailyPillTime || user.dailyPillTime;
        // Use nextInjectionDate/lastInjectionDate as a shared schedule display field in dashboard.
        const baseLastPillDate = user.lastPillDate || dayjs().startOf("day").toDate();
        user.lastPillDate = baseLastPillDate;
        user.lastInjectionDate = baseLastPillDate;

        const effectivePillTime = dailyPillTime || user.dailyPillTime;
        user.nextInjectionDate = getNextPillDateTime(effectivePillTime);
        user.injectionType = null;
      } else if (contraceptiveMethod === "injection") {
        // Clear pill-specific fields when switching back to injection
        user.dailyPillTime = null;
        user.lastPillDate = null;
      }
    }

    // update avatar
    if (avatarFile) {
      // Delete previous avatar from Cloudinary
      if (user.avatar?.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }

      // Upload new avatar
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "avatars" }, (err, result) => {
            if (err) return reject(err);
            resolve(result);
          })
          .end(avatarFile.buffer);
      });

      user.avatar = {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      };
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        id: updatedUser._id,
        username: updatedUser.username,
        nik: updatedUser.nik,
        weight: updatedUser.weight,
        height: updatedUser.height,
        numberOfChildren: updatedUser.numberOfChildren,
        birthDate: updatedUser.birthDate,
        address: updatedUser.address,
        phoneNumber: updatedUser.phoneNumber,
        religion: updatedUser.religion,
        telegramChatID: updatedUser.telegramChatID,
        registrationCode: updatedUser.registrationCode,
        avatar: updatedUser.avatar.url,
        injectionType: updatedUser.injectionType,
        nextInjectionDate: updatedUser.nextInjectionDate,
        lastInjectionDate: updatedUser.lastInjectionDate,
        initialInjectionDate: updatedUser.lastInjectionDate,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating user", error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  const { message } = req.body;
  const { id } = req.params;

  try {
    const user = await userModel.findById(id);

    if (!user || !user.telegramChatID) {
      return res.status(404).json({ success: false, message: " User is not synced to telegram " });
    }

    await bot.sendMessage(user.telegramChatID, message);

    // Simpan ke log pengingat
    reminderLogModel.create({
      userId: user._id,
      method: "admin",
      message,
    });

    // Simpan ke chat history
    await chatHistoryModel.create({
      userId: user._id,
      username: user.username,
      message,
    });

    res.status(200).json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send message.", error: error.message });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const chatHistory = await chatHistoryModel.find().sort({ createdAt: -1 });

    if (!chatHistory || chatHistory.length === 0) {
      return res.status(200).json({ success: true, message: "No chat history found", data: [] });
    }

    res.status(200).json({
      success: true,
      message: "Chat history retrieved successfully",
      data: chatHistory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving chat history", error: error.message });
  }
};

export const getUsersWithPendingInjection = async (req, res) => {
  try {
    const today = dayjs().startOf("day");

    // Ambil semua user yang role user
    const users = await userModel.find({ role: "user" });

    // Update status isConfirmed jika sudah jatuh tempo
    for (const user of users) {
      if (user.nextInjectionDate && user.isConfirmed && dayjs(user.nextInjectionDate).startOf("day").isSameOrBefore(today)) {
        user.isConfirmed = false;
        await user.save();
      }
    }

    // Ambil ulang user yang pending
    const startOfToday = dayjs().startOf("day").toDate();
    const endOfToday = dayjs().endOf("day").toDate();

    const pendingUsers = await userModel.find({
      role: "user",
      contraceptiveMethod: "injection",
      isConfirmed: false,
      nextInjectionDate: { $lte: endOfToday },
    });

    res.status(200).json({
      success: true,
      message: "Users with pending injection confirmation retrieved successfully",
      data: pendingUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving users with pending injection confirmation",
      error: error.message,
    });
  }
};
