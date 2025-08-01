"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { ArrowLeft, PlayCircle, CheckCircle, Clock, BookOpen, Award, Home, Calendar, Target } from "lucide-react"

const CourseLearning = () => {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const [videos, setVideos] = useState([])
  const [outputAssessmentId, setOutputAssessmentId] = useState(null)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)

  const token = localStorage.getItem("token") || sessionStorage.getItem("tempToken")

  // Show notification function
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000)
  }

  // Fetch user profile to get userID
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:7092/api/Users/GetProfileMember", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }
        const data = await response.json()
        setUserId(data.userID) // Assuming the API returns userID in the response
      } catch (error) {
        showNotification("Lỗi tải thông tin người dùng.", "error")
      }
    }

    if (token) {
      fetchProfile()
    }
  }, [token])

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`http://localhost:7092/api/CourseVideo/GetByCourse/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        if (data.success) {
          setVideos(data.data)
        } else {
          showNotification("Không thể tải video khóa học.", "error")
        }
      } catch (error) {
        showNotification("Lỗi tải video khóa học.", "error")
      } finally {
        setLoading(false)
      }
    }
    if (courseId && token) {
      fetchVideos()
    }
  }, [courseId, token])

  // Fetch output assessment
  useEffect(() => {
    const fetchOutputAssessment = async () => {
      try {
        const response = await fetch(`http://localhost:7092/api/Assessment/GetAllOutput`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        if (data.success) {
          const assessment = data.data.find((a) => a.courseID === Number.parseInt(courseId))
          if (assessment) {
            setOutputAssessmentId(assessment.assessmentID)
          } else {
            showNotification("Không tìm thấy bài đánh giá đầu ra cho khóa học này.", "info")
          }
        }
      } catch (error) {
        showNotification("Lỗi tải thông tin bài đánh giá đầu ra.", "error")
      }
    }
    if (courseId && token) {
      fetchOutputAssessment()
    }
  }, [courseId, token])

  const handleBack = () => {
    navigate(-1)
  }

  const handleGoHome = () => navigate("/")

  const handleComplete = async () => {
    if (!userId) {
      showNotification("Không thể xác định thông tin người dùng.", "error")
      return
    }

    try {
      // Call the complete course API
      const response = await fetch("http://localhost:7092/api/UserCourseProgresses/complete", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify({
          userID: userId,
          courseID: Number.parseInt(courseId)
        })
      })

      const data = await response.json()

      if (data.success) {
        showNotification("Khóa học đã được đánh dấu là hoàn thành.", "success")
        if (outputAssessmentId) {
          navigate(`/output-assessment/${outputAssessmentId}`, { state: { courseId: Number.parseInt(courseId) } })
        } else {
          showNotification("Không tìm thấy bài đánh giá đầu ra.", "error")
        }
      } else {
        showNotification(data.message || "Không thể hoàn thành khóa học.", "error")
      }
    } catch (error) {
      showNotification("Lỗi khi hoàn thành khóa học.", "error")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-medium text-gray-700">Đang tải nội dung khóa học...</span>
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
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </button>
              <button
                onClick={handleGoHome}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-xl hover:from-blue-200 hover:to-indigo-200 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Home className="w-4 h-4" />
                <span>Trang chủ</span>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-green-400 text-white rounded-xl shadow-lg">
                <span className="font-bold text-sm">📚 Đang học</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Học khóa học
              </h1>
              <p className="text-gray-600 text-lg">Xem video bài giảng và hoàn thành khóa học</p>
            </div>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <PlayCircle className="w-8 h-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{videos.length}</div>
                  <div className="text-sm text-gray-600">Video bài giảng</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">Tự học</div>
                  <div className="text-sm text-gray-600">Theo tốc độ riêng</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">Đánh giá</div>
                  <div className="text-sm text-gray-600">kiểm tra sau học</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
              <PlayCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Nội dung bài học</h2>
              <p className="text-gray-600">Video bài giảng thực tế về phòng chống ma túy</p>
            </div>
          </div>

          {videos.length > 0 ? (
            <div className="space-y-8">
              {videos.map((video, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 hover:border-blue-400 p-6 transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{video.title}</h3>
                      <p className="text-gray-600 mb-4">{video.description}</p>
                    </div>
                  </div>

                  {/* Video Player */}
                  <div className="relative w-full pb-[56.25%] bg-black rounded-xl overflow-hidden shadow-2xl">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={video.videoUrl}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>

                  {/* Video Info */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        🎥 Video HD
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        📚 Bài học {index + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Có thể xem lại nhiều lần</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                <PlayCircle className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Chưa có nội dung video</h3>
              <p className="text-gray-500">Nội dung khóa học đang được cập nhật.</p>
            </div>
          )}
        </div>

        {/* Complete Button */}
        {videos.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Hoàn thành khóa học</h3>
              <p className="text-gray-600 mb-6">
                Bạn đã xem hết các video bài giảng. Hãy làm bài đánh giá để hoàn thành khóa học và nhận chứng chỉ.
              </p>
              <button
                onClick={handleComplete}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-bold text-lg"
                disabled={!userId} // Disable button if userId is not yet fetched
              >
                <CheckCircle className="w-6 h-6" />
                <span>Hoàn thành bài học</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseLearning