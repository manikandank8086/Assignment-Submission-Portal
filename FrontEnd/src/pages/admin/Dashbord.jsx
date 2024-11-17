"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserCircle, Search, Check, X, ChevronDown } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure you import styles for react-toastify
import { format } from "date-fns"; // Importing date-fns for date formatting
import { useNavigate } from "react-router-dom";

const AdminDashbord = () => {
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate= useNavigate()

  // Fetch assignments when component mounts
  useEffect(() => {
    const fetchAssignments = async () => {
      const email = localStorage.getItem("AdminEmail");
      const token = localStorage.getItem("AdminToken");

      // Check if user is authenticated
      if (!email || !token) {
        toast.error("User not authenticated. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/admin/dashbord/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Handle successful response
        if (response.data && response.data.success) {
          setAssignments(response.data.assignmentData || []);
        } else {
          setError("No assignments found.");
        }
      } catch (err) {
        // Handle error
        setError("Failed to fetch assignments. Please try again.");
        console.error("Error fetching assignments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  // Handle assignment acceptance/rejection
  const handleAssignmentAction = async (isActive, assignmentId) => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/admin/assignment",
        { isActive, assignmentId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
          },
        }
      );

      // Show toast notification based on response
      if (response.data.success) {
        toast.success("Assignment updated successfully!");
        // Update local state to reflect changes
        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment._id === assignmentId
              ? { ...assignment, status: isActive ? "accepted" : "rejected" }
              : assignment
          )
        );
      } else {
        toast.error("Failed to update assignment.");
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
      toast.error("Error updating assignment. Please try again.");
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("AdminEmail");
    localStorage.removeItem("AdminToken");
    navigate('/admin/login')
  };

  // Toggle the user profile dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Filter assignments based on search term
  const filteredAssignments = assignments.filter((assignment) => {
    const searchLower = searchTerm.toLowerCase().trim();
    const userIdLower = assignment.userId ? assignment.userId.toLowerCase() : "";
    const taskLower = assignment.task ? assignment.task.toLowerCase() : "";

    // Match search term with userId or task
    return userIdLower.includes(searchLower) || taskLower.includes(searchLower);
  });

  // Render loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-900 text-gray-100 justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for User ID or Task"
                className="pl-10 pr-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                <UserCircle className="w-6 h-6" />
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-100 hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Assignments Table */}
        <div className="bg-gray-800  rounded-lg overflow-hidden">
          <table className="w-full  text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Admin</th>
                <th className="px-6 py-3 text-left">Task</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Submission Date</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((assignment) => (
                  <tr key={assignment._id} className="border-b border-gray-700">
                    <td className="px-6 py-4">{assignment.userId}</td>
                    <td className="px-6 py-4">{assignment.admin}</td>
                    <td className="px-6 py-4">{assignment.task}</td>
                    <td
                      className={`px-6 py-4 ${
                        assignment.status === "pending"
                          ? "text-yellow-500"
                          : assignment.status === "accepted"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {assignment.status === "accepted"
                        ? "Approved"
                        : assignment.status === "rejected"
                        ? "Rejected"
                        : "Pending"}
                    </td>
                    <td className="px-6 py-4">
                      {/* Format the date */}
                      {assignment.createdAt
                        ? format(new Date(assignment.createdAt), "MM/dd/yyyy")
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2">
                        {assignment.status === "pending" ? (
                          <>
                            <button
                              onClick={() =>
                                handleAssignmentAction(true, assignment._id)
                              }
                              className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                              title="Accept"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleAssignmentAction(false, assignment._id)
                              }
                              className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <span
                            className={
                              assignment.status === "accepted"
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            {assignment.status}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No Assignment Data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
};

export default AdminDashbord;
