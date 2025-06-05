"use client";

import { useState, useCallback, useEffect } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expiresAt");
    const roleId = localStorage.getItem("roleId");
    if (localToken && expiresAt && new Date(expiresAt) > new Date()) {
      const targetRoute = getRouteByRole(roleId);
      navigate(targetRoute, { replace: true });
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

  const mapRoleToRoleId = (role) => {
    const roleMap = {
      "Guest": 1,
      "Member": 2,
      "Staff": 3,
      "Consultant": 4,
      "Manager": 5,
      "Admin": 6,
    };
    return roleMap[role] || 2;
  };

  const getRouteByRole = (roleId) => {
    const roleRoutes = {
      2: "/member-dashboard",
      3: "/staff-dashboard",
      4: "/consultant-dashboard",
      5: "/manager-dashboard",
      6: "/dashboard",
    };
    if (roleId === "1") return "/";
    return roleRoutes[roleId] || "/";
  };

  const saveUserData = (userData, storage = localStorage) => {
    const { token, userName, email, expiresAt, roleId, roleName, userId } = userData;
    storage.setItem("token", token);
    storage.setItem("userName", userName);
    storage.setItem("email", email);
    storage.setItem("expiresAt", expiresAt);
    storage.setItem("roleId", roleId?.toString());
    storage.setItem("roleName", roleName);
    storage.setItem("userId", userId?.toString());
  };

  const clearUserData = (storage = localStorage) => {
    storage.removeItem("token");
    storage.removeItem("userName");
    storage.removeItem("email");
    storage.removeItem("expiresAt");
    storage.removeItem("roleId");
    storage.removeItem("roleName");
    storage.removeItem("userId");
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
      const response = await axios.post("https://localhost:7092/api/Auth/login", loginData, {
        headers: { "Content-Type": "application/json" },
      });

      const { token, userName, email, expiresAt, role, userId } = response.data;
      if (!token) {
        setErrors((prev) => ({
          ...prev,
          api: "Không nhận được token từ server. Vui lòng thử lại!",
        }));
        return;
      }

      const userRoleId = mapRoleToRoleId(role);
      const userRoleName = role || "Member";
      const userData = { token, userName, email, expiresAt, roleId: userRoleId, roleName: userRoleName, userId };

      clearUserData(localStorage);
      saveUserData(userData, localStorage);

      const targetRoute = getRouteByRole(userRoleId);
      setSuccessMessage(`Đăng nhập thành công với quyền ${userRoleName}! 🎉 Đang chuyển hướng...`);

      setTimeout(() => {
        navigate(targetRoute, { replace: true });
      }, 2000);
    } catch (error) {
      let errorMessage = "Đăng nhập thất bại. Vui lòng thử lại!";
      if (error.code === "ERR_NETWORK") {
        errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!";
      } else if (error.code === "ERR_CERT_AUTHORITY_INVALID") {
        errorMessage = "Lỗi chứng chỉ SSL. Vui lòng liên hệ quản trị viên!";
      } else if (error.response?.status === 401) {
        errorMessage = "Email/tên đăng nhập hoặc mật khẩu không chính xác!";
      } else if (error.response?.status === 403) {
        errorMessage = "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên!";
      } else if (error.response?.status === 500) {
        errorMessage = "Lỗi server nội bộ. Vui lòng thử lại sau!";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setErrors((prev) => ({
        ...prev,
        api: errorMessage,
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
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-3 focus:ring-blue-500/10 transition-all duration-300 group-hover:-translate-y-1 ${
                      errors.email ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
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
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-3 focus:ring-blue-500/10 transition-all duration-300 group-hover:-translate-y-1 ${
                      errors.password ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
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

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 mb-4"
              >
                Đăng nhập
              </button>

              <div className="text-center mb-6">
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Quên mật khẩu?
                </a>
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
// This code is a React component for a Sign In page with enhanced user experience features.