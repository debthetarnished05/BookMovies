import * as TheaterService from "./theater.service.js";

export const createTheater = async (req, res, next) => {
  try {
    const theater = await TheaterService.createTheater(req.body);

    res.status(201).json({
      success: true,
      message: "Theater created successfully",
      data: theater,
    });
  } catch (error) {
    next(error);
  }
};

export const getTheaters = async (req, res, next) => {
  try {
    const { state } = req.query;

    let theaters;

    if (state) {
      theaters = await TheaterService.getTheaterByState(state);
    } else {
      theaters = await TheaterService.getAllTheaters();
    }

    res.status(200).json(theaters);
  } catch (error) {
    next(error);
  }
};