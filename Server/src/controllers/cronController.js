import { sendInjectionReminder } from "../services/injectionReminder.js";
import reminderLogModel from "../models/reminderLogModel.js";

export const handleCron = async (req, res) => {
  const secret = req.query.secret;
  if (secret !== process.env.CRON_SECRET) {
    return res.status(403).send("Unauthorized");
  }

  try {
    await sendInjectionReminder();
    res.status(200).send("Cron executed successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to run cron");
  }
};

export const reminderStats = async (req, res) => {
  const now = new Date();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  try {
    const [autoToday, adminToday, totalMonth] = await Promise.all([
      reminderLogModel.countDocuments({ method: "auto", date: { $gte: startOfToday, $lte: endOfToday } }),
      reminderLogModel.countDocuments({ method: "admin", date: { $gte: startOfToday, $lte: endOfToday } }),
      reminderLogModel.countDocuments({ date: { $gte: startOfMonth, $lte: endOfMonth } }),
    ]);

    res.status(200).json({
      success: true,
      message: "Reminder statistics retrieved successfully",
      autoToday,
      adminToday,
      totalMonth,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve reminder statistics", error: err.message });
  }
};
