import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register, login } from "../services/api";
import { setAuth } from "../store/authSlice";
import { jwtDecode } from "jwt-decode";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    userType: "Skill Seeker",
  });
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      const { data } = await login({
        email: formData.email,
        password: formData.password,
      });
      const decodedToken = jwtDecode(data.token);
      localStorage.setItem("token", data.token);
      dispatch(setAuth({ user: decodedToken, token: data.token }));
      setError(null);
      navigate("/"); // Redirect to the home page
    } catch (error) {
      setError(
        error.response ? error.response.data.message : "Registration failed"
      );
    }
  };

  return (
    <div className="flex items-center justify-center  bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm text-gray-700">User Type</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Skill Seeker">Skill Seeker</option>
              <option value="Experience Seeker">Experience Seeker</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Register
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default Register;
