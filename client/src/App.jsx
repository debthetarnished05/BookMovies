import { Navigate, Outlet, Route, Routes, useMatch } from "react-router-dom";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Profile from "./pages/Profile";
import SeatLayout from "./pages/SeatLayout";
import Checkout from "./pages/Checkout";
import { Toaster } from "react-hot-toast";
import { useLoadUser } from "./hooks/useLoadUser";
import FullScreenLoader from "./components/shared/FullScreenLoader";
import { useAuth } from "./context/AuthContext";
import AdminDashboard from "./components/admin/AdminDashboard";

import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/superAdminDashboard";
import AddMovies from "./components/admin/AddMovies";
import AdminRequests from "./components/admin/AdminRequests";
import AddShows from "./components/admin/AddShows";
import SuperAdminMovieShows from "./components/admin/SuperAdminMovieShows";
import AdminMovieShows from "./components/admin/AdminMovieShows";
import AdminShowBookings from "./components/admin/AdminShowBookings";
import AddShowForm from "./components/admin/AddShowForm";

const PrivateRoute = () => {
  const { auth }  = useAuth();
  return auth ? <Outlet /> : <Navigate to="/" replace />;
}

const AdminRoute = () => {
  const { auth, user } = useAuth();
  return (auth && (user?.role === 'admin' || user?.role === 'superadmin')) ? <Outlet /> : <Navigate to="/" replace />;
}

function  App() {
  
  const { isLoading } = useLoadUser();
  

   // Hide header/footer only on seat layout page
  const isSeatLayoutPage = useMatch(
    "/movies/:movieId/:movieName/:state/theater/:theaterId/show/:showId/seat-layout"
  );
  const isAdminPage = useMatch("/admin/*");
  const isCheckoutPage = useMatch("/shows/:showId/:state/checkout");

  if(isLoading) {
    return <FullScreenLoader />
  }

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style : {
            fontSize : "14px",
          }
        }}
      />
      <div className="flex flex-col min-h-screen">
        {!isSeatLayoutPage && !isCheckoutPage && !isAdminPage && <Header />}
        <main className="flex-grow">
          <Routes>
            {/* Define your routes here */}
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:state/:movieName/:id/ticket" element={<MovieDetails />} />
            <Route element={<PrivateRoute />}>
              <Route path="/movies/:movieId/:movieName/:state/theater/:theaterId/show/:showId/seat-layout" element={<SeatLayout />} />
              <Route path="/profile/:id/:tab" element={<Profile />} />
              <Route path="/shows/:showId/:state/checkout" element={<Checkout />} />
            </Route>
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="movies/:movieId/shows" element={<SuperAdminMovieShows />} />
                <Route path="my-movies/:movieId/shows" element={<AdminMovieShows />} />
                <Route path="shows/:showId/bookings" element={<AdminShowBookings />} />
                <Route path="add-movies" element={<AddMovies />} />
                <Route path="requests" element={<AdminRequests />} />
                <Route path="add-shows" element={<AddShows />} />
                <Route path="add-shows/:movieId" element={<AddShowForm />} />
              </Route>
            </Route>
            {/* Add more routes as needed */}
          </Routes>
        </main>
        {!isSeatLayoutPage && !isCheckoutPage && !isAdminPage && <Footer />}
      </div>
      <></>
    </>
  );
}

export default App;