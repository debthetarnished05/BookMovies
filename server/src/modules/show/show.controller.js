import * as ShowService from "./show.service.js";

// Create Show
export const createShow = async (req, res, next) => {
  try {
    const show = await ShowService.createShow(
      req.body,
      req.user._id
    );
    res.status(201).json(show);
  } catch (error) {
    next(error);
  }
};

// Get Shows By Movie, Date & Location
export const getShowsByMovieDateLocation = async (
  req,
  res,
  next
) => {
  try {
    const { movieId, state, date } = req.query;

    const shows =
      await ShowService.getShowsByMovieDateLocation(
        movieId,
        date,
        state
      );

    res.status(200).json(shows);
  } catch (error) {
    next(error);
  }
};

// Get Show By Id
export const getShowById = async (req, res, next) => {
  try {
    const show = await ShowService.getShowById(req.params.id);
    res.status(200).json(show);
  } catch (error) {
    next(error);
  }
};