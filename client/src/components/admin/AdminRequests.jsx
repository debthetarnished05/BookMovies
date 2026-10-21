import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { CheckIcon, XIcon } from 'lucide-react';
import { axiosWrapper } from '../../apis/axiosWrapper';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axiosWrapper.get(`/admin`);
      setRequests(Array.isArray(res.data) ? res.data : (res.data.requests || []));
    } catch (error) {
      toast.error('Failed to fetch admin requests');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axiosWrapper.patch(`/admin/${id}/approve`);
      toast.success('Admin request approved');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosWrapper.patch(`/admin/${id}/reject`);
      toast.success('Admin request rejected');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading requests...</div>;
  }

  return (
    <div className="w-full min-h-screen px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Admin Requests</h1>
        <p className="mt-2 text-gray-500">Manage users requesting admin access.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="py-3 px-6 font-medium">Name</th>
              <th className="py-3 px-6 font-medium">Email</th>
              <th className="py-3 px-6 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-4 px-6 text-center text-gray-500">No pending requests found.</td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-6">{request.userId?.name || 'Unknown'}</td>
                  <td className="py-4 px-6">{request.userId?.email || 'Unknown'}</td>
                  <td className="py-4 px-6 flex gap-3">
                    <button
                      onClick={() => handleApprove(request._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <CheckIcon className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(request._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <XIcon className="w-4 h-4" /> Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRequests;
