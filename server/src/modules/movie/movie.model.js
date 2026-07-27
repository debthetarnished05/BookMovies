 import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
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

const MovieModel = mongoose.model("Movie", movieSchema);

export default MovieModel;