import React, { use, useEffect } from "react";
import { tabs } from "../utils/constants";
import { IoIosLogOut, IoMdAdd } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import BookingHistory from "../components/profile/BookingHistory";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { axiosWrapper } from "../apis/axiosWrapper";
import { toast } from "react-hot-toast";

const Profile = () => {

  const { tab } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("profile");

  useEffect(() => {
    if(tab && tabs.includes(tab)) {
      setActiveTab(tab);
    }
  },[tab])

  const { user, logoutRequest } = useAuth();

  const handleLogout = () => {
    console.log("click")
    logoutRequest();
  }

  return (
    <>
      <div className="bg-[#e5e5e5]">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-6 py-2 text-sm font-medium">
          {tabs.map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
              className={`pb-1 cursor-pointer ${
                activeTab === tab
                  ? "text-[#f74565]"
                  : "text-gray-600 hove:text-black"
              }`}
            >
              {tab.toLocaleUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-screen py-10 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          {/* Profile Section */}
          {activeTab === "profile" && (
            <>
              {/* Headers */}
              <div className="bg-gradient-to-r from-gray-800 to-[#f74565] rounded-t-md px-6 py-6 flex items-center gap-6 text-white">
                <div className="relative w-20 h-20 border-4 border-white rounded-full flex items-center justify-center bg-white text-gray-600">
                  <IoMdAdd size={24} />
                </div>
                <div className="mt-2">
                  <h2 className="text-2xl font-bold">Hi, {user?.name}</h2>
                  <div className="flex items-center gap-4 mt-1">
                    <small onClick={handleLogout} className="underline cursor-pointer">
                      <IoIosLogOut size={20} className="inline" /> Logout
                    </small>
                    {(user?.role === "admin" || user?.role === "superadmin") && (
                      <small onClick={() => navigate("/admin")} className="underline cursor-pointer">
                        Go to Dashboard
                      </small>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-white px-6 py-6 rounded-b-md">
                <h3 className="text-lg font-semibold mb-4">Account Details</h3>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-normal">Email Address</p>
                  <div className="flex items-center gap-2">
                    <span>{user?.email}</span>
                    <span className="text-green-600 text-xs bg-green-100 px-2 rounded">
                      Verified
                    </span>
                  </div>
                  <FiEdit className="text-pink-500 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-normal">Mobile Number</p>
                  <div className="flex items-center gap-2">
                    <span>+91-{user?.phone || 91222222222}</span>
                    <span className="text-green-600 text-xs bg-green-100 px-2 rounded">
                      Verified
                    </span>
                  </div>
                  <FiEdit className="text-pink-500 cursor-pointer" />
                </div>
              </div>

              {/* Personal Details */}
              <div className="bg-white p-6 mt-4 rounded-md">
                <h3 className="text-lg font-semibold mb-4">Personal Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-normal">Name</label>
                    <input
                      type="text"
                      value={user?.name}
                      readOnly
                      className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 "
                    />
                  </div>
                  <div>
                    <label className="text-sm font-normal">
                      Birthday (Optional)
                    </label>
                    <input
                      type="date"
                      className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 "
                    />
                  </div>
                  <div>
                    <label className="text-sm font-normal">
                      Identity (Optional)
                    </label>
                    <div className="flex gap-2 mt-1">
                      <button
                        className={`px-4 py-1 border border-gray-200 rounded-lg bg-white`}
                      >
                        Woman
                      </button>
                      <button
                        className={`px-4 py-1 border border-gray-200 rounded-lg bg-white`}
                      >
                        Man
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-normal">
                      Married? (Optional)
                    </label>
                    <div className="flex gap-2 mt-1">
                      <button
                        className={`px-4 py-1 border border-gray-200 rounded-lg bg-white`}
                      >
                        Yes
                      </button>
                      <button
                        className={`px-4 py-1 border border-gray-200 rounded-lg bg-white`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Request Admin Access */}
              {user?.role === 'user' && (
                <div className="bg-white p-6 mt-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-4">Request Admin Access</h3>
                  <div className="flex flex-col gap-2 max-w-sm">
                    <p className="text-sm text-gray-600 mb-2">Want to become an admin? Enter your password to request access.</p>
                    <input
                      type="password"
                      placeholder="Your Password"
                      id="adminReqPassword"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-2"
                    />
                    <button 
                      onClick={async () => {
                        const pwd = document.getElementById("adminReqPassword").value;
                        if (!pwd) {
                          toast.error("Please enter your password");
                          return;
                        }
                        try {
                          const res = await axiosWrapper.post(`/admin/request-access`, {
                            email: user.email,
                            password: pwd
                          });
                          toast.success("Admin access requested successfully!");
                          document.getElementById("adminReqPassword").value = "";
                        } catch (err) {
                          toast.error(err.response?.data?.message || err.message || "Failed to request admin access");
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                    >
                      Request Access
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

            {/* Bookings Section */}
            {activeTab === "booking" && <BookingHistory />}
        </div>
      </div>
    </>
  );
};

export default Profile;