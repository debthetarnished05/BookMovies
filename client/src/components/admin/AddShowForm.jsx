import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { axiosWrapper } from "../../apis/axiosWrapper";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";

const AddShowForm = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [theaters, setTheaters] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [filteredTheaters, setFilteredTheaters] = useState([]);
  const [movie, setMovie] = useState(null);

  const [formData, setFormData] = useState({
    movieId: movieId,
    theaterId: "",
    format: "2D",
    audioType: "Dolby Atmos",
    startTime: "",
    startDate: "",
    endDate: "",
    priceMap: { Premium: 510, Executive: 290, Normal: 180 }
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, theatersRes] = await Promise.all([
          axiosWrapper.get(`/movies`),
          axiosWrapper.get(`/theaters`)
        ]);

        const allMovies = moviesRes.data.movies || moviesRes.data;
        const foundMovie = allMovies.find(m => m._id === movieId);
        setMovie(foundMovie);

        const allTheaters = theatersRes.data.theaters || theatersRes.data;
        setTheaters(allTheaters);

        // Extract unique locations
        const uniqueLocations = [...new Set(allTheaters.map(t => t.city || t.location).filter(Boolean))];
        setLocations(uniqueLocations);

      } catch (error) {
        toast.error("Failed to fetch data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [movieId]);

  // Handle location change
  const handleLocationChange = (e) => {
    const loc = e.target.value;
    setSelectedLocation(loc);
    setFormData({ ...formData, theaterId: "" }); // Reset selected theater
    
    if (loc) {
      setFilteredTheaters(theaters.filter(t => (t.city || t.location) === loc));
    } else {
      setFilteredTheaters([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePriceChange = (e) => {
    setFormData({
      ...formData,
      priceMap: {
        ...formData.priceMap,
        [e.target.name]: Number(e.target.value)
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await axiosWrapper.post(`/admin/shows`, formData);

      if (res.data.success) {
        toast.success("Show created successfully!");
        setFormData({
          ...formData,
          startTime: "",
          startDate: "",
          endDate: "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create show");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen px-6 py-8">
      <button 
        onClick={() => navigate("/admin/add-shows")} 
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 w-fit font-medium"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-1" /> Back to Movies
      </button>

      <div className="mb-8 flex items-end gap-6">
        {movie?.posterUrl && (
          <img src={movie.posterUrl} alt="poster" className="w-24 aspect-[2/3] object-cover rounded shadow" />
        )}
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Add Show for {movie?.title}</h1>
          <p className="mt-2 text-gray-500">Schedule this movie in theaters.</p>
        </div>
      </div>

      <div className="max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Location</label>
              <select
                value={selectedLocation}
                onChange={handleLocationChange}
                required
                className="p-2 border border-gray-300 rounded focus:outline-blue-500 text-gray-700"
              >
                <option value="">-- Select Location --</option>
                {locations.map((loc, i) => (
                  <option key={i} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Select Theater</label>
              <select
                name="theaterId"
                value={formData.theaterId}
                onChange={handleChange}
                required
                disabled={!selectedLocation}
                className="p-2 border border-gray-300 rounded focus:outline-blue-500 text-gray-700 disabled:bg-gray-100"
              >
                <option value="">-- Select Theater --</option>
                {filteredTheaters.map((t) => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Format</label>
              <select
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded focus:outline-blue-500 text-gray-700"
              >
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Audio Type</label>
              <input
                type="text"
                name="audioType"
                value={formData.audioType}
                onChange={handleChange}
                placeholder="e.g., Dolby Atmos"
                className="p-2 border border-gray-300 rounded focus:outline-blue-500 text-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="p-2 border border-gray-300 rounded focus:outline-blue-500 text-gray-700"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                min={formData.startDate}
                className="p-2 border border-gray-300 rounded focus:outline-blue-500 text-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="p-2 border border-gray-300 rounded focus:outline-blue-500 text-gray-700"
              />
            </div>
            <div className="flex flex-col gap-1 hidden md:block opacity-0 pointer-events-none">
              {/* spacer */}
              <label className="font-medium text-gray-700">Spacer</label>
              <input type="text" className="p-2 border border-gray-300 rounded" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Premium Seat (₹)</label>
              <input
                type="number"
                name="Premium"
                value={formData.priceMap.Premium}
                onChange={handlePriceChange}
                required
                min="0"
                className="p-2 border border-gray-300 rounded focus:outline-blue-500 text-gray-700"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Executive Seat (₹)</label>
              <input
                type="number"
                name="Executive"
                value={formData.priceMap.Executive}
                onChange={handlePriceChange}
                required
                min="0"
                className="p-2 border border-gray-300 rounded focus:outline-blue-500 text-gray-700"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Normal Seat (₹)</label>
              <input
                type="number"
                name="Normal"
                value={formData.priceMap.Normal}
                onChange={handlePriceChange}
                required
                min="0"
                className="p-2 border border-gray-300 rounded focus:outline-blue-500 text-gray-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating..." : "Create Show"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddShowForm;
