import TelegramBot from "node-telegram-bot-api";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// /Start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `
👋 Selamat datang di *Kabee Bot*!

Untuk menerima pengingat suntik KB otomatis, silakan hubungkan akun kamu dengan perintah:

➡️ *Ketik:* \`/register <KODE_UNIK>\`

Setelah akun kamu terhubung, gunakan perintah berikut:
- \`/status\`: Untuk memeriksa status akun kamu (apakah sudah terhubung atau belum).
- \`/help\`: Untuk melihat daftar perintah yang tersedia.

Kamu bisa mendapatkan kode unik dari admin atau dari halaman profil di website Kabee.
`;

  try {
    const user = await userModel.findOne({ telegramChatID: chatId.toString() });

    if (user) {
      // Jika user sudah terhubung, kirim pesan berbeda
      return bot.sendMessage(chatId, `👋 Hai ${user.username}, akun kamu sudah terhubung dengan Kabee_Bot. Kamu akan terus menerima pengingat suntik KB otomatis!`);
    }

    // Jika user belum terhubung, kirim pesan selamat datang
    bot.sendMessage(chatId, welcomeMessage, { parse_mode: "Markdown" });
  } catch (error) {
    console.error("Error fetching user:", error);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat memproses permintaan. Silakan coba lagi.");
  }
});

// /register
bot.onText(/\/register(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const code = match[1]?.trim(); // Ambil parameter setelah /register, jika ada

  if (!code) {
    return bot.sendMessage(chatId, "❌ Kamu harus memasukkan kode unik setelah perintah /register.\n\nContoh: `/register ABCPQ`\n\nGunakan perintah `/status` untuk memeriksa apakah akun kamu sudah terhubung.", { parse_mode: "Markdown" });
  }
  try {
    const user = await userModel.findOne({ registrationCode: code });

    if (!user) {
      return bot.sendMessage(chatId, "❌ Kode tidak ditemukan atau sudah tidak berlaku.");
    }

    if (user.telegramChatID) {
      return bot.sendMessage(chatId, "⚠️ Akun ini sudah terhubung dengan bot.");
    }

    user.telegramChatID = chatId.toString();
    user.registrationCode = null; // Clear the registration code after successful registration

    await user.save();
    bot.sendMessage(chatId, "✅ Akun kamu berhasil terhubung dengan bot! Sekarang kamu akan menerima pengingat suntik KB otomatis.");
  } catch (error) {
    console.error("Error registering user:", error);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
  }
});

// /status
bot.onText(/\/status/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    // Cari user berdasarkan telegramChatID
    const user = await userModel.findOne({ telegramChatID: chatId.toString() });

    if (user) {
      // Jika user sudah terhubung
      return bot.sendMessage(
        chatId,
        `✅ Akun kamu sudah terhubung dengan bot.\n\n👤 *Nama Pengguna:* ${user.username}\n📅 *Tanggal Suntik Berikutnya:* ${user.nextInjectionDate ? new Date(user.nextInjectionDate).toLocaleDateString("id-ID") : "Belum dijadwalkan"}`,
        {
          parse_mode: "Markdown",
        }
      );
    }

    // Jika user belum terhubung
    bot.sendMessage(chatId, "❌ Akun kamu belum terhubung dengan bot.\n\nGunakan perintah `/register <KODE_UNIK>` untuk menghubungkan akun kamu.", {
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error("Error checking user status:", error);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat memproses permintaan. Silakan coba lagi.");
  }
});

// /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpMessage = `
📖 *Daftar Perintah Kabee Bot*:

- \`/start\`: Memulai bot dan melihat informasi awal.
- \`/register <KODE_UNIK>\`: Menghubungkan akun kamu dengan bot.
- \`/status\`: Memeriksa apakah akun kamu sudah terhubung dengan bot.
- \`/help\`: Melihat daftar perintah yang tersedia.

Jika ada pertanyaan lebih lanjut, hubungi admin.
  `;

  bot.sendMessage(chatId, helpMessage, { parse_mode: "Markdown" });
});

export default bot;
