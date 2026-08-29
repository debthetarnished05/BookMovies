import * as UserService from "./user.service.js";

// Create User
export const createUser = async (req, res, next) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// Get All Users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Get Logged-in User
export const getUserById = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.user?._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Activate User
export const activateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    updateData.activateUser = true;

    const updatedUser = await UserService.activateUser(
      userId,
      updateData
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

