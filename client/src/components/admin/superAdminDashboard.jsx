import { useEffect, useState } from "react";
import {
  ChartLineIcon,
  IndianRupeeIcon,
  PlayCircleIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";
import { axiosWrapper } from "../../apis/axiosWrapper";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalAdmins: 0,
    totalShows: 0,
    activeshows: [],
    activeMovies: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user?.role === "superadmin") {
          const res = await axiosWrapper.get(`/admin/superadmin/dashboard`);
          setDashboardData({
            ...dashboardData,
            totalUsers: res.data.totalUsers,
            totalAdmins: res.data.totalAdmins,
            totalShows: res.data.totalShows,
            activeMovies: res.data.activeMovies
          });
        } else {
          // Fetch revenue
          const revenueRes = await axiosWrapper.get(`/admin/revenue`);
          // Fetch active shows (movies for this admin)
          const showsRes = await axiosWrapper.get(`/admin/activeshows`);
          
          setDashboardData({
            ...dashboardData,
            totalBookings: revenueRes.data.totalBookings || 0,
            totalUsers: revenueRes.data.totalUsers || 0,
            totalRevenue: revenueRes.data.totalRevenue || 0,
            activeshows: showsRes.data.movies || []
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  let dashboardCards = [];

  if (user?.role === "superadmin") {
    dashboardCards = [
      {
        title: "Total Users",
        value: dashboardData.totalUsers,
        icon: UsersIcon,
      },
      {
        title: "Total Admins",
        value: dashboardData.totalAdmins,
        icon: UsersIcon,
      },
      {
        title: "Total Shows",
        value: dashboardData.totalShows,
        icon: PlayCircleIcon,
      },
    ];
  } else {
    dashboardCards = [
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
  }

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  const moviesList = user?.role === "superadmin" ? dashboardData.activeMovies : dashboardData.activeshows;
  const listTitle = user?.role === "superadmin" ? "Active Movies" : "Active Shows";

  return (
    <div>
      {/* Dashboard Cards */}
      <div className={`grid ${user?.role === 'superadmin' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2 min-lg:grid-cols-4'} gap-6 max-md:gap-1 mt-8 max-md:pl-5 max-sm:pl-0`}>
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

      {/* Movies List */}
      <p className="mt-10 text-xl font-semibold">{listTitle}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-8 px-2 sm:px-5">
        {moviesList.length > 0 ? (
          moviesList
            .map((movie, index) => (
              <div
                key={index}
                onClick={() => navigate(user?.role === "superadmin" ? `/admin/movies/${movie._id}/shows` : `/admin/my-movies/${movie._id}/shows`)}
                className="flex flex-col rounded-lg bg-slate-800 border-2 border-primary/20 overflow-hidden shadow-md hover:-translate-y-1 transition duration-300 cursor-pointer"
              >
                <img
                  src={movie.posterUrl || "https://via.placeholder.com/500x750?text=No+Image"}
                  alt="poster"
                  className="w-full aspect-[2/3] object-cover"
                />
                
                <div className="flex flex-col flex-1 p-3">
                  <p className="text-lg font-semibold text-white">
                    {movie.title && movie.title.length > 25
                      ? movie.title.slice(0, 25) + "..."
                      : movie.title}
                  </p>

                  {user?.role !== "superadmin" && (
                    <div className="mt-auto pt-2 text-sm text-gray-300">
                      <p className="font-medium">
                        Added to shows
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
        ) : (
          <p className="text-gray-600">No movies found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
