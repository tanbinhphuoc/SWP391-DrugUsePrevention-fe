// UserCourses.jsx (Updated to navigate to CourseLearning and fetch courses by age)
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
    <section className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">📘 Khóa học đã mua</h2>
      <ul className="space-y-4 mb-6">
        {purchasedCourses.length > 0 ? (
          purchasedCourses.map((course) => (
            <li key={course.id} className="p-3 border rounded bg-gray-50">
              <h3 className="font-medium">{course.name}</h3>
              <p className="text-sm">Trạng thái: {course.status}</p>
              <span className="text-blue-600 font-medium">
                {course.progress === "Chưa bắt đầu" ? (
                  <button
                    onClick={() => handleStartLearning(course.id)}
                    className="text-blue-500 hover:underline"
                  >
                    Bắt đầu
                  </button>
                ) : (
                  course.progress
                )}
              </span>
            </li>
          ))
        ) : (
          <p>Chưa có khóa học đã mua.</p>
        )}
      </ul>

      <h2 className="text-lg font-semibold mb-2">📘 Tất cả khóa học</h2>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm kiếm khóa học..."
        className="w-full p-2 mb-4 border rounded"
      />
      <ul className="space-y-4">
        {filteredAllCourses.map((course) => {
          const isPurchased = purchasedCourses.some((p) => p.id === course.id);
          return (
            <li key={course.id} className="p-3 border rounded bg-gray-50">
              <h3 className="font-medium">{course.name}</h3>
              <p className="text-sm text-gray-600">{course.description}</p>
              <p className="text-sm">Giá: {course.price} VND</p>
              {isPurchased ? (
                <span className="text-green-600">Đã mua</span>
              ) : (
                <button
                  onClick={() => handlePurchase(course.id)}
                  disabled={loading}
                  className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {loading ? "Đang xử lý..." : "Mua"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
};

export default UserCourses;