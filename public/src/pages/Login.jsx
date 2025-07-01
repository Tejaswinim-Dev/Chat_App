/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../assets/Logo.webp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes.js";
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';

const toastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    if (handleValidations()) {
      const { username, password } = values;
      try {
        const { data } = await axios.post(loginRoute, { username, password }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!data.status) {
          toast.error(data.msg, toastOptions);
        } else {
          sessionStorage.setItem('chat-app-user', JSON.stringify(data.user));
          navigate("/setAvatar");
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          toast.error(error.response.data.msg, toastOptions);
        } else {
          toast.error("Something went wrong. Please try again later.", toastOptions);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const handleValidations = () => {
    const { username, password } = values;
    if (!username || !password) {
      toast.error("Username and Password are required", toastOptions);
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (sessionStorage.getItem('chat-app-user')) {
      navigate('/setAvatar');
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-indigo-100 rounded-[100px] mb-4">
              <img src={Logo} alt="ChatNest Logo" className="w-16" />
            </div>
            <h1 className="text-3xl font-bold text-indigo-900">ChatNest</h1>
            <p className="text-gray-600 mt-2">Sign in to continue</p>
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
                  className="w-full pl-10 pr-4 py-3 border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
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
                  className="w-full pl-10 pr-4 py-3 border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-xl text-white font-medium transition-all ${
                isLoading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FiLogIn className="mr-2" />
                  Login
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition-colors"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
        
        <div className="bg-indigo-50 py-4 px-6 text-center">
          <p className="text-xs text-indigo-800">
            © {new Date().getFullYear()} ChatNest. All rights reserved.
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
