import React, { useState } from 'react';
import { 
  User, 
  Book, 
  FileCheck, 
  Calendar, 
  Heart, 
  Award, 
  TrendingUp, 
  Bell, 
  Settings, 
  LogOut,
  ChevronRight,
  Play,
  Clock,
  Users,
  Star,
  Target,
  Shield,
  Megaphone
} from 'lucide-react';

const QuickActionCard = ({ icon, title, description, color, onClick }) => (
  <div 
    onClick={onClick}
    className={`group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${color}`}
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl bg-white/20 group-hover:bg-white/30 transition-colors duration-300`}>
        {React.cloneElement(icon, { className: "w-6 h-6 text-white" })}
      </div>
      <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-white/80 text-sm leading-relaxed">{description}</p>
  </div>
);

const StatCard = ({ icon, title, value, trend }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-sky-100 rounded-xl">
        {React.cloneElement(icon, { className: "w-6 h-6 text-sky-600" })}
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-emerald-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+{trend}%</span>
        </div>
      )}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-gray-600 text-sm">{title}</p>
  </div>
);

const CourseCard = ({ title, progress, duration, instructor, thumbnail }) => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
    <div className="relative h-48 bg-gradient-to-br from-sky-400 to-emerald-400">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
          <Clock className="w-4 h-4" />
          <span>{duration}</span>
        </div>
        <h4 className="text-white font-bold text-lg">{title}</h4>
      </div>
      <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors duration-300">
        <Play className="w-5 h-5 text-white" />
      </button>
    </div>
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-emerald-600" />
        </div>
        <span className="text-gray-600 text-sm">{instructor}</span>
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Tiến độ</span>
          <span className="font-medium text-gray-900">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-sky-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <button className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300 group-hover:scale-105">
        Tiếp tục học
      </button>
    </div>
  </div>
);

const GuestDashboard = () => {
  const [user] = useState({
    name: "Nguyễn Văn An",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    joinDate: "Tháng 6, 2025"
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">PreventionSupport</h1>
            </div>

            {/* User menu */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3 bg-gray-100 rounded-full pr-4 pl-2 py-2">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium text-gray-900 text-sm">{user.name}</span>
              </div>
              
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                <Settings className="w-5 h-5" />
              </button>
              
              <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Megaphone className="w-6 h-6 text-yellow-300 animate-bounce" />
                <span className="bg-red-500/20 px-3 py-1 rounded-full text-sm font-medium border border-red-400/30">
                  MA TÚY KHÔNG NÊN THỬ DÙ CHỈ 1 LẦN
                </span>
              </div>
              
              <h2 className="text-3xl font-bold mb-2">
                Chào mừng trở lại, {user.name}! 👋
              </h2>
              <p className="text-sky-100 text-lg">
                Hãy cùng tiếp tục hành trình xây dựng cộng đồng khỏe mạnh và an toàn.
              </p>
              
              <div className="flex items-center gap-6 mt-6 text-sky-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Tham gia từ {user.joinDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span className="text-sm">Thành viên tích cực</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={<Book />} 
            title="Khóa học đã hoàn thành"
            value="3"
            trend="15"
          />
          <StatCard 
            icon={<FileCheck />} 
            title="Đánh giá đã thực hiện"
            value="2"
          />
          <StatCard 
            icon={<Users />} 
            title="Hoạt động cộng đồng"
            value="8"
            trend="25"
          />
          <StatCard 
            icon={<Star />} 
            title="Điểm thành tích"
            value="450"
            trend="12"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Hành động nhanh</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionCard 
              icon={<Book />}
              title="Khóa học mới"
              description="Khám phá các khóa học phòng chống tệ nạn xã hội"
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <QuickActionCard 
              icon={<FileCheck />}
              title="Đánh giá rủi ro"
              description="Thực hiện đánh giá rủi ro cá nhân hóa"
              color="bg-gradient-to-br from-emerald-500 to-emerald-600"
            />
            <QuickActionCard 
              icon={<Calendar />}
              title="Đặt lịch tư vấn"
              description="Gặp gỡ chuyên gia để được hỗ trợ"
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
            <QuickActionCard 
              icon={<Heart />}
              title="Hoạt động cộng đồng"
              description="Tham gia các hoạt động hỗ trợ cộng đồng"
              color="bg-gradient-to-br from-pink-500 to-pink-600"
            />
          </div>
        </div>

        {/* Courses in progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Khóa học đang theo dõi</h3>
            <button className="text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1">
              Xem tất cả
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CourseCard 
              title="Nhận thức về tác hại của ma túy"
              progress={75}
              duration="45 phút"
              instructor="TS. Nguyễn Thị Lan"
            />
            <CourseCard 
              title="Kỹ năng từ chối và phòng chống"
              progress={30}
              duration="60 phút"
              instructor="ThS. Trần Văn Minh"
            />
            <CourseCard 
              title="Hỗ trợ người thân bị nghiện"
              progress={10}
              duration="90 phút"
              instructor="BS. Lê Thị Hoa"
            />
          </div>
        </div>

        {/* Recent activities */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Hoạt động gần đây</h3>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="space-y-4">
              {[
                { action: "Hoàn thành", item: "Bài kiểm tra: Nhận thức về ma túy", time: "2 giờ trước", icon: <Award className="w-4 h-4 text-emerald-500" /> },
                { action: "Tham gia", item: "Thảo luận: Phòng chống tệ nạn xã hội", time: "1 ngày trước", icon: <Users className="w-4 h-4 text-blue-500" /> },
                { action: "Đăng ký", item: "Khóa học: Kỹ năng từ chối", time: "3 ngày trước", icon: <Book className="w-4 h-4 text-purple-500" /> }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">
                      <span className="text-sky-600">{activity.action}</span> {activity.item}
                    </p>
                    <p className="text-gray-500 text-sm">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDashboard;