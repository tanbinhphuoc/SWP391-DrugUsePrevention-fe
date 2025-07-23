import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  UserOverview,
  UserCourses,
  UserSurveys,
  UserAppointments,
  UserPrograms,
  UserProfile,
} from "./";
import UserAppointmentHistory from "./UserAppointmentHistory";
import { toast, ToastContainer } from "react-toastify";
import { LogOut, Shield, BookOpen, FileText, Calendar, Megaphone, User, Home, Heart } from "lucide-react";

const UserDashboard = () => {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "☀️ Chào buổi sáng";
    if (hour < 18) return "🌤️ Chào buổi chiều";
    return "🌙 Chào buổi tối";
  }, []);
  
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [userInfo, setUserInfo] = useState(null);
  
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    const sessionToken = sessionStorage.getItem("tempToken");

    if (localToken || sessionToken) {
      let userData = localToken
        ? {
            userName: localStorage.getItem("userName"),
            email: localStorage.getItem("email"),
            expiresAt: localStorage.getItem("expiresAt"),
            roleId: localStorage.getItem("roleId"),
            roleName: localStorage.getItem("roleName"),
          }
        : {
            userName: sessionStorage.getItem("userName"),
            email: sessionStorage.getItem("email"),
            expiresAt: sessionStorage.getItem("expiresAt"),
            roleId: sessionStorage.getItem("roleId"),
            roleName: sessionStorage.getItem("roleName"),
          };

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
        6: "/admin-dashboard",
      };

      if (roleId !== "2") {
        const targetRoute = roleRoutes[roleId] || "/login";
        toast.error("Bạn không có quyền truy cập trang này!");
        navigate(targetRoute, { replace: true });
        return;
      }

      setUserInfo(userData);

      // Fetch profile to check assessmentStage
      const fetchAssessmentStage = async () => {
        try {
          const response = await fetch("http://localhost:7092/api/Users/GetProfileMember", {
            headers: {
              Authorization: `Bearer ${localToken || sessionToken}`,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch profile");
          }
          const data = await response.json();
          console.log("Profile data:", data);
          console.log("Assessment Stage:", data.assessmentStage);
          if (data.assessmentStage === null) {
            console.log("Setting active tab to surveys");
            setActiveTab("surveys");
            toast.info("Vui lòng hoàn thành bài khảo sát đầu vào trước!");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast.error("Lỗi khi kiểm tra trạng thái khảo sát.");
        }
      };
      fetchAssessmentStage();
    } else {
      toast.error("Vui lòng đăng nhập để truy cập trang này!");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Xử lý callback từ VNPay
  useEffect(() => {
    const tab = searchParams.get("tab");
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    const appointmentId = searchParams.get("appointmentId");

    if (tab) {
      setActiveTab(tab); // Kích hoạt tab từ query param (appointments)
    }

    if (vnp_ResponseCode === "00" && appointmentId) {
      toast.success(`Thanh toán lịch hẹn ${appointmentId} thành công!`);
      // Xóa query params sau khi xử lý
      setSearchParams({}, { replace: true });
    } else if (vnp_ResponseCode && appointmentId) {
      toast.error(`Thanh toán lịch hẹn ${appointmentId} thất bại!`);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success("Đăng xuất thành công!");
    navigate("/login", { replace: true });
  };

  const menuItems = [
    { id: "overview", label: "Tổng quan", icon: Shield, color: "text-emerald-400" },
    { id: "courses", label: "Khóa học", icon: BookOpen, color: "text-purple-400" },
    // { id: "surveys", label: "Khảo sát", icon: FileText, color: "text-amber-400" },
    // { id: "appointments", label: "Tư vấn", icon: Calendar, color: "text-emerald-400" },
    // { id: "programs", label: "Chương trình", icon: Megaphone, color: "text-purple-400" },
    { id: "appointmentHistory", label: "Lịch sử cuộc hẹn", icon: Calendar, color: "text-emerald-400" },
    { id: "profile", label: "Hồ sơ", icon: User, color: "text-amber-400" },
    { id: "home", label: "Trang chủ", icon: Home, color: "text-gray-300", path: "/" },
  ];

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-900 font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-blue-600 text-white shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-blue-500/50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white whitespace-nowrap">Trung tâm Phòng chống</h1>
                <p className="text-sm text-blue-200 whitespace-nowrap">Ma túy & Tệ nạn xã hội</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === item.id
                        ? "bg-purple-500 text-white shadow-lg scale-105"
                        : "hover:bg-blue-500 text-blue-100 hover:text-white hover:scale-102"
                    }`}
                  >
                    <div className={`flex-shrink-0 ${activeTab === item.id ? 'text-white' : item.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                    {activeTab === item.id && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-emerald-700/50">
            <div className="bg-gradient-to-r from-emerald-800/50 to-teal-800/50 rounded-xl p-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{userInfo.userName}</p>
                  <p className="text-sm text-emerald-200 truncate">{userInfo.email}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Welcome Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-emerald-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {greeting}, <span className="text-emerald-600">{userInfo.userName}</span>!
                </h1>
                <p className="text-gray-600 mt-1">
                  Cùng nhau xây dựng một tương lai khỏe mạnh, tích cực và không có ma túy
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>Đang hoạt động</span>
            </div>
          </div>
        </div>

          {/* Tab Content */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200/50 min-h-96">
            <div className="p-6">
              {activeTab === "overview" && <UserOverview />}
              {activeTab === "courses" && <UserCourses />}
              {/* {activeTab === "surveys" && <UserSurveys />} */}
              {/* {activeTab === "appointments" && <UserAppointments appointmentId={searchParams.get("appointmentId")} />} */}
              {/* {activeTab === "programs" && <UserPrograms />} */}
              {activeTab === "appointmentHistory" && <UserAppointmentHistory />}
              {activeTab === "profile" && <UserProfile />}
              {activeTab === "home" && navigate("/")}
            </div>
          </div>
        </div>
      </main>

      {/* Toast Container */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="backdrop-blur-sm"
      />
    </div>
  );
};

export default UserDashboard;