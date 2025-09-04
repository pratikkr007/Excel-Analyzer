import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";
import "./Navbar.css";

function Navbar() {
  const { token } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const location = useLocation(); // Get current location

  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="navbar">
      {/* Change Excel Analytics link based on login state */}
      <Link 
        to={token ? "/dashboard" : "/"} 
        className={isActive(token ? "/dashboard" : "/") ? "active" : ""}
      >
        Excel Analytics
      </Link>
      <div>
        {token ? (
          <>
            <Link 
              to="/dashboard" 
              className={isActive("/dashboard") ? "active" : ""}
            >
              Dashboard
            </Link>
            <Link 
              to="/upload" 
              className={isActive("/upload") ? "active" : ""}
            >
              Upload
            </Link>
            <Link 
              to="/charts" 
              className={isActive("/charts") ? "active" : ""}
            >
              Charts
            </Link>
            <Link 
              to="/admin" 
              className={isActive("/admin") ? "active" : ""}
            >
              Admin
            </Link>
            <button onClick={() => dispatch(logout())}>Logout</button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className={isActive("/login") ? "active" : ""}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className={isActive("/register") ? "active" : ""}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;