import mongoose from "mongoose";

const reminderLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  method: {
    type: String,
    enum: ["auto", "admin"],
    required: true,
  },
  message: {
    type: String,
  },
});

export default mongoose.model("ReminderLog", reminderLogSchema);
