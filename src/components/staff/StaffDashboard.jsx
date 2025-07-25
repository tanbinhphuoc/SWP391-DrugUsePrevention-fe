"use client";

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Users, BookOpen, Calendar, LogOut, FileText, BarChart2, Megaphone } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StaffOverview from "./StaffOverview";
import StaffAccountManagement from "./StaffAccountManagement";
import StaffCourseManagement from "./StaffCourseManagement";
import StaffAppointmentManagement from "./StaffAppointmentManagement";
import StaffAssessmentManagement from "./StaffAssessmentManagement";
import StaffCampaignManagement from "./StaffCampaignManagement";
import StaffBlogManagement from "./StaffBlogManagement"; // Import component mới

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const getToken = useCallback(() => {
    return localStorage.getItem("token") || sessionStorage.getItem("tempToken");
  }, []);

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    const sessionToken = sessionStorage.getItem("tempToken");

    if (localToken || sessionToken) {
      let userData;
      if (localToken) {
        userData = {
          userName: localStorage.getItem("userName") || "",
          email: localStorage.getItem("email") || "",
          expiresAt: localStorage.getItem("expiresAt") || new Date().toISOString(),
          roleId: localStorage.getItem("roleId") || "0",
          roleName: localStorage.getItem("roleName") || "",
        };
      } else {
        userData = {
          userName: sessionStorage.getItem("userName") || "",
          email: sessionStorage.getItem("email") || "",
          expiresAt: sessionStorage.getItem("expiresAt") || new Date().toISOString(),
          roleId: sessionStorage.getItem("roleId") || "0",
          roleName: sessionStorage.getItem("roleName") || "",
        };
      }

      const currentTime = new Date();
      const expirationTime = new Date(userData.expiresAt);

      if (currentTime > expirationTime) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login", { replace: true });
        return;
      }

      const roleId = userData.roleId;
      const roleRoutes = {
        1: "/",
        2: "/member-dashboard",
        3: "/staff-dashboard",
        4: "/consultant-dashboard",
        5: "/manager-dashboard",
        6: "/dashboard",
      };

      if (roleId !== "3") {
        const targetRoute = roleRoutes[roleId] || "/login";
        toast.error("Bạn không có quyền truy cập trang này!");
        navigate(targetRoute, { replace: true });
        return;
      }

      setUserInfo(userData);
    } else {
      toast.error("Vui lòng đăng nhập để truy cập trang quản lý!");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  const menuItems = [
    { id: "overview", label: "Tổng quan", icon: <BarChart2 className="h-5 w-5" /> },
    { id: "accounts", label: "Quản lý tài khoản", icon: <Users className="h-5 w-5" /> },
    { id: "courses", label: "Quản lý khóa học", icon: <BookOpen className="h-5 w-5" /> },
    { id: "appointments", label: "Quản lý lịch hẹn", icon: <Calendar className="h-5 w-5" /> },
    { id: "assessments", label: "Đánh giá rủi ro", icon: <FileText className="h-5 w-5" /> },
    { id: "blogs", label: "Quản lý Blogs", icon: <FileText className="h-5 w-5" /> }
  ];

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <ToastContainer position="top-right" autoClose={3000} />
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 w-72 bg-white/95 backdrop-blur-sm border-r border-slate-200 shadow-xl flex flex-col">
          {/* Header - Fixed */}
          <div className="p-6 flex-shrink-0">
            <div className="flex items-center space-x-3 mb-8">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <BarChart2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EduManage Pro
                </h2>
                <p className="text-xs text-slate-500 font-medium">Staff Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                  <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                          activeTab === item.id
                              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]"
                              : "hover:bg-slate-100 text-slate-600 hover:text-slate-900 hover:transform hover:scale-[1.01]"
                      }`}
                  >
                    <div
                        className={`p-1 rounded-lg ${
                            activeTab === item.id ? "bg-white/20" : "bg-slate-100 group-hover:bg-slate-200"
                        }`}
                    >
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                    {activeTab === item.id && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                  </button>
              ))}
            </nav>
          </div>

          {/* Footer - Fixed */}
          <div className="flex-shrink-0 p-6 bg-gradient-to-t from-slate-100/80 to-transparent backdrop-blur-sm border-t border-slate-200">
            {userInfo && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                      {userInfo.userName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{userInfo.userName}</p>
                      <p className="text-xs text-slate-500 truncate">{userInfo.email}</p>
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                    <span className="font-medium">Role:</span> {userInfo.roleName}
                  </div>
                </div>
            )}
            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-72 p-8">
          {activeTab === "overview" && <StaffOverview />}
          {activeTab === "accounts" && <StaffAccountManagement />}
          {activeTab === "courses" && <StaffCourseManagement />}
          {activeTab === "appointments" && <StaffAppointmentManagement />}
          {activeTab === "assessments" && <StaffAssessmentManagement />}
          {activeTab === "blogs" && <StaffBlogManagement />}
        </div>
      </div>
  );
};

export default StaffDashboard;
