import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { logout, isAuthenticated, getuserName, get_users, getToken } from "../services/auth";
import B2BUploader from "../components/B2BUploader";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import '@fortawesome/fontawesome-free/css/all.min.css';
//import B2BUploader from "./components/B2BUploader";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const userName = getuserName();
  const token = getToken();

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await get_users(token);
        setUsers(data);
      } catch (error) {
        setError(error.message || 'Something went wrong');
      }
    };
    fetchUsers();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="bg-dark text-white p-3" style={{ width: "200px", minHeight: "100vh" }}>
          <h4 className="text-center">Menu</h4>
          <ul className="nav flex-column">
            <li className="nav-item">
              <button className="btn btn-link text-white" onClick={() => handleSectionChange("dashboard")}>
                Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button className="btn btn-link text-white" onClick={() => handleSectionChange("users")}>
                User List
              </button>
            </li>
            <li className="nav-item">
              <button className="btn btn-link text-white" onClick={() => handleSectionChange("b2b")}>
                B2B Data
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Top Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 shadow-sm">
          <div className="container-fluid d-flex justify-content-between">
            <button className="btn btn-outline-secondary" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <i className="fas fa-bars" />
            </button>
            <div>
              {isAuthenticated() ? (
                <>
                  <span className="me-3">Welcome, <strong>{userName}</strong></span>
                  <button className="btn btn-danger btn-sm" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <>
                  <button className="btn btn-outline-primary me-2" onClick={() => navigate("/login")}>Login</button>
                  <button className="btn btn-primary" onClick={() => navigate("/register")}>Register</button>
                </>
              )}
            </div>
          </div>
        </nav>

        <div className="container mt-4">
          {activeSection === "dashboard" && (
            <>
              <h3 className="mb-4">Dashboard</h3>
              <div className="row">
                <DashboardCard title="Projects" value="10" icon="calendar" color="primary" />
                <DashboardCard title="Active Tasks" value="55" icon="check-circle" color="success" />
                <DashboardCard title="Progress" value="50%" icon="list" color="info" progress={50} />
                <DashboardCard title="Active Users" value="18" icon="users" color="warning" />
              </div>
            </>
          )}

          {activeSection === "users" && (
            <>
              <h4>User List</h4>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>User Name</th>
                      <th>User Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((u, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{u.username}</td>
                          <td>{u.role}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeSection === "b2b" && <B2BUploader />}

        </div>
      </div>
    </div>
  );
};

// DashboardCard Component
const DashboardCard = ({ title, value, icon, color, progress }) => (
  <div className="col-md-6 col-xl-3 mb-4">
    <div className={`card shadow border-left-${color} py-2`}>
      <div className="card-body">
        <div className="row align-items-center no-gutters">
          <div className="col mr-2">
            <div className={`text-uppercase text-${color} font-weight-bold text-xs mb-1`}>
              <span>{title}</span>
            </div>
            {progress != null ? (
              <div className="row no-gutters align-items-center">
                <div className="col-auto">
                  <div className="text-dark font-weight-bold h5 mb-0 mr-3">{value}</div>
                </div>
                <div className="col">
                  <div className="progress progress-sm">
                    <div className={`progress-bar bg-${color}`} role="progressbar" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-dark font-weight-bold h5 mb-0"><span>{value}</span></div>
            )}
          </div>
          <div className="col-auto">
            <i className={`fas fa-${icon} fa-2x text-gray-300`} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
