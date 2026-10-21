import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosWrapper } from "../../apis/axiosWrapper";
import { ArrowLeftIcon } from "lucide-react";

const SuperAdminMovieShows = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const res = await axiosWrapper.get(`/admin/superadmin/shows/${movieId}`);
        setShows(res.data.shows);
        
        if (res.data.shows.length > 0) {
          setMovieDetails({
            title: res.data.shows[0].movieName,
            posterUrl: res.data.shows[0].moviePoster
          });
        }
      } catch (error) {
        console.error("Failed to fetch shows", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [movieId]);

  if (loading) {
    return <div className="p-8">Loading shows...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 w-fit font-medium"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-1" /> Back to Dashboard
      </button>

      <div className="flex items-start gap-6 mb-8">
        {movieDetails?.posterUrl ? (
          <img 
            src={movieDetails.posterUrl} 
            alt={movieDetails.title} 
            className="w-24 aspect-[2/3] object-cover rounded-md shadow-md"
          />
        ) : (
          <div className="w-24 aspect-[2/3] bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-gray-400 text-xs">No Poster</span>
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {movieDetails?.title || "Movie Shows"}
          </h1>
          <p className="text-gray-500 mt-1">All scheduled shows across all theaters.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Admin (Hosted By)</th>
                <th className="px-6 py-4 font-semibold">Theater</th>
                <th className="px-6 py-4 font-semibold">City</th>
                <th className="px-6 py-4 font-semibold">State</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Time</th>
                <th className="px-6 py-4 font-semibold text-right">Tickets Sold</th>
              </tr>
            </thead>
            <tbody>
              {shows.length > 0 ? (
                shows.map((show) => (
                  <tr 
                    key={show.showId} 
                    onClick={() => navigate(`/admin/shows/${show.showId}/bookings`)}
                    className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{show.adminName}</td>
                    <td className="px-6 py-4">{show.theaterName}</td>
                    <td className="px-6 py-4">{show.theaterCity}</td>
                    <td className="px-6 py-4">{show.theaterState}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {show.date}
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      {show.startTime}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-gray-900">
                        {show.seatsBooked}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No shows scheduled for this movie yet.
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

export default SuperAdminMovieShows;
