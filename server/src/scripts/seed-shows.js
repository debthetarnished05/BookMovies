// seed/showSeeder.js

import mongoose from "mongoose";
import dayjs from "dayjs";

import { MovieModel } from "../modules/movie/movie.model.js";
import { TheaterModel } from "../modules/theater/theater.model.js";
import { ShowModel } from "../modules/show/show.model.js";
import config from "../config/config.js";
import { generateSeatLayout } from "../utils/index.js";

const generatePriceMap = () =>
  new Map([
    ["PREMIUM", 510],
    ["EXECUTIVE", 290],
    ["NORMAL", 270],
  ]);

const formats = ["2D", "3D", "IMAX", "PVR PXL"];

// 🎞️ Realistic time slots
const fixedTimeSlots = [
  { start: "09:00 AM", end: "11:30 AM" },
  { start: "12:30 PM", end: "03:00 PM" },
  { start: "04:00 PM", end: "06:30 PM" },
  { start: "07:30 PM", end: "10:00 PM" },
  { start: "10:30 PM", end: "01:00 AM" },
];

const toDateWithTime = (baseDate, timeStr) => {
  return dayjs(baseDate)
    .hour(dayjs(timeStr, ["hh:mm A"]).hour())
    .minute(dayjs(timeStr, ["hh:mm A"]).minute())
    .second(0)
    .toDate();
};

export const seedShow = async () => {
  const movies = await MovieModel.find();
  const theatres = await TheaterModel.find();

  if (!movies.length || !theatres.length) {
    console.error("Movies or theatres not found.");
    return;
  }

  const today = dayjs().startOf("day");

  for (const movie of movies) {
    for (const theatre of theatres) {
      // Generate shows for the next 30 days
      for (let d = 0; d < 3; d++) {
        const showDate = today.add(d, "day");
        const formattedDate = showDate.format("DD-MM-YYYY");

        // 2–4 shows
        const numShows = Math.floor(Math.random() * 3) + 2;
        const selectedSlots = fixedTimeSlots.slice(0, numShows);

        for (const slot of selectedSlots) {
          const startTime = toDateWithTime(showDate.toDate(), slot.start);
          const endTime = toDateWithTime(showDate.toDate(), slot.end);

          const newShow = new ShowModel({
            movie: movie._id,
            theater: theatre._id,
            location: theatre.state,
            format: formats[Math.floor(Math.random() * formats.length)],
            audioType: "Dolby 7.1",
            startTime: slot.start,
            date: formattedDate,
            priceMap: generatePriceMap(),
            seatLayout: generateSeatLayout(),
          });

          await newShow.save();

          console.log(
            `🎬 Show created for ${movie.title} at ${theatre.name} on ${formattedDate} (${slot.start} - ${slot.end})`
          );
        }
      }
    }
  }

  console.log("✅ Show seeding completed.");
};

mongoose
  .connect(config.databaseReplicaSet)
  .then(async () => {
    console.log("✅ DB connected");

    const todayStr = dayjs().startOf("day").format("DD-MM-YYYY");
    const count = await ShowModel.countDocuments({ date: todayStr });
    if (count > 0) {
      console.log("Data already exists, skipping seed");
      await mongoose.disconnect();
      process.exit(0);
    }

    await ShowModel.deleteMany({});
    console.log("🧹 Existing shows deleted.");

    await seedShow();

    await mongoose.disconnect();

    console.log("✅ Disconnected from DB");
  })
  .catch((err) => {
    console.error(err);
  });