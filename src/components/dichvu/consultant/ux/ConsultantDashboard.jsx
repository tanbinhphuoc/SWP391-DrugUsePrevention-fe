import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ConsultantOverview,
  ConsultantAppointments,
  ConsultantSurveys,
  ConsultantPrograms,
  ConsultantProfile
} from "./";

const SIDEBAR_ITEMS = [
  { label: "Tổng quan", icon: "🏠", section: "overview" },
  { label: "Lịch hẹn", icon: "📅", section: "appointments" },
  { label: "Khảo sát", icon: "🧠", section: "surveys" },
  { label: "Chương trình", icon: "📣", section: "programs" },
  { label: "Hồ sơ", icon: "👤", section: "profile" },
];

const ConsultantDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const userName = localStorage.getItem("userName") || "Chuyên viên";
  const email = localStorage.getItem("email") || "consultant@example.com";

  // Nội dung mẫu cho từng mục
  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-2 flex items-center gap-2">
              🏠 Tổng quan
            </h2>
            <p className="text-gray-700 mb-2">
              Chào mừng bạn đến với bảng điều khiển chuyên viên. Tại đây bạn có thể quản lý lịch hẹn, khảo sát, chương trình và hồ sơ cá nhân một cách dễ dàng.
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Xem nhanh các lịch hẹn sắp tới</li>
              <li>Thống kê khảo sát và chương trình</li>
              <li>Cập nhật thông tin cá nhân</li>
            </ul>
          </div>
        );
      case "appointments":
        return (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-2 flex items-center gap-2">
              📅 Lịch hẹn
            </h2>
            <p className="text-gray-700 mb-4">
              Quản lý, xem và xác nhận các lịch hẹn tư vấn với học viên hoặc phụ huynh.
            </p>
            <ConsultantAppointments />
          </div>
        );
      case "surveys":
        return (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-2 flex items-center gap-2">
              🧠 Khảo sát
            </h2>
            <p className="text-gray-700 mb-4">
              Xem kết quả khảo sát, tạo khảo sát mới và phân tích dữ liệu khảo sát học viên.
            </p>
            <ConsultantSurveys />
          </div>
        );
      case "programs":
        return (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-2 flex items-center gap-2">
              📣 Chương trình
            </h2>
            <p className="text-gray-700 mb-4">
              Quản lý các chương trình truyền thông, sự kiện, hội thảo về phòng chống ma túy.
            </p>
            <ConsultantPrograms />
          </div>
        );
      case "profile":
        return (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-2 flex items-center gap-2">
              👤 Hồ sơ cá nhân
            </h2>
            <p className="text-gray-700 mb-4">
              Xem và cập nhật thông tin cá nhân, đổi mật khẩu, ảnh đại diện, thông tin liên hệ.
            </p>
            <ConsultantProfile />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen min-h-screen w-72 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white z-50 flex flex-col justify-between shadow-xl transition-transform duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        style={{ minHeight: "100vh", height: "100vh" }}
      >
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-3 p-6 border-b border-blue-800">
            <span className="text-3xl">🧑‍💼</span>
            <span className="text-2xl font-extrabold tracking-tight">Consultant</span>
          </div>
          <nav className="space-y-2 px-4 py-6 flex-1">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.section}
                className={`w-full text-left px-5 py-3 rounded-xl flex items-center gap-3 font-semibold transition-all ${
                  activeSection === item.section
                    ? "bg-gradient-to-r from-green-400 to-blue-500 text-white shadow"
                    : "hover:bg-blue-800/80"
                }`}
                onClick={() => {
                  setActiveSection(item.section);
                  setSidebarOpen(false);
                }}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
            <button
              onClick={() => navigate("/")}
              className="w-full text-left px-5 py-3 rounded-xl flex items-center gap-3 font-semibold hover:bg-blue-800/80 transition-all"
            >
              <span>🏡</span> Trang chủ
            </button>
          </nav>
        </div>
        <div className="p-6 border-t border-blue-800/60 text-sm bg-blue-900/80">
          <div className="font-semibold">{email}</div>
          <div className="text-blue-200 mb-2">{userName}</div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-xl text-white text-sm font-semibold shadow transition-all"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen p-4 md:p-10 transition-all">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden mb-4 text-blue-700 bg-white rounded-full shadow px-4 py-2 font-bold flex items-center gap-2"
        >
          <span>☰</span> Menu
        </button>
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 flex items-center gap-3">
            🎯 Xin chào, <span className="text-green-600">{userName}</span>!
          </h1>
        </div>
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid gap-8">
            {renderSection()}
          </div>
        </div>
      </main>
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Thông tin hỗ trợ và liên hệ */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="mt-12 bg-gradient-to-r from-blue-100 via-green-50 to-green-100 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-100">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-blue-800 mb-2 flex items-center gap-2">
              <span>💡</span> Hỗ trợ chuyên viên
            </h2>
            <p className="text-gray-700 mb-2">
              Nếu bạn gặp khó khăn khi sử dụng hệ thống, vui lòng liên hệ bộ phận kỹ thuật hoặc gửi phản hồi cho chúng tôi.
            </p>
            <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-sm">
              <span className="flex items-center gap-1 text-blue-700">
                📧 Email: <a href="mailto:support@drugprevention.vn" className="underline hover:text-green-700">support@drugprevention.vn</a>
              </span>
              <span className="flex items-center gap-1 text-blue-700">
                ☎️ Hotline: <a href="tel:18001234" className="underline hover:text-green-700">1800 1234</a>
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-5xl">🤝</span>
            <span className="text-blue-700 font-semibold">Chúng tôi luôn sẵn sàng hỗ trợ bạn!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantDashboard;