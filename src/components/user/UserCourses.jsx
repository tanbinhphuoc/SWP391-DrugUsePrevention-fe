import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BookOpen, CheckCircle, Award, PlayCircle, RefreshCw } from "lucide-react";

const UserCourses = () => {
  const navigate = useNavigate();
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userAge, setUserAge] = useState(null);
  const [userId, setUserId] = useState(null);

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
        setUserId(data.userID); // Assuming the API returns userID
      } catch (error) {
        toast.error("Lỗi tải thông tin người dùng.");
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!userId) return; // Wait until userId is available

      setLoading(true);
      try {
        // Fetch uncompleted courses
        const uncompletedResponse = await fetch(`http://localhost:7092/api/Course/uncompleted/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const uncompletedData = await uncompletedResponse.json();

        // Fetch completed courses
        const completedResponse = await fetch(`http://localhost:7092/api/Course/completed/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const completedData = await completedResponse.json();

        // Combine and format courses
        const uncompletedCourses = uncompletedData.success && uncompletedData.data
          ? uncompletedData.data.map((course) => ({
              id: course.courseID,
              name: course.courseName,
              status: "Chưa hoàn thành",
              progress: "Chưa bắt đầu",
              ageMin: course.ageMin,
              ageMax: course.ageMax,
            }))
          : [];

        const completedCourses = completedData.success && completedData.data
          ? completedData.data.map((course) => ({
              id: course.courseID,
              name: course.courseName,
              status: "Đã hoàn thành",
              progress: "Hoàn thành",
              ageMin: course.ageMin,
              ageMax: course.ageMax,
            }))
          : [];

        // Filter courses based on user age only for uncompleted courses
        const filteredCourses = [
          ...uncompletedCourses.filter((course) => userAge >= course.ageMin && userAge <= course.ageMax),
          ...completedCourses, // Include all completed courses regardless of age
        ];

        setPurchasedCourses(filteredCourses);

        if (filteredCourses.length === 0) {
          toast.info("Không tìm thấy khóa học nào phù hợp hoặc đã hoàn thành.");
        }
      } catch (error) {
        toast.error("Lỗi tải danh sách khóa học.");
      } finally {
        setLoading(false);
      }
    };

    if (userAge !== null && userId !== null) {
      fetchCourses();
    }
  }, [token, userAge, userId]);

  const handleStartLearning = (courseId) => {
    navigate(`/courses/${courseId}/learn`);
  };

  return (
    <section className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100">
      <div className="flex items-center mb-6 border-b pb-4 border-blue-200">
        <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Khóa học của tôi</h2>
      </div>

      {/* Purchased Courses Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
          <Award className="w-6 h-6 text-green-500 mr-2" /> Khóa học đã đăng ký
        </h3>
        {loading ? (
          <p className="text-gray-500 italic col-span-full">Đang tải dữ liệu...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedCourses.length > 0 ? (
              purchasedCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl shadow-md border border-blue-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <h4 className="font-bold text-lg text-blue-800 mb-2">{course.name}</h4>
                  <p className="text-sm text-gray-600 mb-3 flex items-center">
                    <Award className="w-4 h-4 mr-1 text-blue-500" /> Trạng thái:{" "}
                    <span className="ml-1 font-medium text-blue-700">{course.status}</span>
                  </p>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleStartLearning(course.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors duration-300 flex items-center"
                      disabled={course.status === "Chưa hoàn thành" && course.progress === "Hoàn thành"}
                    >
                      {course.status === "Đã hoàn thành" ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2" />
                          Ôn tập
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-5 h-5 mr-2" />
                          {course.progress === "Chưa bắt đầu" ? "Bắt đầu học" : course.progress}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic col-span-full">Bạn chưa đăng ký khóa học nào hoặc không có khóa học phù hợp với độ tuổi của bạn.</p>
            )}
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
};

export default UserCourses;