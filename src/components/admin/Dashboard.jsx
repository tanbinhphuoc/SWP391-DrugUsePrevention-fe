"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Filler,
} from "chart.js";
import AccountManagement from "./AccountManagement";
import CourseManagement from "./CourseManagement";
import AppointmentManagement from "./AppointmentManagement";
import RiskAssessmentManagement from "./RiskAssessmentManagement";
import { Users, BookOpen, Calendar, LogOut, FileText, BarChart2, TrendingUp } from "lucide-react";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Filler);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userInfo, setUserInfo] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    accountStats: { Admin: 0, Student: 0, Teacher: 0 },
    courseStats: { Total: 0, Completed: 0 },
    appointmentStats: [],
    riskAssessmentStats: [],
  });
  const navigate = useNavigate();

  // Fetch data from API
  const fetchDashboardData = async (token) => {
    try {
      // Fetch account stats
      const accountResponse = await fetch("https://b6f1-123-20-88-171.ngrok-free.app/api/Auth/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!accountResponse.ok) throw new Error("Failed to fetch account data.");
      const accounts = await accountResponse.json();
      const stats = accounts.reduce(
        (acc, user) => {
          acc[user.roleName] = (acc[user.roleName] || 0) + 1;
          return acc;
        },
        { Admin: 0, Student: 0, Teacher: 0 }
      );

      // Fetch course stats
      const courseResponse = await fetch("https://b6f1-123-20-88-171.ngrok-free.app/api/Course/GetAllCourse", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!courseResponse.ok) throw new Error("Failed to fetch course data.");
      const courses = await courseResponse.json();
      const courseStats = {
        Total: courses.length,
        Completed: courses.filter((c) => c.status === "COMPLETED").length,
      };

      // Mock appointment and risk assessment data (replace with real API when available)
      const appointmentResponse = await fetch("https://b6f1-123-20-88-171.ngrok-free.app/api/Appointment/GetAll", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const appointments = await appointmentResponse.json();
      const appointmentStats = [
        { type: "Consultation", count: appointments.filter((a) => a.type === "Consultation").length },
        { type: "Tutoring", count: appointments.filter((a) => a.type === "Tutoring").length },
        { type: "Workshop", count: appointments.filter((a) => a.type === "Workshop").length },
      ];

      const riskResponse = await fetch("https://b6f1-123-20-88-171.ngrok-free.app/api/Assessment/GetAllAssessment", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const riskAssessments = await riskResponse.json();
      const riskAssessmentStats = [
        { level: "High", count: riskAssessments.filter((r) => r.level === "High").length },
        { level: "Medium", count: riskAssessments.filter((r) => r.level === "Medium").length },
        { level: "Low", count: riskAssessments.filter((r) => r.level === "Low").length },
      ];

      setDashboardData({
        accountStats: stats,
        courseStats,
        appointmentStats,
        riskAssessmentStats,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

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

      console.log("User data loaded:", userData);

      const currentTime = new Date();
      const expirationTime = new Date(userData.expiresAt);
      console.log("Current time:", currentTime, "Expiration time:", expirationTime);

      if (currentTime > expirationTime) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login", { replace: true });
        return;
      }

      const roleId = userData.roleId;
      console.log("Role ID:", roleId);

      const roleRoutes = {
        1: "/",
        2: "/member-dashboard",
        3: "/staff-dashboard",
        4: "/consultant-dashboard",
        5: "/manager-dashboard",
      };

      if (roleId !== "6") {
        const targetRoute = roleRoutes[roleId] || "/login";
        alert("Bạn không có quyền truy cập trang này!");
        navigate(targetRoute, { replace: true });
        return;
      }

      setUserInfo(userData);
      fetchDashboardData(localToken || sessionToken); // Fetch data with token
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
    { id: "overview", label: "Tổng quan", icon: <BarChart2 className="h-5 w-5" /> },
    { id: "accounts", label: "Quản lý tài khoản", icon: <Users className="h-5 w-5" /> },
    { id: "courses", label: "Quản lý khóa học", icon: <BookOpen className="h-5 w-5" /> },
    { id: "appointments", label: "Quản lý lịch hẹn", icon: <Calendar className="h-5 w-5" /> },
    { id: "assessments", label: "Đánh giá rủi ro", icon: <FileText className="h-5 w-5" /> },
  ];

  const accountChartData = {
    labels: Object.keys(dashboardData.accountStats),
    datasets: [
      {
        label: "Số lượng tài khoản",
        data: Object.values(dashboardData.accountStats),
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"],
        borderWidth: 0,
      },
    ],
  };

  const riskAssessmentChartData = {
    labels: dashboardData.riskAssessmentStats.map((item) => item.level),
    datasets: [
      {
        label: "Số lượng đánh giá",
        data: dashboardData.riskAssessmentStats.map((item) => item.count),
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(255, 159, 64, 0.6)", "rgba(255, 205, 86, 0.6)"],
        borderWidth: 0,
      },
    ],
  };

  const courseChartData = {
    labels: ["Tổng", "Hoàn thành"],
    datasets: [
      {
        label: "Số lượng khóa học",
        data: [dashboardData.courseStats.Total, dashboardData.courseStats.Completed],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(54, 162, 235, 0.6)"],
        borderWidth: 0,
      },
    ],
  };

  const appointmentChartData = {
    labels: dashboardData.appointmentStats.map((item) => item.type),
    datasets: [
      {
        label: "Số lượng lịch hẹn",
        data: dashboardData.appointmentStats.map((item) => item.count),
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        tension: 0.4,
      },
    ],
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Sidebar */}
      <div className="fixed inset-y-0 left-0 w-72 bg-white/95 backdrop-blur-sm border-r border-slate-200 shadow-xl">
        <div className="p-6">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <BarChart2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduManage Pro
              </h2>
              <p className="text-xs text-slate-500 font-medium">Admin Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
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

        {/* Enhanced User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-100/80 to-transparent backdrop-blur-sm border-t border-slate-200">
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
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    Tổng quan hệ thống
                  </h1>
                  <p className="text-slate-600 mt-2 font-medium">Theo dõi và quản lý toàn bộ hoạt động của hệ thống</p>
                </div>
                <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Hệ thống hoạt động tốt</span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Accounts Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-[1.02] group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-blue-500/25">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">
                      {Object.values(dashboardData.accountStats).reduce((a, b) => a + b, 0)}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Tổng tài khoản</div>
                  </div>
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12.5% so với tháng trước
                </div>
              </div>

              {/* Total Courses Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-[1.02] group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg group-hover:shadow-green-500/25">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">{dashboardData.courseStats.Total}</div>
                    <div className="text-xs text-slate-500 font-medium">Tổng khóa học</div>
                  </div>
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8.3% hoàn thành
                </div>
              </div>

              {/* Total Appointments Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-[1.02] group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-purple-500/25">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">
                      {dashboardData.appointmentStats.reduce((sum, item) => sum + item.count, 0)}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Tổng lịch hẹn</div>
                  </div>
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +15.2% tháng này
                </div>
              </div>

              {/* Risk Assessments Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-[1.02] group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:shadow-orange-500/25">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">
                      {dashboardData.riskAssessmentStats.reduce((sum, item) => sum + item.count, 0)}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Đánh giá rủi ro</div>
                  </div>
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +5.7% đã hoàn thành
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Account Management Chart */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Phân bố tài khoản</h3>
                    <p className="text-sm text-slate-600">Thống kê loại người dùng</p>
                  </div>
                </div>
                <div className="h-80 flex items-center justify-center">
                  <Pie
                    data={accountChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: { size: 12, weight: "500" },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Risk Assessment Chart */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Đánh giá rủi ro</h3>
                    <p className="text-sm text-slate-600">Phân tích mức độ rủi ro</p>
                  </div>
                </div>
                <div className="h-80 flex items-center justify-center">
                  <Bar
                    data={riskAssessmentChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: { color: "rgba(0,0,0,0.1)" },
                        },
                        x: {
                          grid: { display: false },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Course Management Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Quản lý khóa học</h3>
                  <p className="text-sm text-slate-600">Thống kê trạng thái khóa học</p>
                </div>
              </div>
              <div className="h-80">
                <Bar
                  data={courseChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: { color: "rgba(0,0,0,0.1)" },
                      },
                      x: {
                        grid: { display: false },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Appointment Management Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Xu hướng lịch hẹn</h3>
                  <p className="text-sm text-slate-600">Thống kê lịch hẹn theo thời gian</p>
                </div>
              </div>
              <div className="h-80">
                <Line
                  data={appointmentChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                        labels: {
                          usePointStyle: true,
                          font: { weight: "500" },
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: { color: "rgba(0,0,0,0.1)" },
                      },
                      x: {
                        grid: { display: false },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Other tabs content */}
        {activeTab === "accounts" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <AccountManagement />
          </div>
        )}
        {activeTab === "courses" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <CourseManagement />
          </div>
        )}
        {activeTab === "appointments" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <AppointmentManagement />
          </div>
        )}
        {activeTab === "assessments" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <RiskAssessmentManagement />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;