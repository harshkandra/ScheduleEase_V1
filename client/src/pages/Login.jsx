import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSelectRole = (role) => {
    setSelectedRole(role);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (selectedRole === "student") navigate("/student");
    else if (selectedRole === "external") navigate("/external");
    else if (selectedRole === "admin") navigate("/admin");
    else alert("Please select an account type first!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-teal-400 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#3b82f6"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 6.75h7.5m-7.5 3.75h7.5M3 6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25V6.75z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">SchedulEase</h1>
          <p className="text-sm text-gray-500">Director's Office Administration</p>
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <p className="text-center text-gray-700 font-semibold">Welcome Back</p>
          <p className="text-center text-gray-500 text-sm">
            Choose your account type and sign in
          </p>

          <div className="space-y-3 mt-4">
            {/* NITC User */}
            <button
              onClick={() => handleSelectRole("student")}
              className={`w-full border flex items-center justify-between px-4 py-3 rounded-xl transition ${
                selectedRole === "student"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
            >
              <span className="flex items-center gap-2 text-gray-700">
                <span className="text-blue-500 font-semibold">👤</span>
                <span>NITC User</span>
              </span>
              <span className="text-xs text-gray-500">Auto-approved appointments</span>
            </button>

            {/* External User */}
            <button
              onClick={() => handleSelectRole("external")}
              className={`w-full border flex items-center justify-between px-4 py-3 rounded-xl transition ${
                selectedRole === "external"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-green-400"
              }`}
            >
              <span className="flex items-center gap-2 text-gray-700">
                <span className="text-green-500 font-semibold">🌐</span>
                <span>External User</span>
              </span>
              <span className="text-xs text-gray-500">Book 2 days in advance</span>
            </button>

            {/* Administrator */}
            <button
              onClick={() => handleSelectRole("admin")}
              className={`w-full border flex items-center justify-between px-4 py-3 rounded-xl transition ${
                selectedRole === "admin"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-gray-300 hover:border-yellow-400"
              }`}
            >
              <span className="flex items-center gap-2 text-gray-700">
                <span className="text-yellow-500 font-semibold">🛠️</span>
                <span>Administrator</span>
              </span>
              <span className="text-xs text-gray-500">
                Manage schedules & appointments
              </span>
            </button>
          </div>
        </div>

        {/* Conditional Input Fields */}
        {selectedRole && (
          <form onSubmit={handleLogin} className="space-y-3 mt-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
            >
              Login
            </button>

            {/* ✅ Show "New user" link only for Student & External */}
            {selectedRole !== "admin" && (
              <div className="text-center">
                <a
                  href="/register"
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  I am a New user
                </a>
              </div>
            )}
          </form>
        )}

        {/* Google Button */}
        <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg mt-4 hover:bg-gray-50 transition">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-gray-600 font-medium">Continue with Google</span>
        </button>
      </div>
    </div>
  );
}
