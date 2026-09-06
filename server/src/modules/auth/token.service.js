import jwt from "jsonwebtoken";
import config from "../../config/config.js";
import { RefreshTokenModel } from "./refresh.model.js";

// Generate Access Token & Refresh Token
export const generateToken = (payload) => {
  const accessToken = jwt.sign(payload, config.accessTokenSecret, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(payload, config.refreshTokenSecret, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

// Store Refresh Token
export const storeRefreshToken = async (userId, refreshToken) => {
  try {
    await RefreshTokenModel.create({
      userId,
      token: refreshToken,
    });
  } catch (error) {
    throw error;
  }
};

// Verify Access Token
export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.accessTokenSecret);
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.refreshTokenSecret);
};

// Find Refresh Token
export const findRefreshToken = async (userId, token) => {
  return await RefreshTokenModel.findOne({
    userId,
    token,
  });
};

// Delete Refresh Token
export const deleteRefreshToken = async (token) => {
  return await RefreshTokenModel.findOneAndDelete({
    token,
  });
};

// Update Refresh Token
export const updateRefreshToken = async (userId, newToken) => {
  try {
    await RefreshTokenModel.updateOne(
      { userId },
      { token: newToken },
      { upsert: true }
    );
  } catch (error) {
    throw error;
  }
}; 