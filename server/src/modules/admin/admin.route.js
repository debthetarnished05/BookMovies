import express from "express";
import {
  requestAdminAccess,
  getAllRequests,
  approveAdminAccess,
  rejectAdminAccess,
  getNowPlayingMovies,
  addMovie,
  getShowsByMovie,
  createShow,
  getActiveShows,
  getTotalRevenue,
  getBookings,

  getSuperAdminStats,
  getMovieShowsForSuperAdmin,
} from "./admin.controller.js";
import { isVerifiedUser } from "../../middlewares/auth.middleware.js";
import { isSuperAdmin, isAdmin } from "../../middlewares/role.middleware.js";
const router = express.Router();


router.post("/addmovie", isVerifiedUser, isSuperAdmin, addMovie);

// User requests admin access
router.post("/request-access", isVerifiedUser, requestAdminAccess);

// Superadmin: get all admin requests
router.get("/", isVerifiedUser, isSuperAdmin, getAllRequests);

// Superadmin: get dashboard stats
router.get("/superadmin/dashboard", isVerifiedUser, isSuperAdmin, getSuperAdminStats);

// Superadmin: get shows for a specific movie
router.get("/superadmin/shows/:movieId", isVerifiedUser, isSuperAdmin, getMovieShowsForSuperAdmin);

// Superadmin: approve request
router.patch("/:id/approve", isVerifiedUser, isSuperAdmin, approveAdminAccess);

// Superadmin: reject request
router.patch("/:id/reject", isVerifiedUser, isSuperAdmin, rejectAdminAccess);

router.get("/getmovies", isVerifiedUser, isSuperAdmin, getNowPlayingMovies);

router.get("/shows/:movieId", isVerifiedUser, isAdmin, getShowsByMovie);

router.post("/shows", isVerifiedUser, isAdmin, createShow);

router.get("/activeshows", isVerifiedUser, isAdmin, getActiveShows);

router.get("/revenue", isVerifiedUser, isAdmin, getTotalRevenue);

router.get("/bookings/:showId", isVerifiedUser, isAdmin, getBookings);

export default router;