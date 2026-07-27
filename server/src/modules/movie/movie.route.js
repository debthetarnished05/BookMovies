import express from "express";
import * as MovieController from "./movie.controller.js";
import { validate } from "../../middlewares/validate.js";
import { MovieSchema } from "./movie.validation.js";

const router = express.Router();

router.post("/", validate(MovieSchema), MovieController.createMovie);
router.get("/", MovieController.getMovies);
router.get("/recommended", MovieController.getTopRecommendedMovies);
router.get("/:id", MovieController.getMovieById);

export default router;