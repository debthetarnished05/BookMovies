import React, { useEffect, useState } from "react";
import { StarIcon, CheckIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { axiosWrapper } from "../../apis/axiosWrapper";

function AddMovies() {
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axiosWrapper.get(`/admin/getmovies`);
        if (res.data.success) {
          setMovies(res.data.movies);
        }
      } catch (error) {
        toast.error("Failed to fetch movies from TMDB");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const handleSelectMovie = (movie) => {
    if (selectedMovies.find(m => m.id === movie.id)) {
      setSelectedMovies(selectedMovies.filter(m => m.id !== movie.id));
    } else {
      setSelectedMovies([...selectedMovies, movie]);
    }
  };

  const handleAddMovie = async () => {
    if (selectedMovies.length === 0) return;

    try {
      setAdding(true);
      let successCount = 0;
      let conflictCount = 0;

      await Promise.all(
        selectedMovies.map(async (selectedMovie) => {
          try {
            const res = await axiosWrapper.post(`/admin/addmovie`, {
              movieId: selectedMovie.id
            });
            if (res.data.success) {
              successCount++;
            }
          } catch (error) {
            if (error.response && error.response.status === 409) {
              conflictCount++;
            } else {
              console.error(error);
            }
          }
        })
      );

      if (successCount > 0) {
        toast.success(`Successfully added ${successCount} movie(s)!`);
      }
      if (conflictCount > 0) {
        toast.error(`${conflictCount} movie(s) already exist in database.`);
      }

      setSelectedMovies([]);
    } catch (error) {
      toast.error("An error occurred while adding movies.");
      console.error(error);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading now playing movies...</div>;
  }

  return (
    <div className="w-full min-h-screen px-6 py-8">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Add TMDB Movies
        </h1>

        <p className="mt-2 text-gray-500">
          Select a movie from TMDB to add it to the database.
        </p>
      </div>

      {/* Movies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {movies.map((movie) => {
          const isSelected = selectedMovies.some(m => m.id === movie.id);
          const image = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image";

          return (
            <div
              key={movie.id}
              onClick={() => handleSelectMovie(movie)}
              className={`
                relative
                cursor-pointer
                overflow-hidden
                rounded-xl
                border-2
                transition-all
                duration-200
                ${
                  isSelected
                    ? "border-red-500 shadow-lg shadow-red-500/20"
                    : "border-gray-200 hover:border-gray-400 hover:shadow-md"
                }
              `}
            >
              {/* Selected Check */}
              {isSelected && (
                <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                  <CheckIcon className="w-5 h-5 text-white" />
                </div>
              )}

              {/* Poster */}
              <img
                src={image}
                alt={movie.title}
                className={`
                  w-full
                  aspect-[2/3]
                  object-cover
                  transition-all
                  duration-200
                  ${isSelected ? "opacity-90" : ""}
                `}
              />

              {/* Movie Information */}
              <div
                className={`
                  p-4
                  ${
                    isSelected
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-800"
                  }
                `}
              >
                <h2 className="text-lg font-semibold truncate">
                  {movie.title}
                </h2>

                <div className="flex items-center justify-between mt-3">
                  <span
                    className={`
                      flex items-center gap-1 text-sm
                      ${
                        isSelected
                          ? "text-white"
                          : "text-gray-500"
                      }
                    `}
                  >
                    <StarIcon
                      className={`
                        w-4 h-4
                        ${
                          isSelected
                            ? "text-white fill-white"
                            : "text-yellow-500 fill-yellow-500"
                        }
                      `}
                    />

                    {movie.vote_average?.toFixed(1)}
                  </span>

                  {isSelected && (
                    <span className="text-sm font-medium">
                      Selected
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Movie Button */}
      <div className="flex justify-center mt-10 pb-8">
        <button
          onClick={handleAddMovie}
          disabled={selectedMovies.length === 0 || adding}
          className={`
            px-8
            py-3
            rounded-lg
            text-base
            font-semibold
            transition-all
            duration-200
            ${
              selectedMovies.length > 0 && !adding
                ? "bg-red-500 text-white hover:bg-red-600 cursor-pointer shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {adding ? 'Adding...' : selectedMovies.length > 0
            ? `Add ${selectedMovies.length} Movie(s)`
            : "Select Movies to Add"}
        </button>
      </div>
    </div>
  );
}

export default AddMovies;