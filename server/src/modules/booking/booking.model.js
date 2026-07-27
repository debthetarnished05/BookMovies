import mongoose, { Schema } from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingRef: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    showId: {
      type: Schema.Types.ObjectId,
      ref: "Show",
      required: true,
      index: true,
    },

    seats: [
      {
        type: String,
        required: true,
      },
    ],

    status: {
      type: String,
      enum: ["CONFIRMED", "FAILED", "CANCELLED"],
      default: "CONFIRMED",
      required: true,
    },

    bookingDateTime: {
      type: Date,
      default: Date.now,
      required: true,
    },

    paymentId: {
      type: String,
      required: true,
    },

    paymentMethod: {
      type: String,
      required: true,
    },

    bookingFee: {
      ticketPrice: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      convenience: {
        type: Number,
        required: true,
      },
    },
movieSnapshot: {
  title: {
    type: String,
    required: true,
  },
  posterUrl: {
    type: String,
    required: true,
  },
  format: [{
    type: String,
  }],
},

theaterSnapshot: {
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
},

showSnapshot: {
  date: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  audioType: {
    type: String,
    required: true,
  },
},
  },
  {
    timestamps: true,
  },
  
);

bookingSchema.pre("save", async function () {
  this.seats.sort();
});

const BookingModel = mongoose.model("Booking", bookingSchema);

export default BookingModel;