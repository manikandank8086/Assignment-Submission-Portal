'use client'

import React, { useState } from "react"
import axios from "axios"
import { useFormik } from "formik"
import * as Yup from "yup"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navbar from "../../components/Navbar"

const UserHome = () => {
  const [loading, setLoading] = useState(false)

  const validationSchema = Yup.object({
    admin: Yup.string()
      .required("Admin is required")
      .matches(/^[A-Za-z\s]*$/, "Admin name cannot contain numbers")
      .min(3, "Admin name must be at least 3 characters")
      .max(50, "Admin name cannot be more than 50 characters"),
    file: Yup.mixed().required("File is required"),
  })

  const formik = useFormik({
    initialValues: {
      admin: "",
      file: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true)

      try {
        const email = localStorage.getItem("UserEmail")
        const token = localStorage.getItem("UserToken")

        if (!email || !token) {
          toast.error("User not authenticated. Please log in again.")
          return
        }

        const formData = new FormData()
        formData.append("admin", values.admin)
        formData.append("email", email)
        formData.append("file", values.file)

        const response = await axios.post("http://localhost:3000/assignments", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })

        if (response.data.success) {
          toast.success("Assignment submitted successfully")
          resetForm()
        } else {
          toast.error(response.data.message || "Failed to submit assignment")
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            toast.error(error.response.data.message || "Unauthorized: Please log in")
          } else if (error.response.status === 404) {
            toast.error(error.response.data.message || "Student not found")
          } else if (error.response.status === 500) {
            toast.error(error.response.data.message || "Internal server error. Please try again later")
          } else {
            toast.error(error.response.data.message || "Something went wrong")
          }
        } else if (error.request) {
          toast.error("No response from server. Please check your network")
        } else {
          toast.error("Error submitting assignment")
        }
      } finally {
        setLoading(false)
      }
    },
  })

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0]
    formik.setFieldValue("file", file)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <ToastContainer position="top-center" autoClose={3000} />
        <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-white text-center">Assignment Submission</h1>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-white mb-1">
                  Upload Assignment (PDF)
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-white bg-opacity-20 border border-transparent rounded-md p-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                />
                {formik.touched.file && formik.errors.file && (
                  <div className="text-red-300 text-sm mt-1">{formik.errors.file}</div>
                )}
              </div>

              <div>
                <label htmlFor="admin" className="block text-sm font-medium text-white mb-1">
                  Assign to Admin
                </label>
                <input
                  type="text"
                  id="admin"
                  name="admin"
                  value={formik.values.admin}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-white bg-opacity-20 border border-transparent rounded-md p-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="Enter admin name"
                />
                {formik.touched.admin && formik.errors.admin && (
                  <div className="text-red-300 text-sm mt-1">{formik.errors.admin}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
              >
                {loading ? "Submitting..." : "Submit Assignment"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 400% 400%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </div>
  )
}

export default UserHome