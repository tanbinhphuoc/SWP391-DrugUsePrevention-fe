"use client";

import { useState, useCallback, useEffect } from "react";
import { User, Lock, Eye, EyeOff, TestTube2 } from "lucide-react";
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

    // Logic này vẫn chính xác: Chỉ khi có token và chưa hết hạn thì mới chuyển hướng.
    // Nếu không có token (là Guest), hook này sẽ không làm gì cả, cho phép người dùng ở lại trang SignIn.
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
    if (!useDemo) { // Khi bật chế độ demo, tự động điền tài khoản đầu tiên
      setLoginEmail("demo_admin");
      setLoginPassword("123456");
    } else {
      setLoginEmail("");
      setLoginPassword("");
    }
  };

const getRouteByRole = (roleId) => {
   const routes = {
// 1: "/", // Không cần dòng này nữa
 2: "/member-dashboard",
3: "/staff-dashboard",
4: "/consultant-dashboard",
 5: "/manager-dashboard",
 6: "/dashboard",
 };
 return routes[roleId] || "/"; // Nếu không có roleId khớp, trả về trang chủ
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
        Guest: 1, Member: 2, Staff: 3, Consultant: 4, Manager: 5, Admin: 6,
      };
      const roleId = roleMap[role] || 2;

      saveUserData({ token, userName, email, expiresAt, roleId, roleName: role, userId });
      setSuccessMessage(`Đăng nhập thành công với quyền ${role}`);
      setTimeout(() => navigate(getRouteByRole(roleId), { replace: true }), 1500);
    } catch (error) {
      let message = "Đăng nhập thất bại. Vui lòng kiểm tra tài khoản và mật khẩu.";
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
  };
  
  // === PHẦN GIAO DIỆN ĐƯỢC THIẾT KẾ LẠI ===
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Chào mừng trở lại!
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Đăng nhập để tiếp tục
          </p>

          {successMessage && <p className="text-green-600 text-sm mb-4 text-center bg-green-50 p-3 rounded-lg">{successMessage}</p>}
          {errors.api && <p className="text-red-600 text-sm mb-4 text-center bg-red-50 p-3 rounded-lg">{errors.api}</p>}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Tên đăng nhập</label>
              <div className="relative">
                <User className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={loginEmail}
                  onChange={handleEmailChange}
                  onKeyDown={handleKeyDown}
                  placeholder={useDemo ? "chọn tài khoản demo bên dưới" : "Nhập tài khoản"}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={handlePasswordChange}
                  onKeyDown={handleKeyDown}
                  placeholder={useDemo ? "Mật khẩu là: 123456" : "••••••••"}
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                />
                <button type="button" onClick={togglePasswordVisibility} className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between mt-8 mb-6">
            <label htmlFor="demo-toggle" className="flex items-center cursor-pointer">
              <div className="relative">
                <input id="demo-toggle" type="checkbox" className="sr-only" checked={useDemo} onChange={toggleDemoMode} />
                <div className={`block w-12 h-6 rounded-full transition ${useDemo ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${useDemo ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <div className="ml-3 text-sm text-gray-600">
                Chế độ Demo
              </div>
            </label>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-95"
          >
            Đăng nhập
          </button>

          {useDemo && (
            <div className="mt-8 border-t-2 border-dashed pt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center justify-center">
                <TestTube2 className="w-5 h-5 mr-2 text-blue-500" />
                Chọn một tài khoản demo
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(demoAccounts).map(([username, info]) => (
                  <button
                    key={username}
                    onClick={() => handleSelectDemo(username)}
                    className={`p-2 text-sm rounded-md transition-all border-2 ${loginEmail === username ? 'bg-blue-500 text-white border-blue-500 font-semibold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:border-gray-300 border-transparent'}`}
                  >
                    {info.role}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          &copy; 2025 Your Company. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SignIn;