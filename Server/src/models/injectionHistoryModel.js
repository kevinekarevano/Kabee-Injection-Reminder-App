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
    injectionType: {
      type: String,
      enum: ["1_month", "3_month"],
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    bloodPressure: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const injectionHistoryModel = mongoose.model("InjectionHistory", injectionHistorySchema);
export default injectionHistoryModel;
