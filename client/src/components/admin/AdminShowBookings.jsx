import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosWrapper } from "../../apis/axiosWrapper";
import { ArrowLeftIcon } from "lucide-react";

const AdminShowBookings = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosWrapper.get(`/admin/bookings/${showId}`);
        setBookings(res.data.bookings);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [showId]);

  if (loading) {
    return <div className="p-8">Loading bookings...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 w-fit font-medium"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-1" /> Back to Shows
      </button>

      <div className="flex items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Show Bookings</h1>
          <p className="text-gray-500 mt-1">Users who booked tickets for this show.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">User Name</th>
                <th className="px-6 py-4 font-semibold">Seat Numbers</th>
                <th className="px-6 py-4 font-semibold">Payment Method</th>
                <th className="px-6 py-4 font-semibold text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.bookingId} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{booking.userName}</td>
                    <td className="px-6 py-4 text-gray-800">
                      {booking.seats.join(", ")}
                    </td>
                    <td className="px-6 py-4 uppercase text-xs font-semibold text-gray-500 tracking-wider">
                      {booking.paymentMethod}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      ₹{booking.totalAmount}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No bookings have been made for this show yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminShowBookings;
