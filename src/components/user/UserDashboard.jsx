import { useNavigate } from "react-router-dom";
import {
  UserOverview,
  UserCourses,
  UserSurveys,
  UserAppointments,
  UserPrograms,
  UserProfile
} from "./";

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const userName = localStorage.getItem("userName") || "Người dùng";
  const email = localStorage.getItem("email") || "user@example.com";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col justify-between">
        <div>
          <div className="p-6 text-xl font-bold">User Dashboard</div>
          <nav className="space-y-2 px-4">
            <button className="w-full text-left px-4 py-2 rounded hover:bg-blue-800">🎓 Khóa học</button>
            <button className="w-full text-left px-4 py-2 rounded hover:bg-blue-800">🧠 Khảo sát</button>
            <button className="w-full text-left px-4 py-2 rounded hover:bg-blue-800">📅 Tư vấn</button>
            <button className="w-full text-left px-4 py-2 rounded hover:bg-blue-800">📣 Chương trình</button>
            <button className="w-full text-left px-4 py-2 rounded hover:bg-blue-800">👤 Hồ sơ</button>
          </nav>
        </div>
        <div className="p-4 border-t border-white/30 text-sm">
          <div>{email}</div>
          <div className="text-gray-300 mb-2">{userName}</div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">🎉 Chào mừng {userName} trở lại!</h1>

        {/* Gọi các component nhỏ */}
        <UserOverview />
        <div className="mt-6 grid gap-6">
          <UserCourses />
          <UserSurveys />
          <UserAppointments />
          <UserPrograms />
          <UserProfile />
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
