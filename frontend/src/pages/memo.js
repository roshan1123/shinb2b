import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { logout, isAuthenticated,getuserName,get_users,getToken} from "../services/auth";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    //const userRole = getRole();
    const userName = getuserName();
    const token = getToken();

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
        navigate("/login")
    }


    return (
        <div
        className="vh-100 d-flex flex-column"
        style={{
            backgroundImage: "url('/home_bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
        >
        {/* Top Navigation (Login, Register, Logout) */}
        <nav className="container-fluid py-3">
            <div className="d-flex justify-content-end">
            {isAuthenticated() ? (
                <>
                <span className="">Welcome <strong>{userName}</strong></span>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                <button className="btn btn-light me-2" onClick={() => navigate("/login")}>Login</button>
                <button className="btn btn-outline-light" onClick={() => navigate("/register")}>Register</button>
                </>
            )}
            </div>
        </nav>

        {/* Centered Welcome Text */}
        <div className="flex-grow-1 d-flex align-items-center justify-content-center text-center">
        <div>
            <h2>User List</h2>
                {error && <p>Error: {error}</p>}
             <ul>
                {users.map((u, i) => (
                <li key={i}>{JSON.stringify(u)}</li>
                 ))}
            </ul>
         </div>

        </div>   

    


        <div className="container-fluid">
            <div className="d-sm-flex justify-content-between align-items-center mb-4">
                <h3 className="text-dark mb-0">Dashboard</h3>
                <button className="btn btn-primary btn-sm d-none d-sm-inline-block">
                    <i className="fas fa-download fa-sm text-white-50"/> Generate Report </button>
            </div>
            <div className="row">
                <div className="col-md-6 col-xl-3 mb-4">
                    <div className="card shadow border-left-primary py-2">
                        <div className="card-body">
                            <div className="row align-items-center no-gutters">
                                <div className="col mr-2">
                                    <div className="text-uppercase text-primary font-weight-bold text-xs mb-1">
                                        <span>Projects</span></div>
                                    <div className="text-dark font-weight-bold h5 mb-0"><span>10</span></div>
                                </div>
                                <div className="col-auto"><i className="fas fa-calendar fa-2x text-gray-300"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3 mb-4">
                    <div className="card shadow border-left-success py-2">
                        <div className="card-body">
                            <div className="row align-items-center no-gutters">
                                <div className="col mr-2">
                                    <div className="text-uppercase text-success font-weight-bold text-xs mb-1">
                                        <span>Active Tasks</span></div>
                                    <div className="text-dark font-weight-bold h5 mb-0"><span>55</span></div>
                                </div>
                                <div className="col-auto"><i className="fas fa-dollar-sign fa-2x text-gray-300"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3 mb-4">
                    <div className="card shadow border-left-info py-2">
                        <div className="card-body">
                            <div className="row align-items-center no-gutters">
                                <div className="col mr-2">
                                    <div className="text-uppercase text-info font-weight-bold text-xs mb-1">
                                        <span>Tasks</span></div>
                                    <div className="row no-gutters align-items-center">
                                        <div className="col-auto">
                                            <div className="text-dark font-weight-bold h5 mb-0 mr-3">
                                                <span>50%</span></div>
                                        </div>
                                        <div className="col">
                                            <div className="progress progress-sm">
                                                <div className="progress-bar bg-info" aria-valuenow="50"
                                                     aria-valuemin="0" aria-valuemax="100" style={{width: "50%"}}><span
                                                    className="sr-only">50%</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-auto"><i
                                    className="fas fa-clipboard-list fa-2x text-gray-300"/></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3 mb-4">
                    <div className="card shadow border-left-primary py-2">
                        <div className="card-body">
                            <div className="row align-items-center no-gutters">
                                <div className="col mr-2">
                                    <div className="text-uppercase text-warning font-weight-bold text-xs mb-1">
                                        <span>Active users</span></div>
                                    <div className="text-dark font-weight-bold h5 mb-0"><span>18</span></div>
                                </div>
                                <div className="col-auto"><i className="fas fa-users fa-2x text-gray-300"/></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>








   
    </div>
    );
};

export default AdminDashboard;
