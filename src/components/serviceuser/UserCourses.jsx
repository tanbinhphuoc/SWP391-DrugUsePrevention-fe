import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, Shield, Heart, BookOpen, Users, Target, Star, Clock, CheckCircle, PlayCircle, Search, ShieldCheck, AlertTriangle, Home, Filter, TrendingUp, Award, Bookmark } from "lucide-react";

const UserCourses = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [allCourses, setAllCourses] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userAge, setUserAge] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all");
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null); // nếu chưa có
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const token = localStorage.getItem("token") || sessionStorage.getItem("tempToken");

  // Kiểm tra đăng nhập khi component mount
  useEffect(() => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để truy cập trang này!");
      navigate("/login", { replace: true });
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:7092/api/Users/GetProfileMember", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        const dob = new Date(data.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        setUserAge(age);
      } catch (error) {
        toast.error("Lỗi tải thông tin người dùng.");
      }
    };

    fetchProfile();
  }, [token, navigate]);

  useEffect(() => {
    if (userAge !== null && token) {
      const fetchAllCourses = async () => {
        try {
          const response = await fetch(`http://localhost:7092/api/Course/GetCoursesByAge?age=${userAge}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (data.success) {
            setAllCourses(
              data.data.map((c) => ({
                id: c.courseID,
                name: c.courseName,
                description: c.description,
                price: c.price,
              }))
            );
            if (data.data.length === 0) {
              toast.info("Không có khóa học phù hợp với độ tuổi của bạn.");
            }
          }
        } catch (error) {
          toast.error("Lỗi tải khóa học.");
        }
      };

      fetchAllCourses();
    }
  }, [token, userAge]);

  useEffect(() => {
    if (token) {
      const fetchPurchasedCourses = async () => {
        try {
          const response = await fetch("http://localhost:7092/api/CourseRegistration/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (data.success) {
            setPurchasedCourses(
              data.data.map((p) => ({
                id: p.courseID,
                name: p.courseName,
                status: p.status,
                progress: p.status === "CONFIRMED" ? "Chưa bắt đầu" : p.paymentStatus,
              }))
            );
          }
        } catch (error) {
          toast.error("Lỗi tải khóa học đã mua.");
        }
      };

      fetchPurchasedCourses();
    }
  }, [token]);

  const handlePurchase = async (courseId) => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để mua khóa học!");
      navigate("/login", { replace: true });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:7092/api/CourseRegistration/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseID: courseId }),
      });
      const data = await response.json();
      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        toast.error("Đăng ký thất bại.");
      }
    } catch (error) {
      toast.error("Lỗi đăng ký khóa học.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartLearning = (courseId) => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để bắt đầu học!");
      navigate("/login", { replace: true });
      return;
    }
    navigate(`/courses/${courseId}/learn`);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const filteredAllCourses = allCourses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "all" || course.category === filterCategory;
    const matchesLevel = filterLevel === "all" || course.level === filterLevel;
    const matchesPrice = filterPrice === "all" || 
      (filterPrice === "free" && course.price === 0) ||
      (filterPrice === "paid" && course.price > 0);
    
    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
  };

  const popularCourses = [
    "Giáo dục phòng chống ma túy học đường",
    "Hỗ trợ tâm lý cho học sinh bị ảnh hưởng",
    "Tư vấn cai nghiện cộng đồng",
    "Kỹ năng nhận biết và từ chối ma túy"
  ];

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
  );

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
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full opacity-10 blur-3xl"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-indigo-300 rounded-full opacity-40 animate-bounce delay-300"></div>
        <div className="absolute bottom-32 left-32 w-2 h-2 bg-cyan-300 rounded-full opacity-50 animate-bounce delay-700"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        
        {/* Header with Home Button and Special Offer */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-8 gap-4">
          <button
            onClick={handleGoHome}
            className="group flex items-center space-x-3 px-6 py-3 bg-white/90 backdrop-blur-sm text-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300"
          >
            <Home className="w-5 h-5 text-blue-600" />
            <span className="font-medium group-hover:text-blue-600 transition-colors">Về trang chủ</span>
          </button>
          
          {/* Special Offer Banner */}
          <div className="flex items-center space-x-4">
            <div className="px-6 py-3 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 text-white rounded-2xl shadow-xl border-2 border-white/20 backdrop-blur-sm animate-pulse">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                <span className="font-bold text-sm">🎁 Đăng ký sớm - Nhận tài liệu miễn phí!</span>
              </div>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl text-sm font-medium shadow-lg">
              <span>🎓 {userAge ? `Độ tuổi: ${userAge}` : 'Đang tải...'}</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white rounded-full shadow-2xl mb-6 transform hover:scale-105 transition-transform duration-300">
            <Shield className="w-7 h-7" />
            <span className="font-bold text-xl">Trung tâm Phòng chống Ma túy</span>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6 leading-tight">
            Khóa học Phòng chống Ma túy
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6">
            Cùng trang bị kiến thức phòng chống ma túy, bảo vệ bản thân và cộng đồng. 
            Mỗi khóa học bao gồm nhiều video bài giảng thực tế, bạn có thể học theo tốc độ riêng.
          </p>
          
          {/* Special Notice */}
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-50 border-2 border-amber-200 rounded-2xl shadow-lg">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="text-amber-700 font-medium">📹 Mỗi bài học là video thực tế - Học xong là hoàn thành!</span>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-emerald-400 to-green-400 rounded-xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{purchasedCourses.length}</p>
                <p className="text-gray-600 font-medium">Khóa học đã tham gia</p>
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
              <h2 className="text-4xl font-bold text-gray-800">Khóa học đã tham gia</h2>
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
                  <div className="absolute top-6 right-6">
                    {getStatusIcon(course.status)}
                  </div>
                  <div className="absolute -top-3 -left-3 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full shadow-lg animate-pulse"></div>
                  <div className="flex items-start space-x-6">
                    <div className="p-4 bg-gradient-to-r from-emerald-400 to-green-400 rounded-2xl shadow-lg">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-2xl text-gray-800 mb-3">{course.name}</h3>
                      <div className="flex items-center space-x-3 mb-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                          course.status === 'CONFIRMED' 
                            ? 'bg-green-100 text-green-700 border-2 border-green-200' 
                            : 'bg-yellow-100 text-yellow-700 border-2 border-yellow-200'
                        }`}>
                          {course.status}
                        </span>
                        {course.status === 'CONFIRMED' && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            📹 Video sẵn sàng
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium text-lg">
                          {course.progress === "Chưa bắt đầu" ? "🎬 Sẵn sàng xem video" : course.progress}
                        </span>
                        {course.progress === "Chưa bắt đầu" && (
                          <button
                            onClick={() => handleStartLearning(course.id)}
                            className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                          >
                            <PlayCircle className="w-5 h-5" />
                            <span className="font-semibold">Xem video</span>
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
                Chúng tôi đề xuất một số khóa học hữu ích để bạn bắt đầu hành trình học tập về phòng chống ma túy:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
                {popularCourses.map((course, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 group">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">{course}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => document.getElementById('all-courses').scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-semibold"
              >
                <TrendingUp className="w-5 h-5" />
                <span>Khám phá khóa học ngay</span>
              </button>
            </div>
          )}
        </section>

        {/* All Courses Section */}
        <section id="all-courses" className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-2 border-blue-100">
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-xl">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-800">Khóa học Phòng chống Ma túy</h2>
              <p className="text-gray-600 text-lg">Khám phá kiến thức bảo vệ bản thân và cộng đồng qua video thực tế</p>
            </div>
          </div>
          
          {/* Enhanced Search and Filters */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl mb-8 border-2 border-gray-200 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2 relative">
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
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium shadow-lg bg-white"
              >
                <option value="all">🎯 Tất cả chủ đề</option>
                <option value="prevention">🛡️ Phòng chống</option>
                <option value="education">📚 Giáo dục</option>
                <option value="family">👨‍👩‍👧‍👦 Gia đình</option>
                <option value="recovery">🤝 Cai nghiện</option>
              </select>
              <select 
                value={filterLevel} 
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-4 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium shadow-lg bg-white"
              >
                <option value="all">📊 Tất cả cấp độ</option>
                <option value="beginner">🌱 Cơ bản</option>
                <option value="intermediate">📈 Trung bình</option>
                <option value="advanced">🎓 Nâng cao</option>
              </select>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600 font-medium">Bộ lọc nâng cao</span>
              </div>
              <select 
                value={filterPrice} 
                onChange={(e) => setFilterPrice(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium shadow-md bg-white"
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
              {filteredAllCourses.map((course, index) => {
                const isPurchased = purchasedCourses.some((p) => p.id === course.id);
                const isPopular = index < 3; // First 3 courses are popular
                return (
                  <div
                    key={course.id}
                    className="group relative bg-gradient-to-br from-white via-gray-50 to-blue-50 p-8 rounded-3xl border-3 border-gray-200 hover:border-blue-400 transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:-translate-y-3 hover:rotate-1"
                  >
                    {/* Popular Badge */}
                    {isPopular && (
                      <div className="absolute -top-4 -right-4 px-4 py-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white rounded-2xl shadow-xl text-sm font-bold animate-pulse border-2 border-white">
                        <div className="flex items-center space-x-1">
                          <Award className="w-4 h-4" />
                          <span>🏆 Phổ biến</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Bookmark Button */}
                    <div className="absolute top-6 right-6">
                      <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110 border border-gray-200 hover:border-red-300">
                        <Bookmark className="w-5 h-5 text-gray-400 hover:text-red-400 transition-colors" />
                      </button>
                    </div>

                    {/* Course Thumbnail */}
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
                      {/* Floating particles around thumbnail */}
                      <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full opacity-60 animate-bounce"></div>
                      <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-blue-400 rounded-full opacity-70 animate-bounce delay-300"></div>
                    </div>

                    {/* Course Content */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-2xl text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                        {course.name}
                      </h3>
                      
                      <p className="text-gray-600 line-clamp-3 leading-relaxed">
                        {course.description || "Khóa học cung cấp kiến thức cần thiết về phòng chống ma túy thông qua các video bài giảng thực tế, giúp bạn hiểu rõ hơn về tác hại và cách bảo vệ bản thân."}
                      </p>

                      {/* Course Features */}
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

                      {/* Price and Action */}
                      <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                        <div className="text-center">
                          {course.price === 0 ? (
                            <span className="text-2xl font-bold text-green-600">🆓 Miễn phí</span>
                          ) : (
                            <div>
                              <span className="text-2xl font-bold text-blue-600">
                                {course.price.toLocaleString('vi-VN')}₫
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
                              <span>{loading ? "Đang xử lý..." : "Đăng ký ngay"}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
                  </div>
                  );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <NoResultsIllustration />
              <h3 className="text-2xl font-bold text-gray-700 mb-4 mt-8">
                {search ? `Không tìm thấy khóa học phù hợp với từ khóa "${search}"` : "Chưa có khóa học nào"}
              </h3>
              <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
                {search ? 
                  "Hãy thử tìm kiếm với từ khóa khác hoặc xem các khóa học đề xuất bên dưới." :
                  "Hiện tại chưa có khóa học nào phù hợp với độ tuổi của bạn."
                }
              </p>
              
              {/* Suggested Popular Courses */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-3xl border-2 border-blue-200 mb-8 max-w-4xl mx-auto">
                <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                  <span>Một số khóa học đang phổ biến:</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularCourses.map((course, index) => (
                    <div key={index} className="group flex items-center space-x-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold text-lg">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-700 font-semibold group-hover:text-blue-600 transition-colors text-lg">{course}</span>
                        <p className="text-gray-500 text-sm mt-1">Video thực tế • Học theo tốc độ riêng</p>
                      </div>
                      <PlayCircle className="w-8 h-8 text-blue-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

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
                    setFilterPrice("free");
                    setSearch("");
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

        {/* Video Learning Modal */}
        {showVideoModal && selectedCourse && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b-2 border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                    <PlayCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{selectedCourse.name}</h3>
                    <p className="text-gray-600">Bài học {currentLessonIndex + 1}/{mockLessons.length}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Video Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Video Area */}
                  <div className="lg:col-span-2">
                    <div className="aspect-video bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-2xl overflow-hidden shadow-2xl relative">
                      <video
                        ref={videoRef}
                        src={mockLessons[currentLessonIndex]?.videoUrl}
                        controls
                        className="w-full h-full object-cover"
                        onEnded={handleVideoEnd}
                        onTimeUpdate={handleTimeUpdate}
                      />
                      {!videoStarted && (
                        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-blue-900/30 to-indigo-900/50 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 mx-auto border-4 border-white/30 animate-pulse">
                              <PlayCircle className="w-12 h-12 text-white" />
                            </div>
                            <h4 className="text-white text-2xl font-bold mb-2">
                              {mockLessons[currentLessonIndex]?.title}
                            </h4>
                            <p className="text-white/80 text-lg">Nhấn play để bắt đầu học</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Current Lesson Info */}
                    <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border-2 border-blue-100">
                      <h4 className="text-2xl font-bold text-gray-800 mb-3">
                        {mockLessons[currentLessonIndex]?.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {mockLessons[currentLessonIndex]?.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-2 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{mockLessons[currentLessonIndex]?.duration}</span>
                          </span>
                          {lessonProgress[currentLessonIndex]?.completed && (
                            <span className="flex items-center space-x-2 text-green-600 bg-green-100 px-3 py-1 rounded-full border border-green-200">
                              <CheckCircle className="w-4 h-4" />
                              <span className="font-medium">Đã hoàn thành</span>
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => markLessonComplete(currentLessonIndex)}
                          disabled={lessonProgress[currentLessonIndex]?.completed}
                          className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                          {lessonProgress[currentLessonIndex]?.completed ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Lesson Playlist */}
                  <div className="lg:col-span-1">
                    <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-xl h-full">
                      <div className="p-6 border-b-2 border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                        <h4 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                          <BookOpen className="w-5 h-5 text-blue-500" />
                          <span>Danh sách bài học</span>
                        </h4>
                      </div>
                      <div className="p-4 max-h-96 overflow-y-auto">
                        {mockLessons.map((lesson, index) => (
                          <div
                            key={index}
                            onClick={() => setCurrentLessonIndex(index)}
                            className={`group p-4 rounded-xl mb-3 cursor-pointer transition-all duration-300 border-2 ${
                              currentLessonIndex === index
                                ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-300 shadow-lg'
                                : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg ${
                                currentLessonIndex === index
                                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                                  : 'bg-white text-gray-600 border-2 border-gray-200 group-hover:border-blue-300'
                              }`}>
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                  {lesson.title}
                                </h5>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-sm text-gray-500 flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{lesson.duration}</span>
                                  </span>
                                  {lessonProgress[index]?.completed && (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-6 border-t-2 border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-2">Tiến độ khóa học</div>
                          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${courseProgress}%` }}
                            ></div>
                          </div>
                          <div className="text-lg font-bold text-gray-800">{courseProgress}% hoàn thành</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={goToPreviousLesson}
                    disabled={currentLessonIndex === 0}
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Bài trước</span>
                  </button>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600 font-medium">
                      Bài {currentLessonIndex + 1} / {mockLessons.length}
                    </span>
                  </div>

                  <button
                    onClick={goToNextLesson}
                    disabled={currentLessonIndex === mockLessons.length - 1}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
                  >
                    <span>Bài tiếp</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default UserCourses;
                
        