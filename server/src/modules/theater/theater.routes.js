import express from "express";
import * as TheaterController from "./theater.controller.js";
import { validate } from "../../middlewares/validate.js";
import { TheaterSchema } from "./theater.validation.js";

const router = express.Router();

router.post(
  "/",
  validate(TheaterSchema),
  TheaterController.createTheater
);

router.get("/", TheaterController.getTheaters);

export default router;