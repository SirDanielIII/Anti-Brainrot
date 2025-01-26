import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { clearAuth } from "../store/authSlice"; // Import the clearAuth action

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    dispatch(clearAuth()); // Dispatch clearAuth action
    navigate("/signup-login"); // Redirect to signup-login page
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link className="text-white text-lg font-bold" to="/">
          AntiBrainRot {user && ` - ${user.username}  `}{" "}
          {/* Display username if logged in */}
        </Link>
        <div className="flex items-center">
          <div className="space-x-4">
            <Link className="text-gray-300 hover:text-white" to="/">
              Home
            </Link>

            <Link className="text-gray-300 hover:text-white" to="/workmode">
              WorkMode
            </Link>
            <Link className="text-gray-300 hover:text-white" to="/profile">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
