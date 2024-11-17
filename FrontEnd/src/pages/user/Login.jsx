import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useFormik } from "formik";
import axios from "axios";
import { Loginvalidation } from "../../utils/Validation";
import { jwtDecode } from "jwt-decode"; // Corrected import

const UserLogin = () => {
  const [generalError, setGeneralError] = useState(""); // State to hold general errors
  const navigate = useNavigate();

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Loginvalidation,
    onSubmit: (values) => {
      console.log("Form submitted", values);
      axios
        .post("http://localhost:3000/login", { 
            email: values.email,
        password: values.password,
        })
        .then((res) => {
          if (res.data.success) {
            localStorage.setItem("UserToken", res.data.token); 
            localStorage.setItem("UserEmail", values.email); 
            navigate("/home"); 
          } else {
            setGeneralError(res.data.message); 
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 409) {
            setGeneralError("User need to register."); 
          } else {
            setGeneralError("An error occurred during registration."); 
            console.error("Error during registration:", error);
          }
        });
    },
  });

  // Handle Google login success
  const handleLoginSuccess = (credentialResponse) => {
    console.log("Google login successful");

    const token = credentialResponse.credential;
    console.log("Token:", token);
    const userInfo = jwtDecode(token); // Decode the JWT token
    console.log("User info:", userInfo);
    const email = userInfo.email;
    console.log("Email:", email);

    // Send a POST request to the backend for Google login registration
    axios
      .post("http://localhost:3000/google-login", { email })
      .then((res) => {
        if (res.data.success) {
          // On successful registration or login, navigate to the home page
          localStorage.setItem("UserToken", res.data.token); // Store the token in localStorage
          localStorage.setItem("UserEmail", email); // Store email in localStorage
          navigate("/home"); // Navigate to home page
        } else {
          setGeneralError(res.data.message); // Set general error message from the response
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          setGeneralError("User need to register."); // Set a user-specific error message
        } else {
          setGeneralError("An error occurred during registration."); // Generic error message
          console.error("Error during registration:", error);
        }
      });
  };

  const handleLoginFailure = (error) => {
    setGeneralError("Google login failed. Please try again."); // Handle Google login failure
    console.error("Google login failed", error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-slate-900/50 text-white">
        <div className="p-0">
          <div className="grid md:grid-cols-2">
            <div className="bg-slate-800 p-6 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-500 mb-2">GADGET</h2>
                <p className="text-sm text-slate-400">IT MAGAZINE</p>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Login</h3>
                  <p className="text-sm text-slate-400">
                    Sign in to your account
                  </p>
                </div>
                <form className="space-y-4" onSubmit={formik.handleSubmit}>
                  {/* Display general error message if it exists */}
                  {generalError && (
                    <div className="text-red-500 text-sm mt-2">
                      {generalError}
                    </div>
                  )}
                  <div>
                    <input
                      className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-400 rounded-md p-2"
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <input
                      className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-400 rounded-md p-2"
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.password && formik.errors.password && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.password}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-300"
                  >
                    Login
                  </button>
                  <div className="text-center">
                    <Link
                      to="/register"
                      className="text-sm text-slate-400 hover:text-white"
                    >
                      Don't have an account? Create an account
                    </Link>
                  </div>
                </form>

                {/* Divider for separation */}
                <div className="flex items-center my-4">
                  <div className="border-t border-slate-700 flex-grow"></div>
                  <span className="px-2 text-slate-400 text-sm">OR</span>
                  <div className="border-t border-slate-700 flex-grow"></div>
                </div>

                {/* Google Login button */}
                <div className="mt-4">
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginFailure}
                    useOneTap
                    size="large"
                    shape="pill"
                    theme="outline"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
