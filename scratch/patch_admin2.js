const fs = require("fs");
const path = "c:/code/BookMovies/server/src/modules/admin/admin.controller.js";
let content = fs.readFileSync(path, "utf-8");

const newCode = `export const createShow = async (req, res, next) => {
  try {
    const {
      movieId,
      theaterId,
      format,
      audioType,
      startTime,
      date,
      startDate,
      endDate,
      priceMap,
    } = req.body;

    const adminId = req.user._id;

    // Validate required fields
    if (
      !movieId ||
      !theaterId ||
      !format ||
      !startTime ||
      !(date || (startDate && endDate))
    ) {
      return res.status(400).json({
        success: false,
        message: "Required show details are missing",
      });
    }

    // Check whether movie exists
    const movie = await MovieModel.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Check whether theater exists
    const theater = await TheaterModel.findById(theaterId);
    if (!theater) {
      return res.status(404).json({
        success: false,
        message: "Theater not found",
      });
    }

    let datesToCreate = [];
    if (startDate && endDate) {
      let current = new Date(startDate);
      const end = new Date(endDate);
      while (current <= end) {
        datesToCreate.push(current.toISOString().split('T')[0]); // YYYY-MM-DD
        current.setDate(current.getDate() + 1);
      }
    } else {
      datesToCreate.push(date);
    }

    const showsToInsert = datesToCreate.map(d => ({
      movie: movie._id,
      theater: theater._id,
      location: theater.state,
      format,
      audioType: audioType || "Dolby Atmos",
      startTime,
      date: d,
      priceMap: priceMap || {},
      seatLayout: generateSeatLayout(),
      adminId,
    }));

    const shows = await ShowModel.insertMany(showsToInsert);

    return res.status(201).json({
      success: true,
      message: \`Successfully created \${shows.length} show(s)\`,
      shows,
    });

  } catch (error) {
    console.error("Create Show Error:", error);
    next(error);
  }
};`;

const startIndex = content.indexOf("export const createShow = async (req, res, next) => {");
const endIndex = content.indexOf("export const getShowsByMovie = async (req, res, next) => {");

if (startIndex !== -1 && endIndex !== -1) {
    const replaced = content.substring(0, startIndex) + newCode + "\n\n" + content.substring(endIndex);
    fs.writeFileSync(path, replaced);
    console.log("Success");
} else {
    console.log("Could not find function bounds", startIndex, endIndex);
}
