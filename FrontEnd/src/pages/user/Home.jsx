import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SubmissionPorvatalidation } from "../../utils/Validation";
import Navbar from "../../components/Navbar";

const UserHome = () => {
  const [loading, setLoading] = useState(false);

  // useFormik hook for form handling
  const formik = useFormik({
    initialValues: {
      task: "",
      admin: "",
    },
    validationSchema: SubmissionPorvatalidation,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      try {
        // Get the email and token from localStorage
        const email = localStorage.getItem("UserEmail");
        const token = localStorage.getItem("UserToken");
        

        // Check if email or token is missing
        if (!email || !token) {
          toast.error("User not authenticated. Please log in again.");
          return;
        }

        // Send the request to submit the assignment
        const response = await axios.post(
          "http://localhost:3000/assignments",
          {
            task: values.task,
            admin: values.admin,
            email: email,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Check if the response is successful
        if (response.data.success) {
          toast.success("Assignment submitted successfully");
          resetForm();
        } else {
          // Handle unsuccessful response from server
          toast.error(response.data.message || "Failed to submit assignment");
        }
      } catch (error) {
        // Detailed error handling based on error response
        if (error.response) {
          // If the error response exists, check the status
          if (error.response.status === 401) {
            toast.error(  error.response.data.message||"Unauthorized: Please log in");
          } else if (error.response.status === 404) {
            toast.error(error.response.data.message || "Student not found");
          } else if (error.response.status === 500) {
            toast.error(error.response.data.message ||"Internal server error. Please try again later");
          } else {
            toast.error(error.response.data.message || "Something went wrong");
          }
        } else if (error.request) {
          // If no response from the server
          toast.error(error.response.data.message || "No response from server. Please check your network");
        } else {
          // Other errors (e.g., issues with axios setup)
          toast.error(error.response.data.message || "Error submitting assignment");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <ToastContainer position="top-center" autoClose={3000} />
        <h1 className="text-3xl font-bold mb-8">User Assignment Portal</h1>
        <form
          className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md"
          onSubmit={formik.handleSubmit}
        >
          <div className="mb-4">
            <label htmlFor="task" className="block text-sm font-medium mb-1">
              Task
            </label>
            <input
              type="text"
              id="task"
              name="task"
              value={formik.values.task}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full bg-gray-700 border ${
                formik.touched.task && formik.errors.task
                  ? "border-red-500"
                  : "border-gray-600"
              } rounded-md p-2 text-white focus:outline-none focus:border-blue-500`}
              placeholder="Enter task details"
            />
            {formik.touched.task && formik.errors.task ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.task}
              </div>
            ) : null}
          </div>

          <div className="mb-4">
            <label htmlFor="admin" className="block text-sm font-medium mb-1">
              Assign to Admin
            </label>
            <input
              type="text"
              id="admin"
              name="admin"
              value={formik.values.admin}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full bg-gray-700 border ${
                formik.touched.admin && formik.errors.admin
                  ? "border-red-500"
                  : "border-gray-600"
              } rounded-md p-2 text-white focus:outline-none focus:border-blue-500`}
              placeholder="Enter admin name"
            />
            {formik.touched.admin && formik.errors.admin ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.admin}
              </div>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md transition-colors duration-300 mt-4"
          >
            {loading ? "Submitting..." : "Submit Assignment"}
          </button>
        </form>
      </div>
    </>
  );
};

export default UserHome;
