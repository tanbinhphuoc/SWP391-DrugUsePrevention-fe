"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Shield,
  Heart,
  BookOpen,
  Users,
  Target,
  Star,
  Clock,
  CheckCircle,
  PlayCircle,
  Search,
  ShieldCheck,
  Home,
  Bookmark,
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

  // Check login and fetch profile
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
        return <Clock className="w-5 h-5 text-gray-500" />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 relative overflow-hidden">
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
        <div className="flex flex-col lg:flex-row items-center justify-between mb-8 gap-4">
          <button
            onClick={handleGoHome}
            className="group flex items-center space-x-3 px-6 py-3 bg-white/90 backdrop-blur-sm text-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300"
          >
            <Home className="w-5 h-5 text-blue-600" />
            <span className="font-medium group-hover:text-blue-600 transition-colors">Về trang chủ</span>
          </button>
          <div className="flex items-center space-x-4">
            <div className="px-6 py-3 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 text-white rounded-2xl shadow-xl border-2 border-white/20 backdrop-blur-sm animate-pulse">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                <span className="font-bold text-sm">🎁 Hoàn toàn miễn phí!</span>
              </div>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl text-sm font-medium shadow-lg">
              <span>🎓 {userAge ? `Độ tuổi: ${userAge}` : "Đang tải..."}</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white rounded-full shadow-2xl mb-6 transform hover:scale-105 transition-transform duration-300">
            <Shield className="w-7 h-7" />
            <span className="font-bold text-xl">Hỗ trợ Phòng chống Ma túy</span>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6 leading-tight">
            Khóa học Phòng chống Ma túy
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6">
            Cùng trang bị kiến thức phòng chống ma túy, bảo vệ bản thân và cộng đồng. Mỗi khóa học bao gồm video bài
            giảng thực tế, bạn có thể học theo tốc độ riêng.
          </p>
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-50 border-2 border-amber-200 rounded-2xl shadow-lg">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="text-amber-700 font-medium">
              📹 Mỗi bài học là video thực tế - Học xong là hoàn thành!
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-emerald-400 to-green-400 rounded-xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{purchasedCourses.length}</p>
                <p className="text-gray-600 font-medium">Khóa học của tôi</p>
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{allCourses.length}</p>
                <p className="text-gray-600 font-medium">Khóa học có sẵn</p>
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl shadow-lg">
                <PlayCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">Video</p>
                <p className="text-gray-600 font-medium">Bài giảng trực quan</p>
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border-2 border-cyan-100 hover:border-cyan-300 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">100%</p>
                <p className="text-gray-600 font-medium">Cam kết chất lượng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchased Courses Section */}
        <section className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-2 border-emerald-100 mb-12">
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-xl">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-800">Khóa học của tôi</h2>
              <p className="text-gray-600 text-lg">Tiếp tục hành trình học tập của bạn</p>
            </div>
          </div>

          {purchasedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {purchasedCourses.map((course) => (
                <div
                  key={course.id}
                  className="group relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-8 rounded-3xl border-3 border-emerald-200 hover:border-emerald-400 transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:-translate-y-2"
                >
                  <div className="absolute top-6 right-6">{getStatusIcon(course.status)}</div>
                  <div className="absolute -top-3 -left-3 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full shadow-lg animate-pulse"></div>
                  <div className="flex items-start space-x-6">
                    <div className="p-4 bg-gradient-to-r from-emerald-400 to-green-400 rounded-2xl shadow-lg">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-2xl text-gray-800 mb-3">{course.name}</h3>
                      <div className="flex items-center space-x-3 mb-4">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                            course.status === "CONFIRMED"
                              ? "bg-green-100 text-green-700 border-2 border-green-200"
                              : course.status === "FREE"
                                ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-200"
                                : "bg-yellow-100 text-yellow-700 border-2 border-yellow-200"
                          }`}
                        >
                          {course.status === "FREE" ? "Miễn phí" : course.status}
                        </span>
                        {(course.status === "CONFIRMED" || course.status === "FREE") && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            📹 Video sẵn sàng
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        {(course.progress === "Chưa bắt đầu" || course.status === "FREE") && (
                          <button
                            onClick={() => handleStartLearning(course.id)}
                            className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                          >
                            <PlayCircle className="w-5 h-5" />
                            <span className="font-semibold">Bắt đầu học</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <EmptyStateIllustration />
              <h3 className="text-2xl font-bold text-gray-700 mb-4 mt-8">Bạn chưa đăng ký khóa học nào</h3>
              <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
                Hãy khám phá các khóa học phòng chống ma túy để bắt đầu hành trình học tập của bạn.
              </p>
              <button
                onClick={() => document.getElementById("all-courses").scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-semibold"
              >
                <TrendingUp className="w-5 h-5" />
                <span>Khám phá khóa học ngay</span>
              </button>
            </div>
          )}
        </section>

        {/* All Courses Section */}
        <section
          id="all-courses"
          className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-2 border-blue-100"
        >
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-xl">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-800">Khóa học Phòng chống Ma túy</h2>
              <p className="text-gray-600 text-lg">Khám phá kiến thức bảo vệ bản thân và cộng đồng qua video thực tế</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl mb-8 border-2 border-gray-200 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm khóa học phòng chống ma túy..."
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-lg font-medium shadow-lg bg-white"
                />
              </div>
              <select
                value={filterPrice}
                onChange={(e) => setFilterPrice(e.target.value)}
                className="px-4 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium shadow-lg bg-white"
              >
                <option value="all">💰 Tất cả mức giá</option>
                <option value="free">🆓 Miễn phí</option>
                <option value="paid">💳 Trả phí</option>
              </select>
            </div>
          </div>

          {/* Course Results */}
          {filteredAllCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAllCourses.map((course) => {
                const isPurchased = purchasedCourses.some((p) => p.id === course.id)
                return (
                  <div
                    key={course.id}
                    className="group relative bg-gradient-to-br from-white via-gray-50 to-blue-50 p-8 rounded-3xl border-3 border-gray-200 hover:border-blue-400 transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:-translate-y-3 hover:rotate-1"
                  >
                    <div className="absolute top-6 right-6">
                      <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110 border border-gray-200 hover:border-red-300">
                        <Bookmark className="w-5 h-5 text-gray-400 hover:text-red-400 transition-colors" />
                      </button>
                    </div>
                    <div className="relative mb-6">
                      <div className="aspect-video bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center relative">
                          <PlayCircle className="w-16 h-16 text-white/90 animate-pulse" />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
                          <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-xl text-sm font-bold text-gray-700">
                            📹 Video thực tế
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-bold text-2xl text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                        {course.name}
                      </h3>
                      <p className="text-gray-600 line-clamp-3 leading-relaxed">
                        {course.description ||
                          "Khóa học cung cấp kiến thức cần thiết về phòng chống ma túy thông qua các video bài giảng thực tế, giúp bạn hiểu rõ hơn về tác hại và cách bảo vệ bản thân."}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
                          🎥 Video HD
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                          ⏱️ Tự học
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
                          🏆 Chứng chỉ
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                        <div className="text-center">
                          {course.price === 0 ? (
                            <span className="text-2xl font-bold text-green-600">🆓 Miễn phí</span>
                          ) : (
                            <div>
                              <span className="text-2xl font-bold text-blue-600">
                                {course.price.toLocaleString("vi-VN")}₫
                              </span>
                              <p className="text-sm text-gray-500">Một lần thanh toán</p>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          {isPurchased ? (
                            <div className="flex flex-col items-end space-y-2">
                              <span className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl font-semibold border-2 border-green-200">
                                <CheckCircle className="w-4 h-4" />
                                <span>Đã sở hữu</span>
                              </span>
                              <button
                                onClick={() => handleStartLearning(course.id)}
                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                              >
                                <PlayCircle className="w-4 h-4" />
                                <span>Xem video</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handlePurchase(course.id)}
                              disabled={loading}
                              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                            >
                              {loading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Heart className="w-4 h-4" />
                              )}
                              <span>
                                {loading ? "Đang xử lý..." : course.price === 0 ? "Đăng ký miễn phí" : "Đăng ký ngay"}
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
            <div className="text-center py-16">
              <div className="w-48 h-48 mx-auto mb-8 bg-gradient-to-br from-gray-100 via-slate-100 to-zinc-100 rounded-full flex items-center justify-center shadow-xl">
                <Search className="w-20 h-20 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">
                {search ? `Không tìm thấy khóa học phù hợp với từ khóa "${search}"` : "Chưa có khóa học nào"}
              </h3>
              <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
                {search
                  ? "Hãy thử tìm kiếm với từ khóa khác hoặc xem tất cả khóa học có sẵn."
                  : "Hiện tại chưa có khóa học nào phù hợp với độ tuổi của bạn."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setSearch("")}
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-semibold"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Xem tất cả khóa học</span>
                </button>
                <button
                  onClick={() => {
                    setFilterPrice("free")
                    setSearch("")
                  }}
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-semibold"
                >
                  <Heart className="w-5 h-5" />
                  <span>Khóa học miễn phí</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default UserCourses
