"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Shield,
  Heart,
  BookOpen,
  Users,
  Star,
  Clock,
  CheckCircle,
  PlayCircle,
  Search,
  ShieldCheck,
  AlertTriangle,
  Home,
  TrendingUp,
} from "lucide-react"

const UserCourses = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [allCourses, setAllCourses] = useState([])
  const [purchasedCourses, setPurchasedCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [userAge, setUserAge] = useState(null)
  const [filterPrice, setFilterPrice] = useState("all")
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  const token = localStorage.getItem("token") || sessionStorage.getItem("tempToken")

  // Show notification function
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000)
  }

  // Check login when component mounts
  useEffect(() => {
    if (!token) {
      showNotification("Vui lòng đăng nhập để truy cập trang này!", "error")
      navigate("/login", { replace: true })
      return
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:7092/api/Users/GetProfileMember", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) throw new Error("Failed to fetch profile")
        const data = await response.json()
        const dob = new Date(data.dateOfBirth)
        const today = new Date()
        let age = today.getFullYear() - dob.getFullYear()
        const monthDiff = today.getMonth() - dob.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--
        setUserAge(age)
      } catch (error) {
        showNotification("Lỗi tải thông tin người dùng.", "error")
      }
    }

    fetchProfile()
  }, [token, navigate])

  // Fetch courses by age
  useEffect(() => {
    if (userAge !== null && token) {
      const fetchAllCourses = async () => {
        try {
          const response = await fetch(`http://localhost:7092/api/Course/GetCoursesByAge?age=${userAge}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          const data = await response.json()
          if (data.success) {
            setAllCourses(
              data.data.map((c) => ({
                id: c.courseID,
                name: c.courseName,
                description: c.description,
                price: c.price,
              })),
            )
            if (data.data.length === 0) {
              showNotification("Không có khóa học phù hợp với độ tuổi của bạn.", "info")
            }
          }
        } catch (error) {
          showNotification("Lỗi tải khóa học.", "error")
        }
      }

      fetchAllCourses()
    }
  }, [token, userAge])

  // Fetch purchased courses
  useEffect(() => {
    if (token) {
      const fetchPurchasedCourses = async () => {
        try {
          const response = await fetch("http://localhost:7092/api/CourseRegistration/user", {
            headers: { Authorization: `Bearer ${token}` },
          })
          const data = await response.json()
          if (data.success) {
            setPurchasedCourses(
              data.data.map((p) => ({
                id: p.courseID,
                name: p.courseName,
                status: p.status || "FREE",
                progress: p.status === "CONFIRMED" ? "Chưa bắt đầu" : p.paymentStatus || "Hoàn tất",
              })),
            )
          }
        } catch (error) {
          showNotification("Lỗi tải khóa học đã mua.", "error")
        }
      }

      fetchPurchasedCourses()
    }
  }, [token])

  // Handle course purchase
  const handlePurchase = async (courseId) => {
    if (!token) {
      showNotification("Vui lòng đăng nhập để mua khóa học!", "error")
      navigate("/login", { replace: true })
      return
    }
    setLoading(true)
    try {
      const response = await fetch("http://localhost:7092/api/CourseRegistration/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseID: courseId }),
      })
      const data = await response.json()
      if (data.success) {
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl
        } else {
          showNotification("Đăng ký khóa học miễn phí thành công!")
          setPurchasedCourses((prev) => [
            ...prev,
            {
              id: courseId,
              name: allCourses.find((c) => c.id === courseId)?.name || "Khóa học",
              status: "FREE",
              progress: "Chưa bắt đầu",
            },
          ])
        }
      } else {
        showNotification(data.message || "Đăng ký thất bại.", "error")
      }
    } catch (error) {
      showNotification("Lỗi đăng ký khóa học.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleStartLearning = (courseId) => {
    if (!token) {
      showNotification("Vui lòng đăng nhập để bắt đầu học!", "error")
      navigate("/login", { replace: true })
      return
    }
    navigate(`/courses/${courseId}/learn`)
  }

  const handleGoHome = () => navigate("/")

  // Filter courses
  const filteredAllCourses = allCourses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(search.toLowerCase())
    const matchesPrice =
      filterPrice === "all" ||
      (filterPrice === "free" && course.price === 0) ||
      (filterPrice === "paid" && course.price > 0)
    return matchesSearch && matchesPrice
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "FREE":
        return <ShieldCheck className="w-5 h-5 text-emerald-500" />
      default:
        return <AlertTriangle className="w-5 h-5 text-red-500" />
    }
  }

  const EmptyStateIllustration = () => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-64 h-64 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-full flex items-center justify-center shadow-2xl">
          <div className="w-48 h-48 bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 rounded-full flex items-center justify-center">
            <BookOpen className="w-24 h-24 text-blue-500" />
          </div>
        </div>
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
          <Star className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <Shield className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  const NoResultsIllustration = () => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-48 h-48 bg-gradient-to-br from-gray-100 via-slate-100 to-zinc-100 rounded-full flex items-center justify-center shadow-xl">
          <Search className="w-20 h-20 text-gray-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">?</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleGoHome}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Trang chủ</span>
              </button>
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Khóa học Phòng chống Ma túy
                  </h1>
                  <p className="text-gray-600">Bảo vệ bản thân và cộng đồng</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-sm font-medium shadow-lg">
                <span>🆓 Hoàn toàn miễn phí</span>
              </div>
              {userAge && (
                <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl text-sm font-medium shadow-lg">
                  <span>🎓 Độ tuổi: {userAge}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{purchasedCourses.length}</div>
                <div className="text-sm text-gray-600">Khóa học của tôi</div>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{allCourses.length}</div>
                <div className="text-sm text-gray-600">Khóa học có sẵn</div>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <PlayCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">Video</div>
                <div className="text-sm text-gray-600">Bài giảng trực quan</div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchased Courses Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Khóa học của tôi</h2>
              <p className="text-gray-600">Tiếp tục hành trình học tập của bạn</p>
            </div>
          </div>

          {purchasedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {purchasedCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{course.name}</h3>
                        <p className="text-sm text-gray-600">Video bài giảng</p>
                      </div>
                    </div>
                    {getStatusIcon(course.status)}
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        course.status === "CONFIRMED"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : course.status === "FREE"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                      }`}
                    >
                      {course.status === "FREE" ? "Miễn phí" : course.status}
                    </span>
                    {(course.status === "CONFIRMED" || course.status === "FREE") && (
                      <button
                        onClick={() => handleStartLearning(course.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span className="font-medium">Bắt đầu học</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <EmptyStateIllustration />
              <h3 className="text-xl font-bold text-gray-700 mb-4 mt-6">Bạn chưa đăng ký khóa học nào</h3>
              <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
                Khám phá các khóa học phòng chống ma túy để bảo vệ bản thân và cộng đồng
              </p>
              <button
                onClick={() => document.getElementById("all-courses").scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                <TrendingUp className="w-5 h-5" />
                <span>Khám phá khóa học</span>
              </button>
            </div>
          )}
        </div>

        {/* All Courses Section */}
        <div id="all-courses" className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tất cả khóa học</h2>
              <p className="text-gray-600">Khám phá kiến thức bảo vệ bản thân và cộng đồng</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-6 border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm khóa học..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 bg-white"
                />
              </div>
              <select
                value={filterPrice}
                onChange={(e) => setFilterPrice(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 bg-white"
              >
                <option value="all">Tất cả mức giá</option>
                <option value="free">Miễn phí</option>
                <option value="paid">Trả phí</option>
              </select>
            </div>
          </div>

          {/* Course Results */}
          {filteredAllCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAllCourses.map((course) => {
                const isPurchased = purchasedCourses.some((p) => p.id === course.id)
                return (
                  <div
                    key={course.id}
                    className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border-2 border-gray-200 hover:border-blue-400 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {/* Course Video Preview */}
                    <div className="relative mb-4">
                      <div className="aspect-video bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 rounded-xl shadow-lg overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center">
                          <PlayCircle className="w-12 h-12 text-white/90 animate-pulse" />
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-700">
                          📹 Video HD
                        </div>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{course.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {course.description || "Khóa học cung cấp kiến thức về phòng chống ma túy"}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          🎥 Video
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          ⏱️ Tự học
                        </span>
                      </div>

                      {/* Price and Action */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div>
                          {course.price === 0 ? (
                            <span className="text-lg font-bold text-green-600">🆓 Miễn phí</span>
                          ) : (
                            <span className="text-lg font-bold text-blue-600">
                              {course.price.toLocaleString("vi-VN")}₫
                            </span>
                          )}
                        </div>
                        <div>
                          {isPurchased ? (
                            <div className="flex flex-col gap-2">
                              <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                                <CheckCircle className="w-4 h-4" />
                                Đã sở hữu
                              </span>
                              <button
                                onClick={() => handleStartLearning(course.id)}
                                className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 text-sm font-medium"
                              >
                                <PlayCircle className="w-4 h-4" />
                                Xem video
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handlePurchase(course.id)}
                              disabled={loading}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 font-medium"
                            >
                              {loading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Heart className="w-4 h-4" />
                              )}
                              <span>
                                {loading ? "Đang xử lý..." : course.price === 0 ? "Đăng ký miễn phí" : "Đăng ký"}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <NoResultsIllustration />
              <h3 className="text-xl font-bold text-gray-700 mb-4 mt-6">
                {search ? `Không tìm thấy khóa học với từ khóa "${search}"` : "Chưa có khóa học nào"}
              </h3>
              <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
                {search
                  ? "Hãy thử tìm kiếm với từ khóa khác hoặc xem tất cả khóa học."
                  : "Hiện tại chưa có khóa học nào phù hợp với độ tuổi của bạn."}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setSearch("")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Xem tất cả</span>
                </button>
                <button
                  onClick={() => {
                    setFilterPrice("free")
                    setSearch("")
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                >
                  <Heart className="w-5 h-5" />
                  <span>Khóa học miễn phí</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserCourses
