import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { axiosWrapper } from "../../apis/axiosWrapper";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "lucide-react";

const AddShows = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axiosWrapper.get(`/movies`);
        setMovies(res.data.movies || res.data);
      } catch (error) {
        toast.error("Failed to fetch database movies");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading movies...</div>;
  }

  return (
    <div className="w-full min-h-screen px-6 py-8">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Add Shows
        </h1>
        <p className="mt-2 text-gray-500">
          Select a movie from the database to schedule shows.
        </p>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {movies.map((movie) => {
          const image = movie.posterUrl || "https://via.placeholder.com/500x750?text=No+Image";

          return (
            <div
              key={movie._id}
              onClick={() => navigate(`/admin/add-shows/${movie._id}`)}
              className="relative cursor-pointer overflow-hidden rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200"
            >
              <img
                src={image}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover transition-all duration-200"
              />

              <div className="p-4 bg-white text-gray-800">
                <h2 className="text-lg font-semibold truncate">
                  {movie.title}
                </h2>

                <div className="flex items-center justify-between mt-3">
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {movie.rating?.toFixed(1) || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {movies.length === 0 && !loading && (
        <div className="text-gray-500 mt-10">
          No movies found in the database. Please add movies from TMDB first.
        </div>
      )}
    </div>
  );
};

export default AddShows;
