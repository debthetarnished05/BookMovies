const fs = require("fs");
const path = "c:/code/BookMovies/server/src/modules/admin/admin.controller.js";
let content = fs.readFileSync(path, "utf-8");

const newCode = `export const getTotalRevenue = async (req, res, next) => {
  try {
    const adminId = req.user._id;

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
          totalBookings: {
            $sum: { $size: { $ifNull: ["$seats", []] } },
          },
          uniqueUsers: {
            $addToSet: "$userId",
          },
        },
      },
      {
        $project: {
          totalRevenue: 1,
          totalBookings: 1,
          totalUsers: { $size: "$uniqueUsers" },
        },
      },
    ]);

    const totalRevenue = result[0]?.totalRevenue || 0;
    const totalBookings = result[0]?.totalBookings || 0;
    const totalUsers = result[0]?.totalUsers || 0;

    return res.status(200).json({
      success: true,
      totalRevenue,
      totalBookings,
      totalUsers,
    });

  } catch (error) {
    next(error);
  }
};`;

const startIndex = content.indexOf("export const getTotalRevenue = async (req, res, next) => {");
const endIndex = content.indexOf("export const getBookings = async (req, res, next) => {");

if (startIndex !== -1 && endIndex !== -1) {
    // leave some blank lines before getBookings
    const replaced = content.substring(0, startIndex) + newCode + "\n\n\n\n" + content.substring(endIndex);
    fs.writeFileSync(path, replaced);
    console.log("Success");
} else {
    console.log("Could not find function bounds", startIndex, endIndex);
}
