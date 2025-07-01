/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/Logo.webp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes.js";
import { FiUser, FiMail, FiLock, FiLogIn } from "react-icons/fi";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const verifiedEmail = location.state?.email;
    const isVerified = location.state?.emailVerified;

    if (verifiedEmail && isVerified) {
      setValues((prev) => ({ ...prev, email: verifiedEmail }));
      setEmailVerified(true);
    }
  }, [location]);

  useEffect(() => {
    if (sessionStorage.getItem("chat-app-user")) {
      navigate("/chat");
    }
  }, [navigate]);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleValidations = () => {
    const { password, confirmpassword, username, email } = values;
    if (password !== confirmpassword) {
      toast.error("Password and Confirm Password should match", toastOptions);
      return false;
    }
    if (username.length < 3) {
      toast.error("Username must be at least 3 characters", toastOptions);
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters", toastOptions);
      return false;
    }
    if (!email) {
      toast.error("Email is required", toastOptions);
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address", toastOptions);
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    if (!values.email || !/\S+@\S+\.\S+/.test(values.email)) {
      toast.error("Enter a valid email before verifying", toastOptions);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/otp/send-otp", {
        email: values.email,
      });

      // ✅ Go to OTP verification page WITH email passed as route state
      navigate("/verify-otp", { state: { email: values.email } });
    } catch (err) {
      toast.error("Failed to send OTP. Try again.", toastOptions);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!emailVerified) {
      toast.error("Please verify your email before registering", toastOptions);
      setIsLoading(false);
      return;
    }

    if (handleValidations()) {
      const { username, email, password, confirmpassword } = values;

      try {
        const { data } = await axios.post(
          registerRoute,
          {
            username,
            email,
            password,
            confirmpassword,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (data.status === false) {
          toast.error(data.message, toastOptions);
        }

        if (data.status === true) {
          sessionStorage.setItem("chat-app-user", JSON.stringify(data.user));
          navigate("/setAvatar");
        }
      } catch (error) {
        if (error.response?.status === 409) {
          toast.error(error.response.data.message, toastOptions);
        } else {
          toast.error("Something went wrong. Try again later.", toastOptions);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-indigo-100 rounded-[100px] mb-4">
              <img src={Logo} alt="ChatNest Logo" className="w-16" />
            </div>
            <h1 className="text-3xl font-bold text-indigo-900">
              Create Account
            </h1>
            <p className="text-gray-600 mt-2">Join ChatNest today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-indigo-500" />
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-indigo-500" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    disabled={emailVerified}
                    className="w-full pl-10 pr-4 py-3 border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={emailVerified}
                  className="text-sm px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  {emailVerified ? "Verified" : "Verify"}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-indigo-500" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-indigo-500" />
                </div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmpassword"
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-xl text-white font-medium transition-all ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  <FiLogIn className="mr-2" />
                  Register
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        <div className="bg-indigo-50 py-4 px-6 text-center">
          <p className="text-xs text-indigo-800">
            By registering, you agree to our Terms and Privacy Policy
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Register;
