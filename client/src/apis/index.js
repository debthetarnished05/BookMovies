import { axiosWrapper } from "./axiosWrapper";

// List all the endpoints;
export const getRecommendedMovies = () =>
  axiosWrapper.get("/movies/recommended");
export const getAllMovies = () => axiosWrapper.get("/movies");
export const getMovieById = (data) => axiosWrapper.get(`/movies/${data}`);
export const getShowsByMovieAndLocation = (movieId, state, date) =>
  axiosWrapper.get("/shows", {
    params: {
      movieId,
      state,
      date,
    },
  });
export const getShowById = (data) => axiosWrapper.get(`/shows/${data}`);

// Authentication APIS
export const registerUser = (data) => axiosWrapper.post("/auth/register", data);
export const loginUser = (data) => axiosWrapper.post("/auth/login", data);
export const logout = () => axiosWrapper.post("/auth/logout");
export const refreshToken = () => axiosWrapper.post("/auth/refresh-token");
export const getUser = () => axiosWrapper.get("/users/me");

// Payment Endpoints
export const createOrderRazorpay = (data) => axiosWrapper.post("/payment/create-order", data);
export const verifyPaymentRazorpay = (data) => axiosWrapper.post("/payment/verify-payment", data);

// Booking Endpoints
export const bookShow = (data) => axiosWrapper.post("/book", data);
export const getUserBookings = () => axiosWrapper.get("/book");