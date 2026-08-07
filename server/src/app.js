import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";

dotenv.config();

export const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:5173",
  "https://bookmovies-frontend.vercel.app"
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ""));
}

app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
  })
);

app.use(cookieParser());
app.use(express.json());


app.use("/api/v1/", router);


app.get("/", (req, res) => {
  res.json({
    message: "Welcome to BookMovies API",
  });
});

app.use(globalErrorHandler);