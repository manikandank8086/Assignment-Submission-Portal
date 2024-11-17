import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Registervalidation } from "../../utils/Validation";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const UserRegister = () => {
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState(""); // State for general errors

  // Handle Google registration success
  const handleRegisterSuccess = (credentialResponse) => {
    console.log("Google registration successful");

    const token = credentialResponse.credential;
    console.log('token: ' + token);
    const userInfo = jwtDecode(token); 
    console.log('user info: ', userInfo);
    const email = userInfo.email; 
    const name = userInfo.name || "User"; 

    axios.post('http://localhost:3000/google-register', { email, name })
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem("UserToken", res.data.token); 
          localStorage.setItem("UserEmail", email);
          localStorage.setItem("Role", 'User');

          navigate('/home'); 
        } else {
          console.error('Registration failed:', res.data.message);
          setGeneralError(res.data.message || "Registration failed");
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 409) {
            console.error('User already exists');
            setGeneralError('User already exists');
          } else {
            console.error("Error during registration:", error.response.data.message || "Unknown error");
            setGeneralError(error.response.data.message || "An unknown error occurred. Please try again.");
          }
        } else {
          console.error("Network error:", error);
          setGeneralError("Network error. Please check your connection.");
        }
      });
  };

  const handleRegisterFailure = (error) => {
    console.error("Google registration failed", error);
    setGeneralError("Google registration failed. Please try again.");
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
                  <h3 className="text-xl font-semibold mb-1">Register</h3>
                  <p className="text-sm text-slate-400">
                    Create your account...
                  </p>
                </div>

                <Formik
                  initialValues={{
                    name: "",
                    email: "",
                    phone: "",
                    password: "",
                    confirmPassword: "",
                  }}
                  validationSchema={Registervalidation}
                  onSubmit={(values, { setErrors }) => {
                    setGeneralError(""); // Reset general error state
                    axios
                      .post("http://localhost:3000/register", values)
                      .then((res) => {
                        if (res.data.success) {
                          localStorage.setItem("UserToken", res.data.token);
                          localStorage.setItem("UserEmail", values.email);
                          navigate('/home');
                        } else {
                          setErrors({ email: res.data.message || "Registration failed" });
                        }
                      })
                      .catch((error) => {
                        if (error.response) {
                          if (error.response.status === 409) {
                            setErrors({ email: "User already exists." });
                          } else if (error.response.status === 500) {
                            setErrors({ email: "Internal server error. Please try again later." });
                          } else {
                            setErrors({ email: "An unexpected error occurred. Please try again." });
                          }
                        } else {
                          console.error("Error during registration: ", error);
                          setGeneralError("An error occurred. Please check your connection and try again.");
                        }
                      });
                  }}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-4">
                        {/* Display general error message if it exists */}
                        {generalError && (
                        <div className="text-red-500 text-sm mt-2">
                          {generalError}
                        </div>
                      )}
                      <div>
                        <Field
                          className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-400 rounded-md p-2"
                          name="name"
                          placeholder="Username"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div>
                        <Field
                          className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-400 rounded-md p-2"
                          type="email"
                          name="email"
                          placeholder="Email"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div>
                        <Field
                          className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-400 rounded-md p-2"
                          type="tel"
                          name="phone"
                          placeholder="Phone"
                        />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div>
                        <Field
                          className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-400 rounded-md p-2"
                          type="password"
                          name="password"
                          placeholder="Password"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div>
                        <Field
                          className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-400 rounded-md p-2"
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm Password"
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <button
                        className="w-full bg-green-500 hover:bg-blue-600 text-white py-2 rounded-md"
                        type="submit"
                      >
                        Create
                      </button>
                    
                    </Form>
                  )}
                </Formik>

                {/* Divider for separation */}
                <div className="flex items-center my-4">
                  <div className="border-t border-slate-700 flex-grow"></div>
                  <span className="px-2 text-slate-400 text-sm">OR</span>
                  <div className="border-t border-slate-700 flex-grow"></div>
                </div>

                {/* Google Registration Button */}
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleRegisterSuccess}
                    onError={handleRegisterFailure}
                    useOneTap
                    size="large"
                    shape="pill"
                    theme="outline"
                  />
                </div>

                {/* Login link aligned to the center */}
                <div className="text-center mt-4">
                  <Link
                    to="/login"
                    className="text-sm text-slate-400 hover:text-white"
                  >
                    Already have an account? LOGIN
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
