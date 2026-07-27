import { UserModel } from "./user.model.js";

// Create User
export const createUser = async (user) => {
  const newUser = new UserModel(user);
  return await newUser.save();
};

// Get All Users
export const getAllUsers = async () => {
  return await UserModel.find();
};

// Get Single User
export const getUserById = async (id) => {
  return await UserModel.findById(id);
};

// Get User by Email
export const getUserByEmail = async (email) => {
  return await UserModel.findOne({ email });
};

// Activate User
export const activateUser = async (id, updateData) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};