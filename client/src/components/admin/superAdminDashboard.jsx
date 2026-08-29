
import {
  ChartLineIcon,
  IndianRupeeIcon,
  PlayCircleIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  // Temporary hardcoded dashboard data
  const dashboardData = {
    totalBookings: 248,
    totalRevenue: 87450,
    totalUsers: 126,
    activeshows: [
      {
        showprice: 250,
        showDateTime: "2026-08-29T18:30:00",
        movie: {
          primaryImage:
            "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
          originalTitle: "Deadpool & Wolverine",
          averageRating: 4.5,
        },
      },
      {
        showprice: 220,
        showDateTime: "2026-08-29T20:00:00",
        movie: {
          primaryImage:
            "https://image.tmdb.org/t/p/w500/1w8nymjg8t1yJrF4J9tV5P1x7WQ.jpg",
          originalTitle: "Inside Out 2",
          averageRating: 4.7,
        },
      },
      {
        showprice: 280,
        showDateTime: "2026-08-30T17:30:00",
        movie: {
          primaryImage:
            "https://image.tmdb.org/t/p/w500/6Wdl9N6dL0vMrT7r0s6Q4X8dG4M.jpg",
          originalTitle: "Spider-Man: Across the Spider-Verse",
          averageRating: 4.8,
        },
      },
      {
        showprice: 200,
        showDateTime: "2026-08-30T19:45:00",
        movie: {
          primaryImage:
            "https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
          originalTitle: "The Batman",
          averageRating: 4.6,
        },
      },
      {
        showprice: 180,
        showDateTime: "2026-08-31T16:00:00",
        movie: {
          primaryImage:
            "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mD6v6j6rF.jpg",
          originalTitle: "Guardians of the Galaxy Vol. 3",
          averageRating: 4.4,
        },
      },
    ],
  };

  const dashboardCards = [
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings,
      icon: ChartLineIcon,
    },
    {
      title: "Total Revenue",
      value: `${currency} ${dashboardData.totalRevenue}`,
      icon: IndianRupeeIcon,
    },
    {
      title: "Active Shows",
      value: dashboardData.activeshows.length,
      icon: PlayCircleIcon,
    },
    {
      title: "Total Users",
      value: dashboardData.totalUsers,
      icon: UsersIcon,
    },
  ];

  return (
    <div>
      {/* Dashboard Cards */}
      <div className="grid grid-cols-2 min-lg:grid-cols-4 gap-6 max-md:gap-1 mt-8 max-md:pl-5 max-sm:pl-0">
        {dashboardCards.map((data, index) => {
          return (
            <div
              key={index}
              className="flex justify-between rounded-lg bg-primary/10 border-2 border-primary/20"
            >
              <div className="flex flex-col py-4 items-start justify-center pr-5 pl-4">
                <p className="text-sm">{data.title}</p>

                <p className="text-2xl font-semibold pt-1 max-md:text-xl">
                  {data.value}
                </p>
              </div>

              <div className="flex items-center justify-center pr-3">
                <data.icon className="w-7 h-7" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Shows */}
      <p className="mt-10 text-xl font-semibold">Active Shows</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-8 px-2 sm:px-5">
        {dashboardData.activeshows.length > 0 ? (
          dashboardData.activeshows
            .filter(
              (movie) =>
                movie?.movie?.primaryImage &&
                movie?.movie?.originalTitle
            )
            .map((movie, index) => (
              <div
                key={index}
                className="flex flex-col rounded-lg bg-primary/10 border-2 border-primary/20 overflow-hidden shadow-md hover:-translate-y-1 transition duration-300"
              >
                <img
                  src={movie.movie.primaryImage}
                  alt="poster"
                  className="w-full h-64 object-cover"
                />

                <p className="pt-3 px-3 text-lg font-semibold text-white">
                  {movie.movie.originalTitle.length > 25
                    ? movie.movie.originalTitle.slice(0, 25) + "..."
                    : movie.movie.originalTitle}
                </p>

                <div className="flex justify-between mt-2 px-3 text-white">
                  <p className="text-lg font-medium">
                    {currency} {movie.showprice}
                  </p>

                  <p className="flex items-center gap-1 text-gray-300 text-sm">
                    <StarIcon className="w-4 h-4 text-primary fill-primary" />
                    {movie.movie.averageRating}
                  </p>
                </div>

                <p className="px-3 py-3 text-sm text-gray-500">
                  {movie.showDateTime}
                </p>
              </div>
            ))
        ) : (
          <p className="text-white">No active shows found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
