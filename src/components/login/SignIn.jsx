"use client";

import { useState, useCallback, useEffect } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const demoAccounts = {
  demo_guest: { role: "Guest", roleId: 1 },
  demo_member: { role: "Member", roleId: 2 },
  demo_staff: { role: "Staff", roleId: 3 },
  demo_consult: { role: "Consultant", roleId: 4 },
  demo_manager: { role: "Manager", roleId: 5 },
  demo_admin: { role: "Admin", roleId: 6 },
};

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [useDemo, setUseDemo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expiresAt");
    const roleId = localStorage.getItem("roleId");
    if (token && expiresAt && new Date(expiresAt) > new Date()) {
      navigate(getRouteByRole(Number(roleId)), { replace: true });
    }
  }, [navigate]);

  const handleEmailChange = useCallback((e) => {
    setLoginEmail(e.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
  }, [errors.email]);

  const handlePasswordChange = useCallback((e) => {
    setLoginPassword(e.target.value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
  }, [errors.password]);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleDemoMode = () => {
    setUseDemo(!useDemo);
    setErrors({});
    setSuccessMessage("");
  };

  const getRouteByRole = (roleId) => {
    const routes = {
      1: "/",
      2: "/member-dashboard",
      3: "/staff-dashboard",
      4: "/consultant-dashboard",
      5: "/manager-dashboard",
      6: "/dashboard",
    };
    return routes[roleId] || "/";
  };

  const validateForm = () => {
    const newErrors = {};
    if (!loginEmail.trim()) newErrors.email = "Vui lòng nhập tài khoản";
    if (!loginPassword.trim()) newErrors.password = "Vui lòng nhập mật khẩu";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveUserData = ({ token, userName, email, expiresAt, roleId, roleName, userId }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userName", userName);
    localStorage.setItem("email", email);
    localStorage.setItem("expiresAt", expiresAt);
    localStorage.setItem("roleId", String(roleId));
    localStorage.setItem("roleName", roleName);
    localStorage.setItem("userId", String(userId));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setErrors((prev) => ({ ...prev, api: "Vui lòng kiểm tra lại thông tin!" }));
      return;
    }

    if (useDemo && demoAccounts[loginEmail] && loginPassword === "123456") {
      const demo = demoAccounts[loginEmail];
      const fakeData = {
        token: "demo-token",
        userName: loginEmail,
        email: `${loginEmail}@demo.com`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        roleId: demo.roleId,
        roleName: demo.role,
        userId: 999,
      };
      saveUserData(fakeData);
      setSuccessMessage(`Đăng nhập demo với quyền ${demo.role}!`);
      setTimeout(() => navigate(getRouteByRole(demo.roleId), { replace: true }), 1200);
      return;
    }

    try {
      const res = await axios.post("https://localhost:7092/api/Auth/login", {
        userName: loginEmail,
        password: loginPassword,
      });

      const { token, userName, email, expiresAt, role, userId } = res.data;
      const roleMap = {
        Guest: 1,
        Member: 2,
        Staff: 3,
        Consultant: 4,
        Manager: 5,
        Admin: 6,
      };
      const roleId = roleMap[role] || 2;

      saveUserData({ token, userName, email, expiresAt, roleId, roleName: role, userId });
      setSuccessMessage(`Đăng nhập thành công với quyền ${role}`);
      setTimeout(() => navigate(getRouteByRole(roleId), { replace: true }), 1500);
    } catch (error) {
      let message = "Đăng nhập thất bại.";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      setErrors((prev) => ({ ...prev, api: message }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleSelectDemo = (account) => {
    setLoginEmail(account);
    setLoginPassword("123456");
    setUseDemo(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-cyan-400 to-green-400">
      <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Đăng nhập</h2>

        {successMessage && <p className="text-green-600 text-sm mb-4">{successMessage}</p>}
        {errors.api && <p className="text-red-600 text-sm mb-4">{errors.api}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
          <div className="relative">
            <User className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={loginEmail}
              onChange={handleEmailChange}
              onKeyDown={handleKeyDown}
              placeholder="demo_admin, demo_member, ..."
              className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Mật khẩu</label>
          <div className="relative">
            <Lock className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={loginPassword}
              onChange={handlePasswordChange}
              onKeyDown={handleKeyDown}
              placeholder="123456"
              className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button type="button" onClick={togglePasswordVisibility}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="mb-4 flex items-center space-x-2">
          <input type="checkbox" checked={useDemo} onChange={toggleDemoMode} />
          <label className="text-sm">Sử dụng tài khoản demo (bỏ qua API)</label>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
          Đăng nhập
        </button>

        {useDemo && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">🧪 Tài khoản demo có sẵn:</h3>
            <ul className="space-y-1">
              {Object.entries(demoAccounts).map(([username, info]) => (
                <li key={username}>
                  <button
                    onClick={() => handleSelectDemo(username)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {username} / 123456 ({info.role})
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
