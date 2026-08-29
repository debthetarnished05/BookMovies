import * as UserService from "../user/user.service.js";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import {AdminRequest} from "./adminRequest.model.js";
import {ShowModel} from "../show/show.model.js";
import BookingModel from "../booking/booking.model.js";
import {MovieModel} from "../movie/movie.model.js";
import config from "../../config/config.js";
import { TheaterModel } from "../theater/theater.model.js";
import axios from "axios";
import mongoose from "mongoose";
import{generateSeatLayout} from "../../utils/index.js";

export const requestAdminAccess = async (req, res, next) =>{
  try {
    const userId = req.params.id;
    const {email,password} = req.body;

    if (!email || !password){
        return next(new createHttpError.BadRequest("Email and password are required"));
    }

    const user = await UserService.getUserById(userId);
    
    if (!user || !user.password) {
        return next(new createHttpError.Unauthorized("Invalid email or password"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return next(new createHttpError.Unauthorized("Invalid email or password"));
    }
    if (user.role === "admin" || user.role === "superadmin") {
        throw new Error("User already has admin access");
    }

    const existingRequest = await AdminRequest.findOne({
        userId,
        status: "pending",
    });

    if (existingRequest) {
        throw new Error("Admin request already pending");
    }

    const request = await AdminRequest.create({
        userId,
    });

    res.status(201).json(request);


  }catch (error) {
    next(error);
  };




};




export const getAllRequests = async (req, res, next) => {
  try {
    const requests = await AdminRequest.find({
      status: "pending",
    })
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

export const approveAdminAccess = async (req, res, next) => {
    try{
        const request = await AdminRequest.findById(req.params.id);
        if (!request) {
            throw new Error("Admin request not found");
        }

        if (request.status !== "pending") {
            throw new Error("Request has already been reviewed");
        }

        const user = await UserService.getUserById(request.userId);

        if (!user) {
            throw new Error("Requested user not found");
        }

        user.role = "admin";
        await user.save();

        request.status = "approved";

        await request.save();

        res.status(200).json(request);
    }catch (error) {
        next(error);
    }
};

export const rejectAdminAccess = async (req, res, next) => {
    try {
        const request = await AdminRequest.findById(req.params.id);
        if (!request) {
            throw new Error("Admin request not found");
        }

        if (request.status !== "pending") {
            throw new Error("Request has already been reviewed");
        }

        const user = await UserService.getUserById(request.userId);

        if (!user) {
            throw new Error("Requested user not found");
        }


        request.status = "rejected";

        await request.save();

        res.status(200).json(request);
    }catch (error) {
        next(error);
    }
};



export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: {
          Authorization: `Bearer ${config.tmdbAccessToken}`,
          accept: "application/json",
        },
        params: {
          language: "en-US",
          region: "IN",
          page: 1,
        },
      }
    );

    res.json({
      success: true,
      movies: data.results,
    });
  } catch (error) {
    console.error(
      "TMDB Now Playing Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch now playing movies",
    });
  }
};


export const addMovie = async (req, res) => {
  try {
    const { movieId } = req.body;

    // movieId is the TMDB movie ID
    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: "TMDB movie ID is required",
      });
    }

    // Check if movie already exists in our database
    const existingMovie = await MovieModel.findOne({
      tmdbId: movieId,
    });

    if (existingMovie) {
      return res.status(409).json({
        success: false,
        message: "Movie already exists in the database",
        movie: existingMovie,
      });
    }

    // Fetch movie details and release dates from TMDB
    const [movieDetailsResponse, releaseDatesResponse] =
      await Promise.all([
        axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          {
            headers: {
              Authorization: `Bearer ${config.tmdbAccessToken}`,
              accept: "application/json",
            },
            params: {
              language: "en-US",
            },
          }
        ),

        axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/release_dates`,
          {
            headers: {
              Authorization: `Bearer ${config.tmdbAccessToken}`,
              accept: "application/json",
            },
          }
        ),
      ]);

    const movieApiData = movieDetailsResponse.data;
    const releaseDatesData = releaseDatesResponse.data;

    // Find Indian certification
    const indiaReleaseData = releaseDatesData.results?.find(
      (country) => country.iso_3166_1 === "IN"
    );

    const certification =
      indiaReleaseData?.release_dates?.find(
        (release) => release.certification
      )?.certification || "N/A";

    // Create movie object according to our Movie schema
    const movieDetails = {
      tmdbId: movieApiData.id,

      title: movieApiData.title,

      description: movieApiData.overview || "No description available",

      duration: movieApiData.runtime || 0,

      genre: movieApiData.genres?.map(
        (genre) => genre.name
      ) || [],

      releaseDate: movieApiData.release_date
        ? new Date(movieApiData.release_date)
        : null,

      languages: movieApiData.spoken_languages?.map(
        (language) => language.english_name
      ) || [],

      certification,

      posterUrl: movieApiData.poster_path
        ? `https://image.tmdb.org/t/p/w500${movieApiData.poster_path}`
        : "",

      rating: movieApiData.vote_average || 0,

      votes: movieApiData.vote_count || 0,

      format: ["2D"],
    };

    // Save movie to MongoDB
    const movie = await MovieModel.create(movieDetails);

    return res.status(201).json({
      success: true,
      message: "Movie added successfully",
      movie,
    });

  } catch (error) {
    console.error(
      "Add Movie Error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to add movie",
    });
  }
};


