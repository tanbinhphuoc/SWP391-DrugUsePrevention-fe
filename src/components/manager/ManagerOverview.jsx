"use client"

import { useState, useEffect } from "react"
import { Users, TrendingUp, Clock, Target, Activity, UserCheck } from "lucide-react"

const ManagerOverview = () => {
  const [systemStats, setSystemStats] = useState([])
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("token") || sessionStorage.getItem("tempToken")

  // Show notification function
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000)
  }

  // Fetch system stats from real APIs
  const fetchSystemStats = async () => {
    try {
      setLoading(true)

      // Fetch all users
      const usersResponse = await fetch("http://localhost:7092/api/Admin/GetAllUsers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!usersResponse.ok) throw new Error(`HTTP error! status: ${usersResponse.status}`)
      const usersData = await usersResponse.json()

      const totalUsers = usersData.success ? usersData.data.length : 0
      const activeUsers = usersData.success ? usersData.data.filter((u) => u.status === "Active").length : 0
      const inactiveUsers = totalUsers - activeUsers
      const staffCount = usersData.success ? usersData.data.filter((u) => u.roleName === "Staff").length : 0
      const activeStaff = usersData.success
        ? usersData.data.filter((u) => u.roleName === "Staff" && u.status === "Active").length
        : 0

      // Fetch all consultants
      const consultantsResponse = await fetch("http://localhost:7092/api/Appointments/GetAllConsultant", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!consultantsResponse.ok) throw new Error(`HTTP error! status: ${consultantsResponse.status}`)
      const consultantsData = await consultantsResponse.json()

      const totalConsultants = consultantsData.success ? consultantsData.data.length : 0
      const activeConsultants = consultantsData.success
        ? consultantsData.data.filter((c) => c.status === "Active").length
        : 0
      const inactiveConsultants = totalConsultants - activeConsultants

      setSystemStats([
        {
          title: "Tổng người dùng",
          value: totalUsers.toString(),
          subtitle: `${activeUsers} hoạt động, ${inactiveUsers} không hoạt động`,
          icon: <Users className="w-8 h-8 text-blue-600" />,
          color: "from-blue-500 to-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        },
        {
          title: "Nhân viên (Staff)",
          value: staffCount.toString(),
          subtitle: `${activeStaff} đang hoạt động`,
          icon: <UserCheck className="w-8 h-8 text-green-600" />,
          color: "from-green-500 to-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        },
        {
          title: "Tư vấn viên",
          value: totalConsultants.toString(),
          subtitle: `${activeConsultants} hoạt động, ${inactiveConsultants} không hoạt động`,
          icon: <Target className="w-8 h-8 text-purple-600" />,
          color: "from-purple-500 to-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
        },
        {
          title: "Tỷ lệ hoạt động",
          value: totalUsers > 0 ? `${Math.round((activeUsers / totalUsers) * 100)}%` : "0%",
          subtitle: `${activeUsers}/${totalUsers} người dùng`,
          icon: <Activity className="w-8 h-8 text-orange-600" />,
          color: "from-orange-500 to-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
        },
      ])
    } catch (error) {
      console.error("Error fetching system stats:", error.message)
      showNotification("Lỗi tải thống kê hệ thống.", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchSystemStats()
    } else {
      showNotification("Vui lòng đăng nhập để truy cập!", "error")
      setLoading(false)
    }
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl transition-all duration-300 backdrop-blur-sm ${
            notification.type === "error"
              ? "bg-red-500/90 text-white border border-red-400"
              : "bg-green-500/90 text-white border border-green-400"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tổng quan hệ thống
              </h1>
              <p className="text-gray-600 mt-1">Dashboard quản lý tổng thể</p>
            </div>
          </div>
        </div>

        {/* System Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                </div>
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}
                >
                  {stat.icon}
                </div>
              </div>
              <div className={`h-2 ${stat.bgColor} rounded-full overflow-hidden`}>
                <div
                  className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`}
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Statistics */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Thống kê người dùng</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Người dùng hoạt động</span>
                </div>
                <span className="text-xl font-bold text-blue-600">
                  {systemStats.length > 0 ? systemStats[0].value : "0"}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">Staff hoạt động</span>
                </div>
                <span className="text-xl font-bold text-green-600">
                  {systemStats.length > 1 ? systemStats[1].value : "0"}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-900">Consultant hoạt động</span>
                </div>
                <span className="text-xl font-bold text-purple-600">
                  {systemStats.length > 2 ? systemStats[2].value : "0"}
                </span>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Tình trạng hệ thống</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Trạng thái hệ thống</span>
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                    Hoạt động tốt
                  </span>
                </div>
                <p className="text-sm text-gray-600">Tất cả dịch vụ đang hoạt động bình thường</p>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Tỷ lệ hoạt động</span>
                  <span className="text-lg font-bold text-blue-600">
                    {systemStats.length > 3 ? systemStats[3].value : "0%"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Tỷ lệ người dùng đang hoạt động</p>
              </div>

              <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Cập nhật cuối</span>
                  <span className="text-sm font-medium text-orange-600">{new Date().toLocaleString("vi-VN")}</span>
                </div>
                <p className="text-sm text-gray-600">Thời gian cập nhật dữ liệu gần nhất</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}

      </div>
    </div>
  )
}

export default ManagerOverview
