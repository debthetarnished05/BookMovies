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

} from "./admin.controller.js";
import { isVerifiedUser } from "../../middlewares/auth.middleware.js";
import { isSuperAdmin, isAdmin } from "../../middlewares/role.middleware.js";
const router = express.Router();


router.post("/addmovie", addMovie);
// User requests admin access


// Superadmin: get all admin requests
router.get("/", isVerifiedUser, isSuperAdmin, getAllRequests);

// Superadmin: approve request
router.patch("/:id/approve", isVerifiedUser, isSuperAdmin, approveAdminAccess);

// Superadmin: reject request
router.patch("/:id/reject", isVerifiedUser, isSuperAdmin, rejectAdminAccess);

router.get("/getmovies", getNowPlayingMovies);

router.get("/shows/:movieId", getShowsByMovie);

router.post("/shows", createShow);

router.get("/activeshows", getActiveShows);

router.get("/revenue", getTotalRevenue);

router.get("/bookings/:showId", getBookings);

router.post("/:id",isVerifiedUser, requestAdminAccess);
export default router;