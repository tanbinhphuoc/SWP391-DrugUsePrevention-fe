// UserCourses.jsx (Updated for enhanced UI and drug prevention theme)
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BookOpen, CheckCircle, ShoppingCart, Search, Info, Award, PlayCircle } from "lucide-react"; // Added relevant icons

const UserCourses = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [allCourses, setAllCourses] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userAge, setUserAge] = useState(null);

  const token = localStorage.getItem("token") || sessionStorage.getItem("tempToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:7092/api/Users/GetProfileMember", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
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
  }, [token]);

  useEffect(() => {
    if (userAge !== null) {
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
              progress: p.status === "CONFIRMED" ? "Chưa bắt đầu" : p.paymentStatus, // Placeholder progress
            }))
          );
        }
      } catch (error) {
        toast.error("Lỗi tải khóa học đã mua.");
      }
    };

    fetchPurchasedCourses();
  }, [token]);

  const handlePurchase = async (courseId) => {
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
    navigate(`/courses/${courseId}/learn`);
  };

  const filteredAllCourses = allCourses.filter((course) =>
    course.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100">
      <div className="flex items-center mb-6 border-b pb-4 border-blue-200">
        <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Khóa học của bạn</h2>
      </div>

      {/* Purchased Courses Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
          <Award className="w-6 h-6 text-green-500 mr-2" /> Khóa học đã đăng ký
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchasedCourses.length > 0 ? (
            purchasedCourses.map((course) => (
              <div key={course.id} className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl shadow-md border border-blue-200 hover:shadow-lg transition-shadow duration-300">
                <h4 className="font-bold text-lg text-blue-800 mb-2">{course.name}</h4>
                <p className="text-sm text-gray-600 mb-3 flex items-center">
                  <Info className="w-4 h-4 mr-1 text-blue-500" /> Trạng thái: <span className="ml-1 font-medium text-blue-700">{course.status}</span>
                </p>
                <div className="flex justify-between items-center">
                  {course.progress === "Chưa bắt đầu" ? (
                    <button
                      onClick={() => handleStartLearning(course.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors duration-300 flex items-center"
                    >
                      <PlayCircle className="w-5 h-5 mr-2" /> Bắt đầu học
                    </button>
                  ) : (
                    <span className="text-green-600 font-medium flex items-center">
                      <CheckCircle className="w-5 h-5 mr-1" /> Đã hoàn thành
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic col-span-full">Bạn chưa đăng ký khóa học nào.</p>
          )}
        </div>
      </div>

      {/* All Courses Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
          <BookOpen className="w-6 h-6 text-purple-500 mr-2" /> Khám phá khóa học
        </h3>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm khóa học..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAllCourses.length > 0 ? (
            filteredAllCourses.map((course) => {
              const isPurchased = purchasedCourses.some((p) => p.id === course.id);
              return (
                <div key={course.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xl text-gray-900 mb-2">{course.name}</h4>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                    <p className="text-base font-semibold text-blue-700 mb-4">Giá: {course.price.toLocaleString('vi-VN')} VND</p>
                  </div>
                  <div className="mt-auto"> {/* Aligns button to the bottom */}
                    {isPurchased ? (
                      <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4 mr-1" /> Đã đăng ký
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePurchase(course.id)}
                        disabled={loading}
                        className={`w-full flex items-center justify-center px-5 py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
                          loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg"
                        }`}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-5 h-5 mr-2" /> Đăng ký ngay
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 italic col-span-full">Không tìm thấy khóa học nào phù hợp.</p>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
};

export default UserCourses;