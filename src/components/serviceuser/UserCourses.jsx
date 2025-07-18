import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Hero from "../home/Hero";

const UserCourses = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [allCourses, setAllCourses] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userAge, setUserAge] = useState(null);

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
                progress: p.status === "CONFIRMED" ? "Chưa bắt đầu" : p.paymentStatus, // Placeholder progress
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

  const filteredAllCourses = allCourses.filter((course) =>
    course.name.toLowerCase().includes(search.toLowerCase())
  );

  const BackToHomeButton = () => (
    <button
      onClick={() => navigate("/")}
      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-lg hover:from-gray-700 hover:to-gray-900 transition-all duration-300 shadow-md hover:shadow-lg mb-6"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Quay lại trang chủ</span>
    </button>
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <BackToHomeButton />
        <section className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <span role="img" aria-label="book">📘</span>
            <span>Khóa học đã mua</span>
          </h2>
          {purchasedCourses.length > 0 ? (
            <ul className="space-y-4">
              {purchasedCourses.map((course) => (
                <li
                  key={course.id}
                  className="p-4 border-l-4 border-blue-500 bg-gray-50 rounded-r-lg hover:bg-gray-100 transition-all duration-300 shadow-sm"
                >
                  <h3 className="font-semibold text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-600">Trạng thái: {course.status}</p>
                  <span className="text-blue-600 font-medium">
                    {course.progress === "Chưa bắt đầu" ? (
                      <button
                        onClick={() => handleStartLearning(course.id)}
                        className="text-blue-500 hover:text-blue-700 underline transition-colors"
                      >
                        Bắt đầu
                      </button>
                    ) : (
                      course.progress
                    )}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Chưa có khóa học đã mua.</p>
          )}
        </section>

        <section className="mt-8 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <span role="img" aria-label="book">📘</span>
            <span>Tất cả khóa học</span>
          </h2>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm khóa học..."
            className="w-full p-3 mb-6 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
          />
          {filteredAllCourses.length > 0 ? (
            <ul className="space-y-4">
              {filteredAllCourses.map((course) => {
                const isPurchased = purchasedCourses.some((p) => p.id === course.id);
                return (
                  <li
                    key={course.id}
                    className="p-4 border-l-4 border-indigo-500 bg-gray-50 rounded-r-lg hover:bg-gray-100 transition-all duration-300 shadow-sm"
                  >
                    <h3 className="font-semibold text-gray-900">{course.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                    <p className="text-sm text-gray-700">Giá: {course.price} VND</p>
                    {isPurchased ? (
                      <span className="text-green-600 font-medium">Đã mua</span>
                    ) : (
                      <button
                        onClick={() => handlePurchase(course.id)}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg text-white ${
                          loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                        } transition-all duration-300`}
                      >
                        {loading ? "Đang xử lý..." : "Mua"}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Không tìm thấy khóa học phù hợp.</p>
          )}
        </section>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserCourses;