import MovieModel from "./movie.model.js";

// Create Movie
export const createMovie = async (movie) => {
  return await MovieModel.create(movie);
};

// Get All Movies
export const getAllMovies = async () => {
  return await MovieModel.find().sort({ releaseDate: -1 });
};

// Get Movie By Id
export const getMovieById = async (id) => {
  return await MovieModel.findById(id);
};

// Top Recommended Movies
export const getTopMovieByVotes = async (limit) => {
  return await MovieModel.find().sort({ votes: -1 }).limit(limit);
};