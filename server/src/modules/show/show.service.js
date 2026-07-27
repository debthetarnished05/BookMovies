import mongoose, { Types } from "mongoose";
import { generateSeatLayout, groupShowsByTheatreAndMovie } from "../../utils/index.js";
import { ShowModel } from "./show.model.js";

// 1. Create Show
export const createShow = async (showData) => {
  const seatLayout = generateSeatLayout();
  const showToCreate = {
    ...showData,
    seatLayout,
  };

  return await ShowModel.create(showToCreate);
};

// 2. Get Shows By Movie, Date & Location
export const getShowsByMovieDateLocation = async (
  movieId,
  date,
  location
) => {
  const query = {
    movie: new Types.ObjectId(movieId),
    location: {
      $regex: new RegExp(location, "i"),
    },
  };

  if (date) {
    query.date = date;
  }

  const shows = await ShowModel.find(query)
    .populate("movie theater")
    .sort({ startTime: 1 });

  return groupShowsByTheatreAndMovie(shows);
};

// 3. Get Show By Id
export const getShowById = async (showId) => {
  return await ShowModel.findById(showId).populate("movie theater");
};

// 4. Update Seat Status
export const updateSeatStatus = async (
  showId,
  seats,
  status,
  session
) => {
  const show = await ShowModel.findById(showId).session(session);

  if (!show) {
    throw new Error("Show not found!");
  }

  const parsedSeats = seats.map((seat) => ({
    row: seat.charAt(0),
    number: parseInt(seat.slice(1)),
  }));

  for (const parsedSeat of parsedSeats) {
    const row = show.seatLayout.find(
      (r) => r.row === parsedSeat.row
    );

    if (!row) {
      throw new Error(`Invalid seat row: ${parsedSeat.row}`);
    }

    const seat = row.seats.find(
      (s) => s.number === parsedSeat.number
    );

    if (!seat) {
      throw new Error(
        `Invalid seat number: ${parsedSeat.number} in row ${parsedSeat.row}`
      );
    }

    if (seat.status === "BOOKED") {
      throw new Error(
        `Seat ${parsedSeat.row}${parsedSeat.number} is already booked!`
      );
    }

    seat.status = status;
  }

  show.markModified("seatLayout");

  await show.save({ session });
};