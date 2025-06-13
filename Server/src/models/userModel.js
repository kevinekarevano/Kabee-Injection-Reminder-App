import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nanoid = customAlphabet(alphabet, 5);

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    nik: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      default: "Perempuan",
    },
    birthDate: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    religion: {
      type: String,
      required: true,
      enum: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"],
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    telegramChatID: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    nextInjectionDate: {
      type: Date,
      default: null,
    },
    lastInjectionDate: {
      type: Date,
      default: null,
    },
    initialInjectionDate: {
      type: Date,
      default: null,
    },
    injectionType: {
      type: String,
      enum: ["1_month", "3_month"],
      default: null,
    },
    registrationCode: {
      type: String,
      default: () => nanoid(),
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
