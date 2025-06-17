import { Users, BookOpen, ClipboardList, Calendar, TrendingUp, AlertCircle } from "lucide-react";

const StaffOverview = () => {
  const stats = [
    {
      title: "Tổng người dùng",
      value: "1,234",
      change: "+12%",
      icon: <Users className="w-8 h-8 text-blue-600" />,
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "Khóa học hoạt động",
      value: "45",
      change: "+3",
      icon: <BookOpen className="w-8 h-8 text-green-600" />,
      color: "bg-green-50 border-green-200"
    },
    {
      title: "Khảo sát hoàn thành",
      value: "892",
      change: "+18%",
      icon: <ClipboardList className="w-8 h-8 text-purple-600" />,
      color: "bg-purple-50 border-purple-200"
    },
    {
      title: "Lịch hẹn tháng này",
      value: "156",
      change: "+8%",
      icon: <Calendar className="w-8 h-8 text-orange-600" />,
      color: "bg-orange-50 border-orange-200"
    }
  ];

  const recentActivities = [
    { action: "Người dùng mới đăng ký", user: "Nguyễn Văn A", time: "5 phút trước" },
    { action: "Hoàn thành khóa học", user: "Trần Thị B", time: "15 phút trước" },
    { action: "Đặt lịch tư vấn", user: "Lê Văn C", time: "30 phút trước" },
    { action: "Hoàn thành khảo sát ASSIST", user: "Phạm Thị D", time: "1 giờ trước" },
  ];

  const alerts = [
    { type: "warning", message: "3 lịch hẹn cần xác nhận", priority: "Cao" },
    { type: "info", message: "Khóa học mới cần phê duyệt", priority: "Trung bình" },
    { type: "error", message: "Hệ thống cần bảo trì", priority: "Thấp" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`p-6 rounded-lg border-2 ${stat.color} hover:shadow-lg transition-shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600 font-medium">{stat.change}</p>
              </div>
              <div className="flex-shrink-0">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Hoạt động gần đây</h3>
            <TrendingUp className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Thông báo quan trọng</h3>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${
                alert.type === 'error' ? 'bg-red-50 border-red-500' :
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                'bg-blue-50 border-blue-500'
              }`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    alert.priority === 'Cao' ? 'bg-red-100 text-red-800' :
                    alert.priority === 'Trung bình' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {alert.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-sm font-medium text-blue-800">Thêm người dùng mới</p>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
            <BookOpen className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-sm font-medium text-green-800">Tạo khóa học mới</p>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
            <ClipboardList className="w-6 h-6 text-purple-600 mb-2" />
            <p className="text-sm font-medium text-purple-800">Tạo khảo sát mới</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffOverview;