import mongoose from "mongoose";
import Razorpay from "razorpay";

import { generateBookingReference } from "../../utils/index.js";
import BookingModel from "./booking.model.js";
import config from "../../config/config.js";
import { updateSeatStatus } from "../show/show.service.js";
import { ShowModel } from "../show/show.model.js";



export const createBooking = async (bookingData, userId) => {
  // Validation
  if (
    !bookingData.showId ||
    !bookingData.seats ||
    bookingData.seats.length === 0 ||
    !bookingData.paymentId ||
    !bookingData.bookingFee
  ) {
    throw new Error("Invalid booking data!");
  }

  const { showId, seats, paymentId, bookingFee } = bookingData;
const show = await ShowModel.findById(showId)
  .populate("movie")
  .populate("theater");

if (!show) {
  throw new Error("Show not found.");
}

  const bookingRef = generateBookingReference();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingBooking = await BookingModel.findOne({
      showId,
      status: "CONFIRMED",
      seats: { $in: seats },
    }).session(session);

    if (existingBooking) {
      throw new Error(
        "One or more of the requested seats are already booked!"
      );
    }

    const razorpay = new Razorpay({
      key_id: config.razorpayKey,
      key_secret: config.razorpaySecret,
    });

    const paymentDetails = await razorpay.payments.fetch(paymentId);

    if (paymentDetails.status !== "captured") {
      throw new Error("Payment not successful!");
    }

    const [booking] = await BookingModel.create(
      [
        {
          bookingRef,
          userId,
          showId,
          movieSnapshot: {
            title: show.movie.title,
            posterUrl: show.movie.posterUrl,
            format: show.movie.format,
          },

          theaterSnapshot: {
            name: show.theater.name,
            location: show.theater.location,
          },

          showSnapshot: {
            date: show.date,
            startTime: show.startTime,
            audioType: show.audioType,
          },
          seats,
          status: "CONFIRMED",
          paymentId,
          paymentMethod: paymentDetails.method,
          bookingFee,
        },
      ],
      { session }
    );

    await updateSeatStatus(showId, seats, "BOOKED", session);

    await session.commitTransaction();
    session.endSession();

    return booking;
  } catch (error) {
        console.error("================================");
        console.error(error);
        console.error(error.stack);
        console.error("================================");

        await session.abortTransaction();
        session.endSession();
        throw error;
  }
};

export const getAllBookings = async (userId) => {
  return await BookingModel.find({ userId })
    .populate({
      path: "showId",
      select: "startTime date audioType",
      populate: [
        {
          path: "movie",
          select: "title posterUrl duration format",
        },
        {
          path: "theater",
          select: "name location city state",
        },
      ],
    })
    .sort({ createdAt: -1 });
};