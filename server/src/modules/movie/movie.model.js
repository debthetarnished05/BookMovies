import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    tmdbId: {
      type: Number,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    duration: {
      type: Number, // duration in minutes
      required: true,
    },

    genre: {
      type: [String],
      required: true,
    },

    releaseDate: {
      type: Date,
      required: true,
    },

    languages: {
      type: [String],
      required: true,
    },

    certification: {
      type: String,
      required: true,
    },

    posterUrl: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
    },

    votes: {
      type: Number,
      required: true,
    },

    format: {
      type: [String],
      default: ["2D"],
    },
  },
  {
    timestamps: true,
  }
);

export const MovieModel = mongoose.model("Movie", movieSchema);

