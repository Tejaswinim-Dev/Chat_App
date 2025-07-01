// src/pages/Verify.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      toast.error("Invalid access. Please register first.");
      navigate("/register");
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus to next input
      if (value && index <5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:5000/api/otp/verify-otp", {
        email,
        otp: otpCode,
      });

      if (data.success) {
        toast.success("OTP verified successfully!");
        navigate("/register", { state: { emailVerified: true, email } });
      } else {
        toast.error(data.message || "OTP verification failed");
      }
    } catch (err) {
      toast.error("Something went wrong during OTP verification");
    }
  };

  const maskedEmail = email
    ? email.replace(/(.{3})(.*)(?=@)/, (_, a, b) => a + "*".repeat(b.length))
    : "";

  return (
    <div className="flex justify-center items-center min-h-screen bg-indigo-50">
      <div className="bg-white p-10 rounded-xl shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-6 text-indigo-700">Enter the OTP</h2>
        <p className="text-sm text-gray-600 mb-6">
          We've sent a 6-digit OTP to <span className="font-medium">{maskedEmail}</span> verify your mail
        </p>

        <div className="flex justify-between mb-10">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Verify OTP
        </button>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Verify;

