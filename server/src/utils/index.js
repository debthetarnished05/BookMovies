import { customAlphabet } from "nanoid";

// Email Validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate Seat Layout
export const generateSeatLayout = (priceMap = {}) => {
  return [
    {
      row: "E",
      type: "PREMIUM",
      price: priceMap.Premium || 510,
      seats: Array.from({ length: 10 }, (_, i) => ({
        number: i + 1,
        status: "AVAILABLE",
      })),
    },
    {
      row: "D",
      type: "EXECUTIVE",
      price: priceMap.Executive || 290,
      seats: Array.from({ length: 20 }, (_, i) => ({
        number: i + 1,
        status: "AVAILABLE",
      })),
    },
    {
      row: "C",
      type: "EXECUTIVE",
      price: priceMap.Executive || 290,
      seats: Array.from({ length: 20 }, (_, i) => ({
        number: i + 1,
        status: "AVAILABLE",
      })),
    },
    {
      row: "B",
      type: "EXECUTIVE",
      price: priceMap.Executive || 290,
      seats: Array.from({ length: 20 }, (_, i) => ({
        number: i + 1,
        status: "AVAILABLE",
      })),
    },
    {
      row: "A",
      type: "NORMAL",
      price: priceMap.Normal || 180,
      seats: Array.from({ length: 20 }, (_, i) => ({
        number: i + 1,
        status: "AVAILABLE",
      })),
    },
  ];
};

// Group Shows By Theatre And Movie
export const groupShowsByTheatreAndMovie = (shows) => {
  const grouped = {};

  shows.forEach((show) => {
    const movieId = show.movie._id.toString();
    const theatreId = show.theater._id.toString();

    const key = `${movieId}_${theatreId}`;

    if (!grouped[key]) {
      grouped[key] = {
        movie: show.movie,
        theater: {
          theaterDetails: show.theater,
          shows: [],
        },
      };
    }

    grouped[key].theater.shows.push({
      _id: show._id || "",
      date: show.date || "",
      startTime: show.startTime || "",
      format: show.format || "",
      audioType: show.audioType || "",
    });
  });

  return Object.values(grouped);
};

// Booking Reference Generator
const nanoid = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  8
);

export const generateBookingReference = () => {
  return `BMS-${nanoid()}`;
};  