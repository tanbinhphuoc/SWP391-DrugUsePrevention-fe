import { 
  Users, 
  BookOpen, 
  ClipboardList, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from "lucide-react";

const ManagerOverview = () => {
  const systemStats = [
    {
      title: "Tổng người dùng",
      value: "2,847",
      change: "+15.3%",
      icon: <Users className="w-8 h-8 text-blue-600" />,
      color: "bg-blue-50 border-blue-200",
      trend: "up"
    },
    {
      title: "Staff hoạt động",
      value: "12",
      change: "+2",
      icon: <Users className="w-8 h-8 text-green-600" />,
      color: "bg-green-50 border-green-200",
      trend: "up"
    },
    {
      title: "Consultant",
      value: "8",
      change: "+1",
      icon: <Users className="w-8 h-8 text-purple-600" />,
      color: "bg-purple-50 border-purple-200",
      trend: "up"
    },
    {
      title: "Hiệu quả hệ thống",
      value: "94.2%",
      change: "+2.1%",
      icon: <Target className="w-8 h-8 text-orange-600" />,
      color: "bg-orange-50 border-orange-200",
      trend: "up"
    }
  ];

  const performanceMetrics = [
    {
      category: "Khóa học",
      total: 45,
      active: 38,
      completion: "87%",
      satisfaction: "4.6/5"
    },
    {
      category: "Khảo sát",
      total: 15,
      active: 12,
      completion: "92%",
      satisfaction: "4.4/5"
    },
    {
      category: "Tư vấn",
      total: 234,
      active: 156,
      completion: "89%",
      satisfaction: "4.8/5"
    },
    {
      category: "Chương trình",
      total: 8,
      active: 5,
      completion: "75%",
      satisfaction: "4.5/5"
    }
  ];

  const systemAlerts = [
    { 
      type: "warning", 
      message: "Cần phê duyệt 3 khóa học mới", 
      priority: "Cao",
      time: "2 giờ trước"
    },
    { 
      type: "info", 
      message: "Báo cáo tháng cần xem xét", 
      priority: "Trung bình",
      time: "1 ngày trước"
    },
    { 
      type: "success", 
      message: "Hệ thống backup hoàn tất", 
      priority: "Thấp",
      time: "3 giờ trước"
    },
  ];

  const recentActivities = [
    { action: "Staff mới được thêm", user: "Nguyễn Văn A", time: "10 phút trước", type: "staff" },
    { action: "Khóa học được phê duyệt", user: "Trần Thị B", time: "30 phút trước", type: "course" },
    { action: "Consultant cập nhật lịch", user: "Dr. Lê C", time: "1 giờ trước", type: "schedule" },
    { action: "Báo cáo được tạo", user: "System", time: "2 giờ trước", type: "report" },
  ];

  return (
    <div className="space-y-6">
      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => (
          <div key={index} className={`p-6 rounded-lg border-2 ${stat.color} hover:shadow-lg transition-shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </p>
              </div>
              <div className="flex-shrink-0">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Hiệu suất hệ thống</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{metric.category}</h4>
                  <span className="text-sm text-gray-600">{metric.active}/{metric.total} hoạt động</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Hoàn thành: </span>
                    <span className="font-medium text-green-600">{metric.completion}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Đánh giá: </span>
                    <span className="font-medium text-blue-600">{metric.satisfaction}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Cảnh báo hệ thống</h3>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-4">
            {systemAlerts.map((alert, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                alert.type === 'success' ? 'bg-green-50 border-green-500' :
                'bg-blue-50 border-blue-500'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
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

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Hoạt động gần đây</h3>
          <Clock className="w-5 h-5 text-gray-500" />
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${
                activity.type === 'staff' ? 'bg-blue-500' :
                activity.type === 'course' ? 'bg-green-500' :
                activity.type === 'schedule' ? 'bg-purple-500' :
                'bg-orange-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                <p className="text-xs text-gray-600">{activity.user} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Thao tác nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-sm font-medium text-blue-800">Quản lý Staff</p>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
            <Users className="w-6 h-6 text-purple-600 mb-2" />
            <p className="text-sm font-medium text-purple-800">Quản lý Consultant</p>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
            <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-sm font-medium text-green-800">Xem báo cáo</p>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors">
            <Settings className="w-6 h-6 text-orange-600 mb-2" />
            <p className="text-sm font-medium text-orange-800">Cài đặt hệ thống</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerOverview;