import { useNavigate } from "react-router-dom";
import { logout, isAuthenticated, getRole,getuserName} from "../services/auth";
import "bootstrap/dist/css/bootstrap.min.css";

const UserDashboard = () => {
    const navigate = useNavigate();
    const userRole = getRole();
    const userName = getuserName();

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
            <p className="lead">Welcome {userName}</p>
        </div>
        </div>
    );
};

export default UserDashboard;
