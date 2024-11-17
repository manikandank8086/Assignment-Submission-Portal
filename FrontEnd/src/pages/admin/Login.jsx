import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { Loginvalidation } from '../../utils/Validation';
import axios from 'axios';

const AdminLogin = () => {
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Loginvalidation,
    onSubmit: (values, { setSubmitting, setErrors }) => {
      console.log("Form submitted", values);
      axios
        .post("http://localhost:3000/admin/login", { 
          email: values.email,
          password: values.password,
        })
        .then((res) => {
          if (res.data.success) {
            localStorage.setItem("AdminToken", res.data.token);
            localStorage.setItem("AdminEmail", values.email);
            navigate("/admin/dashbord");
          } else {
            setGeneralError(res.data.message); 
          }
        })
        .catch((error) => {
          if (error.response) {
            // Backend-specific error handling
            if (error.response.status === 409) {
              setGeneralError("Admin needs to register.");
              setErrors({
                email: "Cannot find registered email", // This will show as a field-level error
              });
            } else if (error.response.status === 400) {
              setGeneralError(error.response.data.message || "Incorrect password.");
              setErrors({
                password: error.response.data.message || "Incorrect password.", // Field-level error for password
              });
            } else {
              setGeneralError(error.response.data.message || "Not a valid admin credentials");
            }
          } else {
            setGeneralError("Network error. Please try again later.");
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Admin Login</h2>

        {/* Display General Error */}
        {generalError && <div className="text-red-500 text-center mb-4">{generalError}</div>}

        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm">{formik.errors.email}</div>
              )}
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm">{formik.errors.password}</div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none"
            >
              Login
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <Link to="/admin/register" className="text-sm text-blue-500 hover:underline">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
