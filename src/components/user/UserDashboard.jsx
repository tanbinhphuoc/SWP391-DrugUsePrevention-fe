import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserOverview,
  UserCourses,
  UserSurveys,
  UserAppointments,
  UserPrograms,
  UserProfile,
} from "./";
// THAY ĐỔI: Thêm react-toastify và lucide-react để đồng bộ với Admin Dashboard
import { toast, ToastContainer } from "react-toastify";
import { LogOut } from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  // THAY ĐỔI: Thêm state cho activeTab
  const [activeTab, setActiveTab] = useState("overview");
  // THAY ĐỔI: Thêm state cho userInfo
  const [userInfo, setUserInfo] = useState(null);

  // THAY ĐỔI: Kiểm tra token và vai trò tương tự Admin Dashboard
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

      // THAY ĐỔI: Kiểm tra vai trò (roleId: 2 cho Member)
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
    } else {
      toast.error("Vui lòng đăng nhập để truy cập trang này!");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    // THAY ĐỔI: Thêm thông báo đăng xuất
    toast.success("Đăng xuất thành công!");
    navigate("/login", { replace: true });
  };

  // THAY ĐỔI: Danh sách menu với id để điều hướng
  const menuItems = [
    { id: "overview", label: "Tổng quan", icon: "📊" },
    { id: "courses", label: "Khóa học", icon: "🎓" },
    { id: "surveys", label: "Khảo sát", icon: "🧠" },
    { id: "appointments", label: "Tư vấn", icon: "📅" },
    { id: "programs", label: "Chương trình", icon: "📣" },
    { id: "profile", label: "Hồ sơ", icon: "👤" },
  ];

  // THAY ĐỔI: Hiển thị loading khi userInfo chưa sẵn sàng
  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col justify-between">
        <div>
          <div className="p-6 text-xl font-bold">User Dashboard</div>
          <nav className="space-y-2 px-4">
            {/* THAY ĐỔI: Cải thiện sidebar với trạng thái active và điều hướng */}
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-700 text-white"
                    : "hover:bg-blue-800 text-gray-300"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-white/30 text-sm">
          <div>{userInfo.email}</div>
          <div className="text-gray-300 mb-2">{userInfo.userName}</div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
          >
            {/* THAY ĐỔI: Thêm icon LogOut từ lucide-react */}
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">
          🎉 Chào mừng {userInfo.userName} trở lại!
        </h1>

        {/* THAY ĐỔI: Hiển thị component dựa trên activeTab */}
        <div className="mt-6 grid gap-6">
          {activeTab === "overview" && <UserOverview />}
          {activeTab === "courses" && <UserCourses />}
          {activeTab === "surveys" && <UserSurveys />}
          {activeTab === "appointments" && <UserAppointments />}
          {activeTab === "programs" && <UserPrograms />}
          {activeTab === "profile" && <UserProfile />}
        </div>
      </main>
      {/* THAY ĐỔI: Thêm ToastContainer */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserDashboard;