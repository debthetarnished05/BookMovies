import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user", "superadmin"],
      default: "user",
    },
    phone: {
      type: String, 
    },
    activateUser: {
      type: Boolean,
      default: true, // Auto-activate since we get everything upfront
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("User", userSchema);