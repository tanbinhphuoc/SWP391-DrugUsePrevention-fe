import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  UserCheck, 
  TrendingUp, 
  Settings,
  LogOut,
  Menu,
  X,
  Home
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import ManagerOverview from "./ManagerOverview";
import StaffManagement from "./StaffManagement";
import ConsultantManagement from "./ConsultantManagement";
const ManagerDashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        6: "/dashboard",
      };

      if (roleId !== "5") {
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
    toast.success("Đăng xuất thành công!");
    navigate("/login", { replace: true });
  };

  const menuItems = [
    { id: "overview", label: "Dashboard & Reports", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "staff", label: "Quản lý Staff", icon: <Users className="w-5 h-5" /> },
    { id: "consultants", label: "Quản lý Consultant", icon: <UserCheck className="w-5 h-5" /> },
    // THAY ĐỔI: Thêm nút Trang chủ với icon Home
    { id: "home", label: "Trang chủ", icon: <Home className="w-5 h-5" />, path: "/" }
  ];

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-purple-600 text-white rounded-lg shadow-lg"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className={`fixed inset-y-0 left-0 w-64 bg-purple-800 text-white transform transition-transform duration-300 ease-in-out z-40 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-8 mt-8 lg:mt-0">Manager Dashboard</h2>
          <nav>
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
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  activeTab === item.id
                    ? "bg-purple-700 text-white"
                    : "hover:bg-purple-700/50 text-gray-300"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-purple-900">
          {userInfo && (
            <div className="mb-4">
              <p className="text-sm text-gray-300">{userInfo.email}</p>
              <p className="text-xs text-gray-400">{userInfo.userName}</p>
              <p className="text-xs text-purple-300">Manager</p>
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

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="lg:ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Chào mừng, {userInfo.userName}!
          </h1>
          <p className="text-gray-600">Quản lý tổng thể hệ thống phòng chống ma túy</p>
        </div>

        {activeTab === "overview" && <ManagerOverview />}
        {activeTab === "staff" && <StaffManagement />}
        {activeTab === "consultants" && <ConsultantManagement />}
        {activeTab === "reports" && <SystemReports />}
        {activeTab === "settings" && <SystemSettings />}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ManagerDashboard;
