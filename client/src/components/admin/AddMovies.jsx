import { useState } from "react";
import { StarIcon, CheckIcon } from "lucide-react";

function AddMovies() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Temporary hardcoded movies
  const movies = [
    {
      id: 1,
      title: "Deadpool & Wolverine",
      image:
        "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
      rating: 4.5,
    },
    {
      id: 2,
      title: "Inside Out 2",
      image:
        "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
      rating: 4.7,
    },
    {
      id: 3,
      title: "Spider-Man: Across the Spider-Verse",
      image:
        "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
      rating: 4.8,
    },
    {
      id: 4,
      title: "Wonder Woman 1984",
      image:
        "https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
      rating: 4.6,
    },
    {
      id: 5,
      title: "Guardians of the Galaxy Vol. 3",
      image:
        "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
      rating: 4.4,
    },
  ];

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
  };

  const handleAddMovie = () => {
    if (!selectedMovie) return;

    console.log("Selected movie:", selectedMovie);

    alert(`${selectedMovie.title} selected`);
  };

  return (
    <div className="w-full min-h-screen px-6 py-8">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Add Movies
        </h1>

        <p className="mt-2 text-gray-500">
          Select a movie to add it to your theatre.
        </p>
      </div>

      {/* Movies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {movies.map((movie) => {
          const isSelected = selectedMovie?.id === movie.id;

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
                src={movie.image}
                alt={movie.title}
                className={`
                  w-full
                  h-72
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

                    {movie.rating}
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
          disabled={!selectedMovie}
          className={`
            px-8
            py-3
            rounded-lg
            text-base
            font-semibold
            transition-all
            duration-200
            ${
              selectedMovie
                ? "bg-red-500 text-white hover:bg-red-600 cursor-pointer shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {selectedMovie
            ? `Add "${selectedMovie.title}"`
            : "Add this Movie"}
        </button>
      </div>
    </div>
  );
}

export default AddMovies;