import * as MovieService from "./movie.service.js";

export const createMovie = async (req, res, next) => {
  try {
    const movie = await MovieService.createMovie(req.body);

    res.status(201).json({
      movie,
    });
  } catch (error) {
    next(error);
  }
};

export const getMovies = async (req, res, next) => {
  try {
    const movies = await MovieService.getAllMovies();

    res.status(200).json({
      movies,
    });
  } catch (error) {
    next(error);
  }
};

export const getMovieById = async (req, res, next) => {
  try {
    const movie = await MovieService.getMovieById(req.params.id);

    res.status(200).json({
      movie,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopRecommendedMovies = async (req, res, next) => {
  try {
    const topMovies = await MovieService.getTopMovieByVotes(5);

    res.status(200).json({
      topMovies,
    });
  } catch (error) {
    next(error);
  }
};