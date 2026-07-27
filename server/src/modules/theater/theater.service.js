import { TheaterModel } from "./theater.model.js";

// Create Theater
export const createTheater = async (data) => {
  return await TheaterModel.create(data);
};

// Get All Theaters
export const getAllTheaters = async () => {
  return await TheaterModel.find();
};

// Get Theater By Id
export const getTheaterById = async (id) => {
  return await TheaterModel.findById(id);
};

// Get Theater By State
export const getTheaterByState = async (state) => {
  return await TheaterModel.find({
    state: {
      $regex: state,
      $options: "i",
    },
  });
};