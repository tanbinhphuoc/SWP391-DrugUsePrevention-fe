import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ConsultantOverview,
  ConsultantAppointments,
  ConsultantSurveys,
  ConsultantPrograms,
  ConsultantProfile
} from "./";

const ConsultantDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const userName = localStorage.getItem("userName") || "Chuyên viên";
  const email = localStorage.getItem("email") || "consultant@example.com";

  return (
    <div className="flex min-h-screen">
      <aside className={`fixed md:static w-64 bg-blue-900 text-white z-50 h-full flex flex-col justify-between transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div>
          <div className="p-6 text-xl font-bold">Consultant Dashboard</div>
          <nav className="space-y-2 px-4">
            <button className="w-full text-left px-4 py-2 rounded hover:bg-blue-800">📅 Lịch hẹn</button>
            <button className="w-full text-left px-4 py-2 rounded hover:bg-blue-800">🧠 Khảo sát</button>
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

      <main className="flex-1 p-4 md:p-8 bg-gray-100">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden mb-4 text-blue-600">
          ☰ Menu
        </button>
        <h1 className="text-2xl font-bold mb-6">🎯 Xin chào {userName}!</h1>
        <div className="grid gap-6">
          <ConsultantOverview />
          <ConsultantAppointments />
          <ConsultantSurveys />
          <ConsultantPrograms />
          <ConsultantProfile />
        </div>
      </main>
    </div>
  );
};

export default ConsultantDashboard;
