"use client"

import { useState, useCallback, useEffect } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    const sessionToken = sessionStorage.getItem("tempToken");
    if (localToken || sessionToken) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleEmailChange = useCallback(
    (e) => {
      setLoginEmail(e.target.value);
      if (errors.email) {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    },
    [errors.email]
  );

  const handlePasswordChange = useCallback(
    (e) => {
      setLoginPassword(e.target.value);
      if (errors.password) {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    },
    [errors.password]
  );

  const handleRememberChange = useCallback((e) => {
    setRememberMe(e.target.checked);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!loginEmail.trim()) {
      newErrors.email = "Vui lòng nhập email hoặc tên đăng nhập";
    }

    if (!loginPassword.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setErrors((prev) => ({
        ...prev,
        api: "Vui lòng kiểm tra lại thông tin!",
      }));
      return;
    }

    const loginData = {
      userName: loginEmail,
      password: loginPassword,
    };

    try {
      console.log("Sending login request with data:", loginData);
      const response = await axios.post("https://localhost:7092/api/Auth/login", loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Full response:", response);

      const { token, userName, email, expiresAt } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userName", userName);
      localStorage.setItem("email", email);
      localStorage.setItem("expiresAt", expiresAt);

      if (!rememberMe) {
        sessionStorage.setItem("tempToken", token);
        sessionStorage.setItem("userName", userName);
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("expiresAt", expiresAt);

        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("email");
        localStorage.removeItem("expiresAt");
      }

      setSuccessMessage("Đăng nhập thành công! 🎉 Đang chuyển hướng...");
      console.log("Login response:", response.data);
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 2000);
    } catch (error) {
      console.log("Error details:", {
        message: error.message,
        response: error.response,
        status: error.response?.status,
      });
      setErrors((prev) => ({
        ...prev,
        api: error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại!",
      }));
    }
  };

  const BackToHomeButton = () => (
    <button
      type="button"
      onClick={() => navigate("/")}
      className="fixed top-8 left-8 z-50 group flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-xl border border-white/30 rounded-full hover:bg-white hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 animate-slide-in-left"
    >
      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full group-hover:rotate-[-5deg] transition-transform duration-300">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </div>
      <span className="text-gray-700 font-semibold text-sm group-hover:text-blue-600 transition-colors duration-300">
        Quay lại trang chủ
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-400 to-green-400 relative overflow-hidden">
      <BackToHomeButton />
      <div className="flex min-h-screen pt-20">
        <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white/10 backdrop-blur-sm">
          <div className="w-72 h-72 mb-8 relative animate-pulse-slow">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-blue-600 rounded-full opacity-20"></div>
            <div className="absolute inset-1/4 bg-white/80 rotate-45 rounded-lg"></div>
            <div className="absolute top-1/4 left-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-cyan-400 rounded-full"></div>
            <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-green-400 rounded-full"></div>
            <div className="absolute bottom-1/4 left-1/2 w-4 h-4 bg-orange-500 rounded-full transform -translate-x-1/2"></div>
          </div>
          <div className="text-center text-white max-w-md">
            <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">Đăng nhập ngay</h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Đăng nhập để tham gia cộng đồng PreventionSupport và cùng nhau hỗ trợ phòng chống ma túy.
            </p>
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center p-8">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-blue-600 text-center mb-2">Đăng nhập</h2>
              <p className="text-gray-600 text-center mb-8 text-sm">
                Chào mừng bạn! Vui lòng đăng nhập vào tài khoản.
              </p>

              {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
              {errors.api && <p className="text-red-500 text-center mb-4">{errors.api}</p>}

              <div className="mb-6 group">
                <label className="block text-gray-700 font-medium text-sm mb-2">
                  Email hoặc Tên đăng nhập <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={handleEmailChange}
                    placeholder="Nhập email hoặc tên đăng nhập"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm
                               focus:outline-none focus:ring-3 focus:ring-blue-500/10
                               transition-all duration-300 group-hover:-translate-y-1 ${
                                 errors.email
                                   ? "border-red-500 focus:border-red-500"
                                   : "border-gray-200 focus:border-blue-500"
                               }`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div className="mb-6 group">
                <label className="block text-gray-700 font-medium text-sm mb-2">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu"
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm
                               focus:outline-none focus:ring-3 focus:ring-blue-500/10
                               transition-all duration-300 group-hover:-translate-y-1 ${
                                 errors.password
                                   ? "border-red-500 focus:border-red-500"
                                   : "border-gray-200 focus:border-blue-500"
                               }`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
              </div>

              <div className="flex items-center gap-3 mb-6">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={handleRememberChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:outline-none border-gray-200"
                />
                <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold
                           hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 mb-4"
              >
                Đăng nhập
              </button>

              <div className="text-center mb-6">
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Quên mật khẩu?
                </a>
              </div>

              <div className="text-center text-gray-600 text-sm mb-6">
                Hoặc đăng nhập với
                <div className="flex justify-center gap-3 mt-2">
                  <button className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-300">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </button>
                  <button className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-300">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                </div>
              </div>

              <p className="text-center text-gray-600 text-sm">
                Chưa có tài khoản?{" "}
                <button onClick={() => navigate("/register")} className="text-blue-600 hover:underline font-medium">
                  Đăng ký ngay
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;