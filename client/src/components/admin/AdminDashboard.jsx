
import Sidebar from "./Sidebar";
import Dashboard from "./superAdminDashboard";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Dashboard */}
      <main className="flex-1 p-6    md:p-8 overflow-y-auto">
        <Dashboard />
      </main>
    </div>
  );
};

export default AdminDashboard;