export const createShow = async (req, res, next) => {
  try {
    const {
      movieId,
      theaterId,
      format,
      audioType,
      startTime,
      date,
      priceMap,
      seatLayout,
      adminId,
    } = req.body;

    // Validate required fields
    if (
      !movieId ||
      !theaterId ||
      !format ||
      !startTime ||
      !date ||
      !adminId
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

    // Create show
    const show = await ShowModel.create({
      movie: movie._id,
      theater: theater._id,

      // Get location from theater
      location: theater.state,

      format,

      audioType: audioType || "Dolby Atmos",

      startTime,

      date,

      priceMap: priceMap || {},

      seatLayout: generateSeatLayout(),

      // Temporarily from body for testing
      adminId,
    });

    return res.status(201).json({
      success: true,
      message: "Show created successfully",
      show,
    });

  } catch (error) {
    console.error("Create Show Error:", error);
    next(error);
  }
};

export const getShowsByMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const adminId = "6a8a8ed2d359adaf2309125b";

    // Get shows for this movie created by this admin
    const shows = await ShowModel.find({
      adminId,
      movie: movieId,
    })
      .populate("movie", "title")
      .populate("theater", "name location")
      .sort({ date: 1, startTime: 1 });

    const showIds = shows.map((show) => show._id);

    // Get revenue and booked seats for these shows
    const bookingData = await BookingModel.aggregate([
      {
        $match: {
          showId: { $in: showIds },
          status: "CONFIRMED",
        },
      },
      {
        $group: {
          _id: "$showId",

          revenue: {
            $sum: "$bookingFee.total",
          },

          seatsBooked: {
            $sum: {
              $size: "$seats",
            },
          },
        },
      },
    ]);

    // Create lookup map
    const bookingMap = {};

    bookingData.forEach((item) => {
      bookingMap[item._id.toString()] = {
        revenue: item.revenue,
        seatsBooked: item.seatsBooked,
      };
    });

    // Return required show information
    const result = shows.map((show) => {
      const bookingInfo =
        bookingMap[show._id.toString()] || {
          revenue: 0,
          seatsBooked: 0,
        };

      return {
        showId: show._id,

        movieName: show.movie?.title,

        theaterName: show.theater?.name,

        theaterLocation: show.theater?.location,

        date: show.date,

        startTime: show.startTime,

        revenue: bookingInfo.revenue,

        seatsBooked: bookingInfo.seatsBooked,
      };
    });

    res.status(200).json({
      success: true,
      shows: result,
    });
  } catch (error) {
    next(error);
  }
};


export const getActiveShows = async (req, res, next) => {
  try {
    const adminId = new mongoose.Types.ObjectId(
      "6a8a8ed2d359adaf2309125b"
    );

    const movies = await ShowModel.aggregate([
      {
        $match: {
          adminId,
        },
      },
      {
        $group: {
          _id: "$movie",
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                title: 1,
                posterUrl: 1,
              },
            },
          ],
          as: "movie",
        },
      },
      {
        $unwind: "$movie",
      },
      {
        $replaceRoot: {
          newRoot: "$movie",
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      movies,
    });
  } catch (error) {
    next(error);
  }
};

export const getTotalRevenue = async (req, res, next) => {
  try {
    const adminId = new mongoose.Types.ObjectId(
      adminId = req.user._id
    );

    const result = await BookingModel.aggregate([
      // Find the show associated with each booking
      {
        $lookup: {
          from: "shows",
          localField: "showId",
          foreignField: "_id",
          as: "show",
        },
      },

      // Convert show array into object
      {
        $unwind: "$show",
      },

      // Only bookings for this admin's shows
      {
        $match: {
          "show.adminId": adminId,
          status: "CONFIRMED",
        },
      },

      // Calculate total revenue
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$bookingFee.total",
          },
        },
      },
    ]);

    const totalRevenue = result[0]?.totalRevenue || 0;

    return res.status(200).json({
      success: true,
      totalRevenue,
    });

  } catch (error) {
    next(error);
  }
};




export const getBookings = async (req, res, next) => {
  try {
    const { showId } = req.params;

    const bookings = await BookingModel.find({
      showId,
      status: "CONFIRMED",
    })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    const result = bookings.map((booking) => ({
      bookingId: booking._id,
      userName: booking.userId?.name || "Unknown User",
      seats: booking.seats,
      totalAmount: booking.bookingFee.total,
      paymentMethod: booking.paymentMethod,
    }));

    res.status(200).json({
      success: true,
      bookings: result,
    });
  } catch (error) {
    next(error);
  }
};





