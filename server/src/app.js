import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";

dotenv.config();

export const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);

app.use(cookieParser());
app.use(express.json());


app.use("/api/v1/", router);


app.use(globalErrorHandler);


app.get("/", (req, res) => {
  res.json({
    message: "Welcome to BookMovies API",
  });
});