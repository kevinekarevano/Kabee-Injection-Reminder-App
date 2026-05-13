import mongoose from "mongoose";

const injectionHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    injectionDate: {
      type: Date,
      required: true,
    },
    method: {
      type: String,
      enum: ["injection", "pill"],
      default: "injection",
    },
    injectionType: {
      type: String,
      enum: ["1_month", "3_month"],
      default: null,
    },
    weight: {
      type: Number,
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
    bloodPressure: {
      type: String,
      default: null,
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    consumedAt: {
      type: Date,
      default: null,
    },
    delayMinutes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const injectionHistoryModel = mongoose.model("InjectionHistory", injectionHistorySchema);
export default injectionHistoryModel;
