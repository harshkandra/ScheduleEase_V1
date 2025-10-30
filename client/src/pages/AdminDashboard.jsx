import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  CalendarDays,
  Users,
  LogOut,
  Eye,
  Check,
  X,
  Filter,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");

  const stats = [
    { title: "Pending Requests", value: 8, change: "+3 today", icon: <Clock className="text-orange-500" /> },
    { title: "Today's Appointments", value: 4, change: "2 remaining", icon: <CalendarDays className="text-blue-500" /> },
    { title: "Approved This Week", value: 24, change: "+12%", icon: <CheckCircle className="text-green-500" /> },
    { title: "Total Users", value: 156, change: "+8 new", icon: <Users className="text-purple-500" /> },
  ];

  const requests = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@example.com",
      role: "External Visitor",
      topic: "Industry Collaboration Discussion",
      requested: "Dec 28, 2024 at 2:00 PM",
      submitted: "2 hours ago",
    },
    {
      id: 2,
      name: "Dr. Priya Nair",
      email: "priya@company.com",
      role: "External Visitor",
      topic: "Research Partnership Proposal",
      requested: "Dec 30, 2024 at 10:30 AM",
      submitted: "5 hours ago",
    },
    {
      id: 3,
      name: "Ankit Kumar",
      email: "ankit.staff@nitc.ac.in",
      role: "Staff",
      topic: "Budget Discussion",
      requested: "Jan 2, 2025 at 11:00 AM",
      submitted: "1 day ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between bg-white shadow-sm px-8 py-4">
        <div>
          <h1 className="text-2xl font-bold text-sky-600">SchedulEase <span className="text-green-600">Admin</span></h1>
          <p className="text-sm text-gray-500">Director's Office Administration</p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 border rounded-full px-3 py-1">
            Administrator
          </span>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 px-8">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border rounded-xl p-5 flex items-center justify-between shadow-sm"
          >
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{item.value}</h3>
              <p className="text-xs text-green-500">{item.change}</p>
            </div>
            {item.icon}
          </div>
        ))}
      </section>

      {/* Tabs */}
      <div className="flex justify-start border-b border-gray-200 mt-8 px-8">
        {["pending", "today", "calendar", "analytics"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium capitalize ${
              activeTab === tab
                ? "border-b-2 border-sky-500 text-sky-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "pending" && "Pending Requests"}
            {tab === "today" && "Today's Schedule"}
            {tab === "calendar" && "Director's Calendar"}
            {tab === "analytics" && "Analytics"}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      {activeTab === "pending" && (
        <div className="flex justify-between items-center mt-6 px-8">
          <h2 className="text-lg font-semibold text-gray-700">Appointment Requests</h2>
          <div className="flex items-center gap-2">
            <select className="border border-gray-300 rounded-lg text-sm px-3 py-2">
              <option>Filter by type</option>
              <option>External Visitor</option>
              <option>Staff</option>
            </select>
            <button className="flex items-center gap-1 border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>
      )}

      {/* Appointment Requests */}
      {activeTab === "pending" && (
        <div className="mt-4 px-8 space-y-4 pb-10">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-gray-800">{req.name}</h3>
                <p className="text-sm text-gray-500">{req.email}</p>
                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full w-fit mt-1">
                  {req.role}
                </span>
              </div>

              <div className="flex-1 sm:ml-10 mt-3 sm:mt-0">
                <p className="font-medium text-gray-700">{req.topic}</p>
                <p className="text-sm text-gray-500">
                  Requested: {req.requested}
                </p>
                <p className="text-xs text-gray-400">Submitted: {req.submitted}</p>
              </div>

              <div className="flex gap-2 mt-3 sm:mt-0">
                <button className="flex items-center gap-1 border border-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-gray-50">
                  <Eye size={16} /> View Details
                </button>
                <button className="flex items-center gap-1 bg-green-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-600">
                  <Check size={16} /> Approve
                </button>
                <button className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600">
                  <X size={16} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
