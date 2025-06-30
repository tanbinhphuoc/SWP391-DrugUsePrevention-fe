import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  BookOpen, 
  ClipboardList, 
  Calendar, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  ChevronRight,
  Bell,
  Search,
  User,
  Shield,
  Sun,
  Moon
} from "lucide-react";
import StaffOverview from "./StaffOverview";
import UserManagement from "./UserManagement";
import CourseManagement from "./CourseManagement";
import SurveyManagement from "./SurveyManagement";
import ProgramManagement from "./ProgramManagement";
import AppointmentSupport from "./AppointmentSupport";

const StaffDashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }

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
      const roleRoutes = {
        1: "/",
        2: "/member-dashboard",
        4: "/consultant-dashboard",
        5: "/manager-dashboard",
        6: "/dashboard",
      };

      if (roleId !== "3") {
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
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const menuItems = [
    { id: "overview", label: "Tổng quan", icon: <BarChart3 className="w-5 h-5" />, description: "Xem thống kê tổng quan" },
    { id: "users", label: "Quản lý người dùng", icon: <Users className="w-5 h-5" />, description: "Quản lý tài khoản người dùng" },
    { id: "courses", label: "Quản lý khóa học", icon: <BookOpen className="w-5 h-5" />, description: "Quản lý nội dung khóa học" },
    { id: "surveys", label: "Quản lý khảo sát", icon: <ClipboardList className="w-5 h-5" />, description: "Tạo và quản lý khảo sát" },
    { id: "programs", label: "Quản lý truyền thông", icon: <Settings className="w-5 h-5" />, description: "Quản lý chương trình truyền thông" },
    { id: "appointments", label: "Hỗ trợ lịch hẹn", icon: <Calendar className="w-5 h-5" />, description: "Hỗ trợ đặt lịch tư vấn" },
  ];

  if (!userInfo) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900' 
          : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
      }`}>
        <div className="text-center">
          <div className="relative">
            <div className={`animate-spin rounded-full h-20 w-20 border-4 mx-auto ${
              isDarkMode ? 'border-gray-600' : 'border-blue-200'
            }`}></div>
            <div className={`animate-spin rounded-full h-20 w-20 border-t-4 mx-auto absolute top-0 ${
              isDarkMode ? 'border-blue-400' : 'border-blue-600'
            }`}></div>
          </div>
          <p className={`mt-6 font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50'
    }`}>
      {/* Mobile Header */}
      <div className={`lg:hidden backdrop-blur-md shadow-sm border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50 ${
        isDarkMode 
          ? 'bg-gray-800/80 border-gray-700' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`p-2 rounded-xl transition-all duration-200 ${
            isDarkMode 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <h1 className={`text-lg font-semibold ${
          isDarkMode ? 'text-gray-100' : 'text-gray-800'
        }`}>Staff Dashboard</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all duration-200 ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-yellow-400' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button className={`p-2 rounded-xl transition-all duration-200 relative ${
            isDarkMode 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}>
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* Enhanced Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-80 backdrop-blur-xl shadow-2xl transform transition-all duration-300 ease-in-out z-40 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 border-r ${
        isDarkMode 
          ? 'bg-gray-800/95 border-gray-700/50' 
          : 'bg-white/95 border-gray-200/50'
      }`}>
        
        {/* Sidebar Header */}
        <div className={`p-6 relative overflow-hidden ${
          isDarkMode 
            ? 'bg-gradient-to-r from-gray-700 via-gray-600 to-indigo-700' 
            : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600'
        }`}>
          <div className={`absolute inset-0 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-gray-700/20 to-transparent' 
              : 'bg-gradient-to-r from-blue-600/20 to-transparent'
          }`}></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Staff Dashboard</h2>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-blue-100'
                }`}>Hệ thống quản lý</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 backdrop-blur-sm"
              title="Về trang chủ"
            >
              <Home className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.path) {
                  navigate(item.path);
                } else {
                  setActiveTab(item.id);
                }
                setSidebarOpen(false);
              }}
              className={`w-full group flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                activeTab === item.id
                  ? `${isDarkMode 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    } text-white shadow-lg transform scale-[1.02]`
                  : `${isDarkMode 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-700'
                    } hover:transform hover:scale-[1.01]`
              }`}
            >
              <div className={`p-2 rounded-xl ${
                activeTab === item.id 
                  ? 'bg-white/20' 
                  : `${isDarkMode 
                      ? 'bg-gray-600 group-hover:bg-indigo-600' 
                      : 'bg-gray-100 group-hover:bg-blue-100'
                    }`
              }`}>
                {React.cloneElement(item.icon, {
                  className: `w-5 h-5 ${
                    activeTab === item.id ? 'text-white' : 
                    isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-blue-600'
                  }`
                })}
              </div>
              <div className="flex-1 text-left">
                <p className={`font-medium ${
                  activeTab === item.id ? 'text-white' : 
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {item.label}
                </p>
                {item.description && (
                  <p className={`text-xs ${
                    activeTab === item.id ? 'text-blue-100' : 
                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </p>
                )}
              </div>
              <ChevronRight className={`w-4 h-4 transition-all duration-200 ${
                activeTab === item.id ? 'text-white' : 
                isDarkMode ? 'text-gray-400 group-hover:translate-x-1 group-hover:text-white' : 'text-gray-400 group-hover:translate-x-1 group-hover:text-blue-600'
              }`} />
            </button>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 ${
          isDarkMode 
            ? 'bg-gradient-to-t from-gray-800 to-transparent' 
            : 'bg-gradient-to-t from-gray-50 to-transparent'
        }`}>
          {userInfo && (
            <div className={`flex items-center space-x-3 mb-4 p-4 rounded-2xl shadow-lg border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600' 
                : 'bg-white border-gray-100'
            }`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-700' 
                  : 'bg-gradient-to-br from-blue-500 to-indigo-600'
              }`}>
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>{userInfo.userName}</p>
                <p className={`text-xs truncate ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{userInfo.email}</p>
                <p className={`text-xs font-medium px-2 py-1 rounded-lg inline-block mt-1 ${
                  isDarkMode 
                    ? 'text-indigo-300 bg-indigo-900/50' 
                    : 'text-blue-600 bg-blue-50'
                }`}>Staff</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-3 text-white rounded-2xl transition-all duration-200 shadow-lg font-medium transform hover:scale-[1.02] active:scale-[0.98] ${
              isDarkMode 
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' 
                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
            }`}
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Enhanced Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="lg:ml-80 min-h-screen">
        {/* Enhanced Desktop Header */}
        <div className={`hidden lg:block backdrop-blur-md border-b px-8 py-6 sticky top-0 z-10 ${
          isDarkMode 
            ? 'bg-gray-800/80 border-gray-700/50' 
            : 'bg-white/80 border-gray-200/50'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                isDarkMode 
                  ? 'from-gray-100 to-gray-300' 
                  : 'from-gray-800 to-gray-600'
              }`}>
                Chào mừng, {userInfo.userName}! 👋
              </h1>
              <p className={`mt-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Quản lý hệ thống phòng chống ma túy</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className={`pl-12 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm shadow-sm transition-all duration-200 w-80 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700/70 text-gray-100 placeholder-gray-400' 
                      : 'border-gray-300 bg-white/70 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-2xl transition-all duration-200 shadow-sm backdrop-blur-sm ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 bg-gray-700/70 text-yellow-400' 
                    : 'hover:bg-gray-100 bg-white/70 text-gray-600'
                }`}
              >
                {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
              <button className={`relative p-3 rounded-2xl transition-all duration-200 shadow-sm backdrop-blur-sm ${
                isDarkMode 
                  ? 'hover:bg-gray-700 bg-gray-700/70 text-gray-300' 
                  : 'hover:bg-gray-100 bg-white/70 text-gray-600'
              }`}>
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Content Area */}
        <div className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Breadcrumb */}
            <div className="mb-8">
              <nav className="flex items-center space-x-2 text-sm bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 border border-gray-200/50 shadow-sm w-fit">
                <span className="text-gray-500">Dashboard</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-blue-600 font-semibold">
                  {menuItems.find(item => item.id === activeTab)?.label || "Tổng quan"}
                </span>
              </nav>
            </div>

            {/* Content based on active tab with enhanced animations */}
            <div className="transition-all duration-500 ease-in-out transform">
              {activeTab === "overview" && (
                <div className="animate-in slide-in-from-right-5 fade-in duration-500">
                  <StaffOverview />
                </div>
              )}
              {activeTab === "users" && (
                <div className="animate-in slide-in-from-right-5 fade-in duration-500">
                  <UserManagement />
                </div>
              )}
              {activeTab === "courses" && (
                <div className="animate-in slide-in-from-right-5 fade-in duration-500">
                  <CourseManagement />
                </div>
              )}
              {activeTab === "surveys" && (
                <div className="animate-in slide-in-from-right-5 fade-in duration-500">
                  <SurveyManagement />
                </div>
              )}
              {activeTab === "programs" && (
                <div className="animate-in slide-in-from-right-5 fade-in duration-500">
                  <ProgramManagement />
                </div>
              )}
              {activeTab === "appointments" && (
                <div className="animate-in slide-in-from-right-5 fade-in duration-500">
                  <AppointmentSupport />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;