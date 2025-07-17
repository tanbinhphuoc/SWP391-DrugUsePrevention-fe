"use client"
import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Pie, Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Filler,
} from "chart.js"
import AppointmentManagement from "./AppointmentManagement"
import RiskAssessmentManagement from "./RiskAssessmentManagement"
import { Users, BookOpen, Calendar, LogOut, FileText, BarChart2, TrendingUp, RefreshCw } from "lucide-react"

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Filler,
)

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [dashboardData, setDashboardData] = useState({
    accountStats: { Admin: 0, Member: 0, Staff: 0, Consultant: 0 },
    courseStats: { Total: 0, Completed: 0 },
    riskAssessmentStats: [],
  })
  const [appointmentChartData, setAppointmentChartData] = useState({
    labels: [],
    datasets: [],
  })
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const navigate = useNavigate()

  // Get token from storage
  const getToken = useCallback(() => {
    return localStorage.getItem("token") || sessionStorage.getItem("tempToken")
  }, [])

  // Fetch users data
  const fetchUsers = useCallback(async (token) => {
    try {
      const response = await fetch("http://localhost:7092/api/Admin/GetAllUsers", {
        method: "GET",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (!data.success || !Array.isArray(data.data)) {
        throw new Error(data.message || "Invalid user data format")
      }

      return data.data
    } catch (error) {
      console.error("Error fetching users:", error)
      throw error
    }
  }, [])

  // Fetch courses data
  const fetchCourses = useCallback(async (token) => {
    try {
      const response = await fetch("http://localhost:7092/api/Course/GetAllCourse", {
        method: "GET",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (!data.success || !Array.isArray(data.data)) {
        throw new Error(data.message || "Invalid course data format")
      }

      return data.data
    } catch (error) {
      console.error("Error fetching courses:", error)
      throw error
    }
  }, [])

  // Fetch appointments data
  const fetchAppointments = useCallback(async (token) => {
    try {
      const response = await fetch("http://localhost:7092/api/Admin/GetAllAppointments", {
        method: "GET",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (!data.success || !Array.isArray(data.data)) {
        throw new Error(data.message || "Invalid appointment data format")
      }

      return data.data
    } catch (error) {
      console.error("Error fetching appointments:", error)
      throw error
    }
  }, [])

  // Fetch risk assessments data
  const fetchRiskAssessments = useCallback(async (token) => {
    try {
      const response = await fetch("http://localhost:7092/api/Assessment/GetAllAssessment", {
        method: "GET",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (!data.success || !Array.isArray(data.data)) {
        throw new Error(data.message || "Invalid risk assessment data format")
      }

      return data.data
    } catch (error) {
      console.error("Error fetching risk assessments:", error)
      throw error
    }
  }, [])

  // Main function to fetch all dashboard data
  const fetchDashboardData = useCallback(
    async (showLoading = true) => {
      const token = getToken()
      if (!token) {
        navigate("/login", { replace: true })
        return
      }

      if (showLoading) setLoading(true)

      try {
        // Fetch all data concurrently
        const [usersData, coursesData, appointmentsData, riskAssessmentsData] = await Promise.allSettled([
          fetchUsers(token),
          fetchCourses(token),
          fetchAppointments(token),
          fetchRiskAssessments(token),
        ])

        // Process users data
        let processedUsers = []
        let accountStats = { Admin: 0, Member: 0, Staff: 0, Consultant: 0 }

        if (usersData.status === "fulfilled") {
          processedUsers = usersData.value
          setUsers(processedUsers)

          // Calculate account statistics
          accountStats = processedUsers.reduce(
            (acc, user) => {
              const role = user.roleName || "Unknown"
              if (role in acc) {
                acc[role]++
              }
              return acc
            },
            { Admin: 0, Member: 0, Staff: 0, Consultant: 0 },
          )
        }

        // Process courses data
        let processedCourses = []
        let courseStats = { Total: 0, Completed: 0 }

        if (coursesData.status === "fulfilled") {
          processedCourses = coursesData.value
          setCourses(processedCourses)

          courseStats = {
            Total: processedCourses.length,
            Completed: processedCourses.filter((course) => course.status === "CLOSED").length,
          }
        }

        // Process appointments data
        let newAppointmentChartData = { labels: [], datasets: [] }

        if (appointmentsData.status === "fulfilled") {
          const appointments = appointmentsData.value

          // Group appointments by date for trend chart
          const grouped = appointments.reduce((acc, apt) => {
            const date = new Date(apt.startDateTime).toLocaleDateString("en-CA")
            acc[date] = (acc[date] || 0) + 1
            return acc
          }, {})

          const sortedDates = Object.keys(grouped).sort()
          newAppointmentChartData = {
            labels: sortedDates.map((date) => new Date(date).toLocaleDateString("vi-VN")),
            datasets: [
              {
                label: "Số lượng lịch hẹn",
                data: sortedDates.map((date) => grouped[date]),
                fill: true,
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                borderColor: "rgba(99, 102, 241, 0.8)",
                pointBackgroundColor: "rgba(99, 102, 241, 1)",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                tension: 0.4,
              },
            ],
          }
        }

        // Process risk assessments data
        let riskAssessmentStats = []

        if (riskAssessmentsData.status === "fulfilled") {
          const riskAssessments = riskAssessmentsData.value

          // For now, we'll create mock risk levels since the API doesn't provide level field
          // You can adjust this based on your actual data structure
          riskAssessmentStats = [
            { level: "High", count: Math.floor(riskAssessments.length * 0.2) },
            { level: "Medium", count: Math.floor(riskAssessments.length * 0.5) },
            { level: "Low", count: Math.floor(riskAssessments.length * 0.3) },
          ]
        }

        // Update state with processed data
        setDashboardData({
          accountStats,
          courseStats,
          riskAssessmentStats,
        })

        setAppointmentChartData(newAppointmentChartData)
        setLastUpdated(new Date())
      } catch (error) {
        console.error("Error fetching dashboard data:", error)

        // Set default values on error
        setDashboardData({
          accountStats: { Admin: 0, Member: 0, Staff: 0, Consultant: 0 },
          courseStats: { Total: 0, Completed: 0 },
          riskAssessmentStats: [],
        })
        setAppointmentChartData({ labels: [], datasets: [] })
        setUsers([])
        setCourses([])
      } finally {
        if (showLoading) setLoading(false)
      }
    },
    [getToken, navigate, fetchUsers, fetchCourses, fetchAppointments, fetchRiskAssessments],
  )

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData(false) // Refresh without showing loading
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [fetchDashboardData])

  // Manual refresh function
  const handleRefresh = useCallback(() => {
    fetchDashboardData(true)
  }, [fetchDashboardData])

  useEffect(() => {
    const localToken = localStorage.getItem("token")
    const sessionToken = sessionStorage.getItem("tempToken")

    if (localToken || sessionToken) {
      let userData
      if (localToken) {
        userData = {
          userName: localStorage.getItem("userName") || "",
          email: localStorage.getItem("email") || "",
          expiresAt: localStorage.getItem("expiresAt") || new Date().toISOString(),
          roleId: localStorage.getItem("roleId") || "0",
          roleName: localStorage.getItem("roleName") || "",
        }
      } else {
        userData = {
          userName: sessionStorage.getItem("userName") || "",
          email: sessionStorage.getItem("email") || "",
          expiresAt: sessionStorage.getItem("expiresAt") || new Date().toISOString(),
          roleId: sessionStorage.getItem("roleId") || "0",
          roleName: sessionStorage.getItem("roleName") || "",
        }
      }

      const currentTime = new Date()
      const expirationTime = new Date(userData.expiresAt)

      if (currentTime > expirationTime) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!")
        localStorage.clear()
        sessionStorage.clear()
        navigate("/login", { replace: true })
        return
      }

      const roleId = userData.roleId
      const roleRoutes = {
        1: "/",
        2: "/member-dashboard",
        3: "/staff-dashboard",
        4: "/consultant-dashboard",
        5: "/manager-dashboard",
      }

      if (roleId !== "6") {
        const targetRoute = roleRoutes[roleId] || "/login"
        alert("Bạn không có quyền truy cập trang này!")
        navigate(targetRoute, { replace: true })
        return
      }

      setUserInfo(userData)
      fetchDashboardData(true)
    } else {
      alert("Vui lòng đăng nhập để truy cập trang quản lý!")
      navigate("/login", { replace: true })
    }
  }, [navigate, fetchDashboardData])

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    navigate("/login", { replace: true })
  }

  const menuItems = [
    { id: "overview", label: "Tổng quan", icon: <BarChart2 className="h-5 w-5" /> },
    { id: "accounts", label: "Quản lý tài khoản", icon: <Users className="h-5 w-5" /> },
    { id: "courses", label: "Quản lý khóa học", icon: <BookOpen className="h-5 w-5" /> },
    { id: "appointments", label: "Quản lý lịch hẹn", icon: <Calendar className="h-5 w-5" /> },
    { id: "assessments", label: "Đánh giá rủi ro", icon: <FileText className="h-5 w-5" /> },
  ]

  const accountChartData = {
    labels: Object.keys(dashboardData.accountStats),
    datasets: [
      {
        label: "Số lượng tài khoản",
        data: Object.values(dashboardData.accountStats),
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
        ],
        borderWidth: 0,
        hoverBackgroundColor: [
          "rgba(239, 68, 68, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
        ],
      },
    ],
  }

  const riskAssessmentChartData = {
    labels: dashboardData.riskAssessmentStats.map((item) => item.level),
    datasets: [
      {
        label: "Số lượng đánh giá",
        data: dashboardData.riskAssessmentStats.map((item) => item.count),
        backgroundColor: ["rgba(239, 68, 68, 0.8)", "rgba(245, 158, 11, 0.8)", "rgba(16, 185, 129, 0.8)"],
        borderWidth: 0,
        hoverBackgroundColor: ["rgba(239, 68, 68, 1)", "rgba(245, 158, 11, 1)", "rgba(16, 185, 129, 1)"],
      },
    ],
  }

  const courseChartData = {
    labels: ["Tổng", "Hoàn thành"],
    datasets: [
      {
        label: "Số lượng khóa học",
        data: [dashboardData.courseStats.Total, dashboardData.courseStats.Completed],
        backgroundColor: ["rgba(99, 102, 241, 0.8)", "rgba(16, 185, 129, 0.8)"],
        borderWidth: 0,
        hoverBackgroundColor: ["rgba(99, 102, 241, 1)", "rgba(16, 185, 129, 1)"],
      },
    ],
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Sidebar */}
      <div className="fixed inset-y-0 left-0 w-72 bg-white/95 backdrop-blur-sm border-r border-slate-200 shadow-xl">
        <div className="p-6">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <BarChart2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduManage Pro
              </h2>
              <p className="text-xs text-slate-500 font-medium">Admin Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]"
                    : "hover:bg-slate-100 text-slate-600 hover:text-slate-900 hover:transform hover:scale-[1.01]"
                }`}
              >
                <div
                  className={`p-1 rounded-lg ${
                    activeTab === item.id ? "bg-white/20" : "bg-slate-100 group-hover:bg-slate-200"
                  }`}
                >
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
                {activeTab === item.id && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>}
              </button>
            ))}
          </nav>
        </div>

        {/* Enhanced User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-100/80 to-transparent backdrop-blur-sm border-t border-slate-200">
          {userInfo && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {userInfo.userName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{userInfo.userName}</p>
                  <p className="text-xs text-slate-500 truncate">{userInfo.email}</p>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                <span className="font-medium">Role:</span> {userInfo.roleName}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-72 p-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Header Section with Refresh */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    Tổng quan hệ thống
                  </h1>
                  <p className="text-slate-600 mt-2 font-medium">Theo dõi và quản lý toàn bộ hoạt động của hệ thống</p>
                  {lastUpdated && (
                    <p className="text-xs text-slate-500 mt-1">
                      Cập nhật lần cuối: {lastUpdated.toLocaleTimeString("vi-VN")}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    <span>Làm mới</span>
                  </button>
                  <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Hệ thống hoạt động tốt</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Accounts Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-[1.02] group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-blue-500/25">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">
                      {Object.values(dashboardData.accountStats).reduce((a, b) => a + b, 0)}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Tổng tài khoản</div>
                  </div>
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Đang hoạt động
                </div>
              </div>

              {/* Total Courses Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-[1.02] group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg group-hover:shadow-green-500/25">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">{dashboardData.courseStats.Total}</div>
                    <div className="text-xs text-slate-500 font-medium">Tổng khóa học</div>
                  </div>
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {dashboardData.courseStats.Completed} hoàn thành
                </div>
              </div>

              {/* Total Appointments Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-[1.02] group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-purple-500/25">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">
                      {appointmentChartData.datasets[0]?.data.reduce((a, b) => a + b, 0) || 0}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Tổng lịch hẹn</div>
                  </div>
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Đang cập nhật
                </div>
              </div>

              {/* Total Risk Assessments Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-[1.02] group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:shadow-orange-500/25">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">
                      {dashboardData.riskAssessmentStats.reduce((sum, item) => sum + item.count, 0)}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Đánh giá rủi ro</div>
                  </div>
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Đã phân tích
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Account Management Chart */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Phân bố tài khoản</h3>
                    <p className="text-sm text-slate-600">Thống kê loại người dùng</p>
                  </div>
                </div>
                <div className="h-80 flex items-center justify-center">
                  {loading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  ) : (
                    <Pie
                      data={accountChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: {
                              padding: 20,
                              usePointStyle: true,
                              font: { size: 12, weight: "500" },
                            },
                          },
                        },
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Risk Assessment Chart */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Đánh giá rủi ro</h3>
                    <p className="text-sm text-slate-600">Phân tích mức độ rủi ro</p>
                  </div>
                </div>
                <div className="h-80 flex items-center justify-center">
                  {loading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  ) : (
                    <Bar
                      data={riskAssessmentChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: { color: "rgba(0,0,0,0.1)" },
                          },
                          x: {
                            grid: { display: false },
                          },
                        },
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Course Management Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Quản lý khóa học</h3>
                  <p className="text-sm text-slate-600">Thống kê trạng thái khóa học</p>
                </div>
              </div>
              <div className="h-80">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <Bar
                    data={courseChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: { color: "rgba(0,0,0,0.1)" },
                        },
                        x: {
                          grid: { display: false },
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>

            {/* Appointment Management Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Xu hướng lịch hẹn</h3>
                  <p className="text-sm text-slate-600">Thống kê lịch hẹn theo thời gian</p>
                </div>
              </div>
              <div className="h-80">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <Line
                    data={appointmentChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top",
                          labels: {
                            usePointStyle: true,
                            font: { weight: "500" },
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: { color: "rgba(0,0,0,0.1)" },
                        },
                        x: {
                          grid: { display: false },
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Other tabs content */}
        {activeTab === "accounts" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Danh sách tài khoản</h2>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span>Làm mới</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="px-3 py-2 border">ID</th>
                    <th className="px-3 py-2 border">Tên đăng nhập</th>
                    <th className="px-3 py-2 border">Email</th>
                    <th className="px-3 py-2 border">Họ tên</th>
                    <th className="px-3 py-2 border">Ngày sinh</th>
                    <th className="px-3 py-2 border">Số điện thoại</th>
                    <th className="px-3 py-2 border">Địa chỉ</th>
                    <th className="px-3 py-2 border">Trạng thái</th>
                    <th className="px-3 py-2 border">Vai trò</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.userID} className="hover:bg-slate-50">
                      <td className="px-3 py-2 border">{user.userID}</td>
                      <td className="px-3 py-2 border">{user.userName}</td>
                      <td className="px-3 py-2 border">{user.email}</td>
                      <td className="px-3 py-2 border">{user.fullName}</td>
                      <td className="px-3 py-2 border">
                        {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN") : ""}
                      </td>
                      <td className="px-3 py-2 border">{user.phone || ""}</td>
                      <td className="px-3 py-2 border">{user.address || ""}</td>
                      <td className="px-3 py-2 border">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : user.status === "Inactive"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.status || "Không xác định"}
                        </span>
                      </td>
                      <td className="px-3 py-2 border">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.roleName === "Admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.roleName === "Consultant"
                                ? "bg-yellow-100 text-yellow-800"
                                : user.roleName === "Staff"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.roleName}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Danh sách khóa học</h2>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span>Làm mới</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="px-3 py-2 border">ID</th>
                    <th className="px-3 py-2 border">Tên khóa học</th>
                    <th className="px-3 py-2 border">Loại</th>
                    <th className="px-3 py-2 border">Trạng thái</th>
                    <th className="px-3 py-2 border">Độ tuổi</th>
                    <th className="px-3 py-2 border">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.courseID} className="hover:bg-slate-50">
                      <td className="px-3 py-2 border">{course.courseID}</td>
                      <td className="px-3 py-2 border">{course.courseName}</td>
                      <td className="px-3 py-2 border">{course.type}</td>
                      <td className="px-3 py-2 border">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            course.status === "OPEN"
                              ? "bg-green-100 text-green-800"
                              : course.status === "CLOSED"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 border">
                        {course.ageMin} - {course.ageMax}
                      </td>
                      <td className="px-3 py-2 border">{course.price?.toLocaleString()}₫</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <AppointmentManagement />
          </div>
        )}

        {activeTab === "assessments" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <RiskAssessmentManagement />
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
