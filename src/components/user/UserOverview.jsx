"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import {
  User,
  BookOpen,
  TrendingUp,
  Award,
  Users,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
} from "lucide-react";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

// Tách component nhỏ để hiển thị thông báo loading
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-slate-600 font-medium">Đang tải thông tin người dùng...</p>
    </div>
  </div>
);

// Tách component nhỏ để hiển thị lỗi
const ErrorMessage = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
    <div className="bg-white rounded-2xl p-8 shadow-xl border border-red-200 max-w-md w-full mx-4">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Lỗi tải dữ liệu</h3>
        <p className="text-slate-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    </div>
  </div>
);

// Tách component hiển thị thẻ thống kê
const StatCard = ({ icon: Icon, gradient, title, value, subtitle, statusIcon: StatusIcon, statusText }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-[1.02] group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 bg-gradient-to-r ${gradient} rounded-xl shadow-lg group-hover:shadow-${gradient.split('-')[1]}-500/25`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-xs text-slate-500 font-medium">{subtitle}</div>
      </div>
    </div>
    <div className="flex items-center text-sm font-medium text-blue-600">
      <StatusIcon className="h-4 w-4 mr-1" />
      {statusText}
    </div>
  </div>
);

const UserOverview = ({ userId = 5 }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Lấy token từ storage
  const getToken = useCallback(() => {
    return localStorage.getItem("token") || sessionStorage.getItem("tempToken");
  }, []);

  // Fetch dữ liệu từ API
  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) throw new Error("Không tìm thấy token xác thực");

      const response = await fetch(
        `http://localhost:7092/api/Users/GetMemberProfileWithFullOption?userId=${userId}`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log("API Response from GetMemberProfileWithFullOption:", data); // Log để debug
      // Loại bỏ các mục trùng lặp
      const uniqueRegisteredCourses = [...new Set(data.registeredCourses)];
      const uniquePreviousConsultants = data.previousConsultants?.filter(
        (consultant, index, self) =>
          index === self.findIndex((c) => c.consultantId === consultant.consultantId)
      ) || [];
      setProfileData({
        ...data,
        registeredCourses: uniqueRegisteredCourses,
        previousConsultants: uniquePreviousConsultants,
      });
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, getToken]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Tính mức độ rủi ro ma túy
  const calculateDrugRiskLevel = useMemo(() => {
    return (assessmentResults) => {
      if (!assessmentResults?.length) {
        return { level: "Không có dữ liệu", color: "gray", bgColor: "bg-gray-100" };
      }
      const latestScore = assessmentResults[assessmentResults.length - 1].score;
      if (latestScore <= 3) return { level: "Thấp", color: "green", bgColor: "bg-green-100" };
      if (latestScore <= 7) return { level: "Trung bình", color: "yellow", bgColor: "bg-yellow-100" };
      return { level: "Cao", color: "red", bgColor: "bg-red-100" };
    };
  }, []);

  // Tạo dữ liệu cho biểu đồ xu hướng đánh giá
  const assessmentChartData = useMemo(() => {
    if (!profileData?.assessmentResults?.length) return { labels: [], datasets: [] };

    const sortedResults = [...profileData.assessmentResults].sort(
      (a, b) => new Date(a.takeTime) - new Date(b.takeTime)
    );

    return {
      labels: sortedResults.map((_, index) => `Lần ${index + 1}`),
      datasets: [
        {
          label: "Điểm đánh giá",
          data: sortedResults.map((result) => result.score),
          borderColor: "rgba(59, 130, 246, 0.8)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          pointBackgroundColor: "rgba(59, 130, 246, 1)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [profileData?.assessmentResults]);

  // Tạo dữ liệu cho biểu đồ tiến độ khóa học
  const courseProgressData = useMemo(() => {
    const registered = profileData?.registeredCourses?.length || 0;
    const completed = profileData?.completedCourses?.length || 0;
    const inProgress = registered - completed;

    return {
      labels: ["Đã hoàn thành", "Đang học", "Chưa bắt đầu"],
      datasets: [
        {
          data: [completed, inProgress, 0],
          backgroundColor: ["rgba(16, 185, 129, 0.8)", "rgba(245, 158, 11, 0.8)", "rgba(156, 163, 175, 0.8)"],
          borderWidth: 0,
          hoverBackgroundColor: ["rgba(16, 185, 129, 1)", "rgba(245, 158, 11, 1)", "rgba(156, 163, 175, 1)"],
        },
      ],
    };
  }, [profileData?.registeredCourses, profileData?.completedCourses]);

  // Định dạng thời gian
  const formatDateTime = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
          dateStyle: "short",
          timeStyle: "short",
        })
      : "Chưa cập nhật";

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={fetchProfileData} />;

  const riskData = calculateDrugRiskLevel(profileData?.assessmentResults);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Tổng quan người dùng
              </h1>
              <p className="text-slate-600 mt-2 font-medium">Thông tin chi tiết và tiến độ học tập</p>
              {lastUpdated && (
                <p className="text-xs text-slate-500 mt-1">
                  Cập nhật lần cuối: {formatDateTime(lastUpdated)}
                </p>
              )}
            </div>
            <button
              onClick={fetchProfileData}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>Làm mới</span>
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-start space-x-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {profileData?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{profileData?.fullName || "Chưa cung cấp tên"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2 text-slate-600">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{profileData?.email || "Chưa cung cấp email"}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{profileData?.phone || "Chưa cung cấp số điện thoại"}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{profileData?.address || "Chưa cung cấp địa chỉ"}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{profileData?.age ? `${profileData.age} tuổi` : "Chưa cung cấp tuổi"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={BookOpen}
            gradient="from-blue-500 to-blue-600"
            title={profileData?.registeredCourses?.length || 0}
            value={profileData?.registeredCourses?.length || 0}
            subtitle="Khóa học đã đăng ký"
            statusIcon={TrendingUp}
            statusText="Đang tham gia"
          />
          <StatCard
            icon={Award}
            gradient="from-green-500 to-green-600"
            title={profileData?.completedCourses?.length || 0}
            value={profileData?.completedCourses?.length || 0}
            subtitle="Khóa học hoàn thành"
            statusIcon={CheckCircle}
            statusText="Đã hoàn thành"
          />
          <StatCard
            icon={Target}
            gradient="from-purple-500 to-purple-600"
            title={profileData?.assessmentResults?.length || 0}
            value={profileData?.assessmentResults?.length || 0}
            subtitle="Lần đánh giá"
            statusIcon={Clock}
            statusText="Đã thực hiện"
          />
          <StatCard
            icon={AlertTriangle}
            gradient={`from-${riskData.color}-500 to-${riskData.color}-600`}
            title={riskData.level}
            value={riskData.level}
            subtitle="Mức độ rủi ro"
            statusIcon={AlertTriangle}
            statusText="Đánh giá gần nhất"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assessment Trend Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Xu hướng đánh giá</h3>
                <p className="text-sm text-slate-600">Biểu đồ điểm số qua các lần đánh giá</p>
              </div>
            </div>
            <div className="h-80">
              {assessmentChartData.labels.length > 0 ? (
                <Line
                  data={assessmentChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: "top", labels: { usePointStyle: true, font: { weight: "500" } } } },
                    scales: { y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.1)" } }, x: { grid: { display: false } } },
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <div className="text-center">
                    <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Chưa có dữ liệu đánh giá</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Course Progress Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Tiến độ khóa học</h3>
                <p className="text-sm text-slate-600">Phân bố trạng thái học tập</p>
              </div>
            </div>
            <div className="h-80">
              {(profileData?.registeredCourses?.length || 0) > 0 ? (
                <Doughnut
                  data={courseProgressData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom", labels: { padding: 20, usePointStyle: true, font: { size: 12, weight: "500" } } },
                    },
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <div className="text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Chưa đăng ký khóa học nào</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Registered Courses List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Khóa học đã đăng ký</h3>
                <p className="text-sm text-slate-600">Danh sách các khóa học đang tham gia</p>
              </div>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {profileData?.registeredCourses?.length > 0 ? (
                profileData.registeredCourses.map((course, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{course}</p>
                    </div>
                    <div className="text-blue-600">
                      <Clock className="h-4 w-4" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa đăng ký khóa học nào</p>
                </div>
              )}
            </div>
          </div>

          {/* Previous Consultants */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Tư vấn viên đã gặp</h3>
                <p className="text-sm text-slate-600">Lịch sử tư vấn và hỗ trợ</p>
              </div>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {profileData?.previousConsultants?.length > 0 ? (
                profileData.previousConsultants.map((consultant) => (
                  <div
                    key={consultant.consultantId}
                    className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {consultant.consultantName?.charAt(0)?.toUpperCase() || "C"}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{consultant.consultantName || "Chưa cung cấp tên"}</p>
                      <p className="text-sm text-slate-600">{consultant.consultantEmail || "Chưa cung cấp email"}</p>
                    </div>
                    <div className="text-purple-600">
                      <User className="h-4 w-4" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa có lịch sử tư vấn</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Assessment History */}
        {profileData?.assessmentResults?.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Lịch sử đánh giá</h3>
                <p className="text-sm text-slate-600">Chi tiết các lần đánh giá rủi ro</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Lần</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Giai đoạn</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Điểm số</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Thời gian</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Mức độ</th>
                  </tr>
                </thead>
                <tbody>
                  {profileData.assessmentResults
                    .sort((a, b) => new Date(b.takeTime) - new Date(a.takeTime))
                    .map((result, index) => {
                      const riskLevel = calculateDrugRiskLevel([result]);
                      return (
                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4">{profileData.assessmentResults.length - index}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {result.stage || "Chưa xác định"}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold">{result.score ?? "N/A"}</td>
                          <td className="py-3 px-4 text-slate-600">{formatDateTime(result.takeTime)}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${riskLevel.bgColor} text-${riskLevel.color}-800`}
                            >
                              {riskLevel.level}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOverview;