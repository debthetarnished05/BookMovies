import * as BookingService from "./booking.service.js";

export const createBookingHandler = async (req, res, next) => {
  try {
    const booking = await BookingService.createBooking(
      req.body,
      req.user._id
    );

    res.status(201).json({
      success: true,
      message: "Booking successful!",
      booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserBookingsHandler = async (req, res, next) => {
  try {
    const bookings = await BookingService.getAllBookings(req.user._id);

    res.status(200).json({
      success: true,
      message: "User bookings fetched successfully!",
      bookings,
    });
  } catch (error) {
    next(error);
  }
};