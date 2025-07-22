"use client";

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
} from "chart.js";
import AccountManagement from "./AccountManagement";
import CourseManagement from "./CourseManagement";
import AppointmentManagement from "./AppointmentManagement";
import RiskAssessmentManagement from "./RiskAssessmentManagement";
import {
  Users,
  BookOpen,
  Calendar,
  LogOut,
  FileText,
  BarChart2,
  RefreshCw,
} from "lucide-react";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assessments, setAssessments] = useState({ totalAssessments: 0, scoreSummary: null });
  const navigate = useNavigate();

  const getToken = useCallback(() => {
    return localStorage.getItem("token") || sessionStorage.getItem("tempToken");
  }, []);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    const token = getToken();
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:7092/api/Admin/GetAllUsers", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, Accept: "*/*" },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      if (data.success) setUsers(data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
  }, [getToken, navigate]);

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    const token = getToken();
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:7092/api/Admin/GetAllAppointments", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, Accept: "*/*" },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      if (data.success) setAppointments(data.data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error.message);
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  }, [getToken, navigate]);

  // Fetch courses
  const fetchCourses = useCallback(async () => {
    const token = getToken();
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:7092/api/Course/GetAllCourse", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, Accept: "*/*" },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      if (data.success) setCourses(data.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error.message);
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  }, [getToken, navigate]);

  // Fetch assessments
  const fetchAssessments = useCallback(async () => {
    const token = getToken();
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    setLoading(true);
    try {
      // Fetch total assessments
      const totalResponse = await fetch("http://localhost:7092/api/AssessmentStatistics/total", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, Accept: "*/*" },
      });
      if (!totalResponse.ok) throw new Error(`HTTP error! Status: ${totalResponse.status}`);
      const totalData = await totalResponse.json();

      // Fetch score summary
      const summaryResponse = await fetch("http://localhost:7092/api/AssessmentStatistics/score-summary", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, Accept: "*/*" },
      });
      if (!summaryResponse.ok) throw new Error(`HTTP error! Status: ${summaryResponse.status}`);
      const summaryData = await summaryResponse.json();

      if (totalData.success && summaryData.success) {
        setAssessments({
          totalAssessments: totalData.totalAssessments || 0,
          scoreSummary: summaryData.data || null,
        });
      }
    } catch (error) {
      console.error("Error fetching assessments:", error.message);
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  }, [getToken, navigate]);

  // Fetch all data on mount and refresh every 30 seconds
  useEffect(() => {
    if (activeTab === "overview") {
      fetchUsers();
      fetchAppointments();
      fetchCourses();
      fetchAssessments();
      const interval = setInterval(() => {
        fetchUsers();
        fetchAppointments();
        fetchCourses();
        fetchAssessments();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [activeTab, fetchUsers, fetchAppointments, fetchCourses, fetchAssessments]);

  // Authentication check
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    const sessionToken = sessionStorage.getItem("tempToken");
    if (localToken || sessionToken) {
      let userData = localToken
        ? {
            userName: localStorage.getItem("userName") || "",
            email: localStorage.getItem("email") || "",
            expiresAt: localStorage.getItem("expiresAt") || new Date().toISOString(),
            roleId: localStorage.getItem("roleId") || "0",
            roleName: localStorage.getItem("roleName") || "",
          }
        : {
            userName: sessionStorage.getItem("userName") || "",
            email: sessionStorage.getItem("email") || "",
            expiresAt: sessionStorage.getItem("expiresAt") || new Date().toISOString(),
            roleId: sessionStorage.getItem("roleId") || "0",
            roleName: sessionStorage.getItem("roleName") || "",
          };
      const currentTime = new Date();
      const expirationTime = new Date(userData.expiresAt);
      if (currentTime > expirationTime) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login", { replace: true });
        return;
      }
      const roleId = userData.roleId;
      const roleRoutes = { 1: "/", 2: "/member-dashboard", 3: "/staff-dashboard", 4: "/consultant-dashboard", 5: "/manager-dashboard" };
      if (roleId !== "6" && activeTab !== "overview") {
        const targetRoute = roleRoutes[roleId] || "/login";
        alert("Bạn không có quyền truy cập trang này!");
        navigate(targetRoute, { replace: true });
        return;
      }
      setUserInfo(userData);
    } else {
      alert("Vui lòng đăng nhập để truy cập trang quản lý!");
      navigate("/login", { replace: true });
    }
  }, [navigate, activeTab]);

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

  const overviewChartData = {
    labels: ["Tài khoản", "Khóa học", "Lịch hẹn", "Đánh giá"],
    datasets: [
      {
        label: "Tổng số",
        data: [users.length, courses.length, appointments.length, assessments.totalAssessments],
        backgroundColor: ["rgba(99, 102, 241, 0.8)", "rgba(16, 185, 129, 0.8)", "rgba(245, 158, 11, 0.8)", "rgba(239, 68, 68, 0.8)"],
        borderWidth: 0,
      },
    ],
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-72 bg-white/95 backdrop-blur-sm border-r border-slate-200 shadow-xl">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <BarChart2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EduManage Pro</h2>
              <p className="text-xs text-slate-500 font-medium">Admin Dashboard</p>
            </div>
          </div>
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
                <div className={`p-1 rounded-lg ${activeTab === item.id ? "bg-white/20" : "bg-slate-100 group-hover:bg-slate-200"}`}>{item.icon}</div>
                <span className="font-medium">{item.label}</span>
                {activeTab === item.id && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>}
              </button>
            ))}
          </nav>
        </div>
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
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">Tổng quan hệ thống</h1>
                  <p className="text-slate-600 mt-2 font-medium">Theo dõi và quản lý toàn bộ hoạt động</p>
                  {lastUpdated && (
                    <p className="text-xs text-slate-500 mt-1">Cập nhật lần cuối: {lastUpdated.toLocaleTimeString("vi-VN")}</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    fetchUsers();
                    fetchAppointments();
                    fetchCourses();
                    fetchAssessments();
                  }}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  <span>Làm mới</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">{users.length}</div>
                    <div className="text-xs text-slate-500 font-medium">Tổng tài khoản</div>
                  </div>
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <span>Đang hoạt động</span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">{courses.length}</div>
                    <div className="text-xs text-slate-500 font-medium">Tổng khóa học</div>
                  </div>
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <span>{courses.filter(c => !c.courseRegistrations.length).length} hoàn thành</span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">{appointments.length}</div>
                    <div className="text-xs text-slate-500 font-medium">Tổng lịch hẹn</div>
                  </div>
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <span>{appointments.filter(a => a.status === "CONFIRMED").length} đã xác nhận</span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">{assessments.totalAssessments}</div>
                    <div className="text-xs text-slate-500 font-medium">Đánh giá rủi ro</div>
                  </div>
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <span>Đã phân tích</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Phân bố tài khoản theo vai trò</h3>
                </div>
                <div className="h-80 flex items-center justify-center">
                  {loading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  ) : (
                    <Pie
                      data={{
                        labels: ["Admin", "Member", "Consultant", "Staff", "Manager"],
                        datasets: [
                          {
                            label: "Số lượng",
                            data: [
                              users.filter(u => u.roleName === "Admin").length,
                              users.filter(u => u.roleName === "Member").length,
                              users.filter(u => u.roleName === "Consultant").length,
                              users.filter(u => u.roleName === "Staff").length,
                              users.filter(u => u.roleName === "Manager").length,
                            ],
                            backgroundColor: [
                              "rgba(99, 102, 241, 0.8)",
                              "rgba(16, 185, 129, 0.8)",
                              "rgba(245, 158, 11, 0.8)",
                              "rgba(239, 68, 68, 0.8)",
                              "rgba(100, 116, 139, 0.8)",
                            ],
                            borderWidth: 0,
                          },
                        ],
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Trạng thái lịch hẹn</h3>
                </div>
                <div className="h-80 flex items-center justify-center">
                  {loading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  ) : (
                    <Bar
                      data={{
                        labels: ["Confirmed", "Pending", "Canceled"],
                        datasets: [
                          {
                            label: "Số lượng",
                            data: [
                              appointments.filter(a => a.status === "CONFIRMED").length,
                              appointments.filter(a => a.status === "PENDING_PAYMENT").length,
                              appointments.filter(a => a.status === "CANCELED").length,
                            ],
                            backgroundColor: ["rgba(16, 185, 129, 0.8)", "rgba(245, 158, 11, 0.8)", "rgba(239, 68, 68, 0.8)"],
                            borderWidth: 0,
                          },
                        ],
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Tóm tắt điểm đánh giá rủi ro</h3>
                </div>
                <div className="h-80 flex items-center justify-center">
                  {loading || !assessments.scoreSummary ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  ) : (
                    <Bar
                      data={{
                        labels: ["Điểm trung bình", "Điểm tối đa", "Điểm tối thiểu"],
                        datasets: [
                          {
                            label: ["Điểm",],
                            data: [
                              assessments.scoreSummary.averageScore,
                              assessments.scoreSummary.maxScore,
                              assessments.scoreSummary.minScore,
                            ],
                            backgroundColor: ["rgba(99, 102, 241, 0.8)", "rgba(16, 185, 129, 0.8)", "rgba(239, 68, 68, 0.8)"],
                            borderWidth: 0,
                          },
                        ],
                      }}
                      options={{
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 10,
                          },
                        },
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* User Table */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Danh sách người dùng</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-700">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">Tên đăng nhập</th>
                      <th className="px-4 py-2">Họ tên</th>
                      <th className="px-4 py-2">Vai trò</th>
                      <th className="px-4 py-2">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 5).map((user) => (
                      <tr key={user.userID} className="border-t">
                        <td className="px-4 py-2">{user.userID}</td>
                        <td className="px-4 py-2">{user.userName}</td>
                        <td className="px-4 py-2">{user.fullName}</td>
                        <td className="px-4 py-2">{user.roleName}</td>
                        <td className="px-4 py-2">{user.status || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Appointment Table */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Danh sách lịch hẹn</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-700">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">Người dùng</th>
                      <th className="px-4 py-2">Tư vấn viên</th>
                      <th className="px-4 py-2">Thời gian bắt đầu</th>
                      <th className="px-4 py-2">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.slice(0, 5).map((appt) => (
                      <tr key={appt.appointmentID} className="border-t">
                        <td className="px-4 py-2">{appt.appointmentID}</td>
                        <td className="px-4 py-2">{appt.userName}</td>
                        <td className="px-4 py-2">{appt.consultantName}</td>
                        <td className="px-4 py-2">{new Date(appt.startDateTime).toLocaleString("vi-VN")}</td>
                        <td className="px-4 py-2">{appt.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "accounts" && <AccountManagement />}
        {activeTab === "courses" && <CourseManagement />}
        {activeTab === "appointments" && <AppointmentManagement />}
        {activeTab === "assessments" && <RiskAssessmentManagement assessments={assessments} />}
      </div>
    </div>
  );
};

export default Dashboard;