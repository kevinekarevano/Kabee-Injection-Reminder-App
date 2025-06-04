import dayjs from "dayjs";
import userModel from "../models/userModel.js";
import reminderLogModel from "../models/reminderLogModel.js";
import bot from "./telegramBot.js";

export const sendInjectionReminder = async () => {
  console.log("🔔 Running daily injection reminder job...");

  const startDate = dayjs().startOf("day").toDate();
  const endDate = dayjs().add(3, "day").endOf("day").toDate();

  try {
    const usersToRemind = await userModel.find({
      nextInjectionDate: { $gte: startDate, $lte: endDate },
      telegramChatID: { $nin: [null, ""] }, // exclude null dan string kosong
    });

    if (!usersToRemind || usersToRemind.length === 0) {
      console.log("No users to remind for injection.");
      return;
    }

    for (const user of usersToRemind) {
      if (!user.telegramChatID) continue; // skip jika kosong/null

      const daysLeft = dayjs(user.nextInjectionDate).startOf("day").diff(dayjs().startOf("day"), "day");

      let message;
      if (daysLeft > 1) {
        message = `🔔 *Pengingat Suntik KB*\n\nHai *${user.username}*, suntik KB kamu akan dilakukan dalam *${daysLeft} hari lagi* (${dayjs(user.nextInjectionDate).format("DD MMMM YYYY")}).\n\nJangan lupa ya! 💉\n\n-KabeeBot🤖`;
      } else if (daysLeft === 1) {
        message = `🔔 *Pengingat Suntik KB*\n\nHai *${user.username}*, suntik KB kamu akan dilakukan *besok* (${dayjs(user.nextInjectionDate).format("DD MMMM YYYY")}).\n\nJangan lupa ya! 💉\n\n-KabeeBot🤖`;
      } else if (daysLeft === 0) {
        message = `🔔 *Pengingat Suntik KB*\n\nHai *${user.username}*, suntik KB kamu dijadwalkan *hari ini* (${dayjs(user.nextInjectionDate).format("DD MMMM YYYY")}).\n\nJangan lupa ya! 💉\n\n-KabeeBot🤖`;
      }

      await bot.sendMessage(user.telegramChatID, message, { parse_mode: "Markdown" });
      console.log(`✅ Reminder dikirim ke ${user.username}`);

      // Log the reminder
      await reminderLogModel.create({
        userId: user._id,
        method: "auto",
        message,
      });
    }
  } catch (error) {
    console.error("Error sending reminders:", error);
  }
};
