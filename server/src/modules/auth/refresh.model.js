import mongoose, { Schema } from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const RefreshTokenModel = mongoose.model(
  "RefreshTokenModel",
  refreshTokenSchema
);