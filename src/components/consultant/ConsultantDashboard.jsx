//ConsultantDashBoard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Calendar, LogOut, Menu, X } from "lucide-react";
import ConsultantAppointments from "./ConsultantAppointments";
import ConsultantProfile from "./ConsultantProfile";

const ConsultantDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('appointments');

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const userName = localStorage.getItem("userName") || localStorage.getItem("fullName") || "Chuyên viên";
  const email = localStorage.getItem("email") || "consultant@example.com";

  const menuItems = [
    { id: 'appointments', label: 'Lịch hẹn', icon: Calendar },
    { id: 'profile', label: 'Hồ sơ', icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Sidebar */}
      <aside className={`fixed md:static w-64 bg-white/80 backdrop-blur-lg shadow-xl border border-white/20 z-50 h-full transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Consultant Dashboard
              </h1>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeSection === item.id 
                        ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 text-white shadow-lg transform scale-105' 
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:transform hover:scale-105'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
          
          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-200/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{email}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:via-pink-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {/* Mobile Header */}
        <div className="md:hidden mb-6">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-white/30"
          >
            <Menu className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700">Menu</span>
          </button>
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/30">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">👋</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Xin chào, {userName}!</h1>
                <p className="text-gray-600 mt-1">Chúc bạn một ngày làm việc hiệu quả</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeSection === 'appointments' && (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/30 overflow-hidden">
              <ConsultantAppointments />
            </div>
          )}
          {activeSection === 'profile' && (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/30 overflow-hidden">
              <ConsultantProfile />
            </div>
          )}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ConsultantDashboard;