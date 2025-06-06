// src/components/admin/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, BookOpen, Calendar, LogOut, FileText } from "lucide-react";
import AccountManagement from "./AccountManagement";
import CourseManagement from "./CourseManagement";
import AppointmentManagement from "./AppointmentManagement";
import RiskAssessmentManagement from "./RiskAssessmentManagement";

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("accounts");
  const navigate = useNavigate();

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    const sessionToken = sessionStorage.getItem("tempToken");

    if (localToken || sessionToken) {
      let userData;
      if (localToken) {
        userData = {
          userName: localStorage.getItem("userName"),
          email: localStorage.getItem("email"),
          expiresAt: localStorage.getItem("expiresAt"),
          roleId: localStorage.getItem("roleId"),
          roleName: localStorage.getItem("roleName"),
        };
      } else {
        userData = {
          userName: sessionStorage.getItem("userName"),
          email: sessionStorage.getItem("email"),
          expiresAt: sessionStorage.getItem("expiresAt"),
          roleId: sessionStorage.getItem("roleId"),
          roleName: sessionStorage.getItem("roleName"),
        };
      }

      console.log("User data loaded:", userData); // Log để debug

      const currentTime = new Date();
      const expirationTime = new Date(userData.expiresAt);
      console.log("Current time:", currentTime, "Expiration time:", expirationTime); // Log để debug

      if (currentTime > expirationTime) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login", { replace: true });
        return;
      }

      // Kiểm tra vai trò
      const roleId = userData.roleId;
      console.log("Role ID:", roleId); // Log để debug

      const roleRoutes = {
        1: "/",
        2: "/member-dashboard",
        3: "/staff-dashboard",
        4: "/consultant-dashboard",
        5: "/manager-dashboard",
      };

      // Nếu không phải Admin (roleId: 6), chuyển hướng đến trang tương ứng
      if (roleId !== "6") {
        const targetRoute = roleRoutes[roleId] || "/login";
        alert("Bạn không có quyền truy cập trang này!");
        navigate(targetRoute, { replace: true });
        return;
      }

      // Nếu là Admin, tiếp tục hiển thị trang
      setUserInfo(userData);
    } else {
      alert("Vui lòng đăng nhập để truy cập trang quản lý!");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  const menuItems = [
    { id: "accounts", label: "Quản lý tài khoản", icon: <Users className="w-5 h-5" /> },
    { id: "courses", label: "Quản lý khóa học", icon: <BookOpen className="w-5 h-5" /> },
    { id: "appointments", label: "Quản lý lịch hẹn", icon: <Calendar className="w-5 h-5" /> },
    { id: "assessments", label: "Quản lý đánh giá", icon: <FileText className="w-5 h-5" /> },
  ];

  // Hiển thị Dashboard chỉ khi userInfo đã được thiết lập
  if (!userInfo) {
    return <div>Loading...</div>; // Hiển thị loading để debug
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-sky-800 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
          <nav>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  activeTab === item.id
                    ? "bg-sky-700 text-white"
                    : "hover:bg-sky-700/50 text-gray-300"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-sky-900">
          {userInfo && (
            <div className="mb-4">
              <p className="text-sm text-gray-300">{userInfo.email}</p>
              <p className="text-xs text-gray-400">{userInfo.userName}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {activeTab === "accounts" && <AccountManagement />}
        {activeTab === "courses" && <CourseManagement />}
        {activeTab === "appointments" && <AppointmentManagement />}
        {activeTab === "assessments" && <RiskAssessmentManagement />}
      </div>
    </div>
  );
};

export default Dashboard;