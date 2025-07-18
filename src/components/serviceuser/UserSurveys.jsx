import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ArrowLeft } from "lucide-react";

const UserSurveys = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [assessmentId, setAssessmentId] = useState(null);
  const [userAge, setUserAge] = useState(null);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [score, setScore] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingAssessments, setIsLoadingAssessments] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token") || sessionStorage.getItem("tempToken");

  // Kiểm tra đăng nhập khi component mount
  useEffect(() => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để truy cập khảo sát!");
      navigate("/login", { replace: true });
      return;
    }

    const fetchProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const response = await fetch("http://localhost:7092/api/Users/GetProfileMember", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
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
        setErrorMessage("Không thể tải thông tin hồ sơ.");
      } finally {
        setIsLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [token, navigate]);

  useEffect(() => {
    if (token && userAge !== null) {
      const fetchAssessments = async () => {
        setIsLoadingAssessments(true);
        setErrorMessage(null);
        try {
          const response = await fetch("http://localhost:7092/api/Assessment/GetAllInput", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data.success) {
            setAssessments(data.data);
            const type = userAge < 18 ? "Crafft" : "Assist";
            const selectedAssessment = data.data.find((a) => a.assessmentType === type);
            if (selectedAssessment) {
              setAssessmentId(selectedAssessment.assessmentID);
            } else {
              setErrorMessage(`Không tìm thấy bài đánh giá loại "${type}" phù hợp với độ tuổi ${userAge}.`);
            }
          } else {
            setErrorMessage("Dữ liệu bài đánh giá không thành công.");
          }
        } catch (error) {
          toast.error("Lỗi tải bài đánh giá.");
          setErrorMessage("Không thể tải danh sách bài đánh giá.");
        } finally {
          setIsLoadingAssessments(false);
        }
      };
      fetchAssessments();
    }
  }, [userAge, token]);

  useEffect(() => {
    if (assessmentId && token) {
      const fetchQuestions = async () => {
        setIsLoadingQuestions(true);
        setErrorMessage(null);
        try {
          const response = await fetch(`http://localhost:7092/api/Question/GetQuestionsByAssessmentId/${assessmentId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data.success) {
            setQuestions(data.data);
            setSelectedAnswers(new Array(data.data.length).fill(null));
            if (data.data.length === 0) {
              setErrorMessage("Không có câu hỏi nào cho bài đánh giá này.");
            }
          } else {
            setErrorMessage("Dữ liệu câu hỏi không thành công.");
          }
        } catch (error) {
          toast.error("Lỗi tải câu hỏi.");
          setErrorMessage("Không thể tải câu hỏi.");
        } finally {
          setIsLoadingQuestions(false);
        }
      };
      fetchQuestions();
    }
  }, [assessmentId, token]);

  const handleAnswerChange = (questionIndex, answerId) => {
    const updated = [...selectedAnswers];
    updated[questionIndex] = answerId;
    setSelectedAnswers(updated);
  };

  const handleSubmit = async () => {
    if (selectedAnswers.some((a) => a === null)) {
      toast.error("Vui lòng trả lời tất cả câu hỏi!");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.nameid;
      const response = await fetch("http://localhost:7092/api/AssessmentResults/create-input", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          assessmentId,
          answerOptionId: selectedAnswers,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setScore(data.score);
        setHasCompleted(true);
        toast.success(data.message);
        setShowModal(true); // Show modal instead of immediate navigation
      } else {
        toast.error("Gửi thất bại!");
      }
    } catch (error) {
      toast.error("Lỗi gửi bài đánh giá.");
    }
  };

  const handleNavigate = () => {
    setShowModal(false);
    if (score > 4) {
      navigate("/UserAppointments");
    } else {
      navigate("/UserCourses");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const BackToHomeButton = () => (
    <button
      onClick={() => navigate("/")}
      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-lg hover:from-gray-700 hover:to-gray-900 transition-all duration-300 shadow-md hover:shadow-lg mb-6"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Quay lại trang chủ</span>
    </button>
  );

  if (isLoadingProfile || isLoadingAssessments || isLoadingQuestions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <p className="text-gray-700">Đang tải bài đánh giá...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <p className="text-red-600">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-3xl mx-auto">
        <BackToHomeButton />
        <section className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <span role="img" aria-label="brain">🧠</span>
            <span>Kết quả khảo sát</span>
          </h2>
          {hasCompleted ? (
            <p className="text-gray-800 mb-4">
              Bài test gần nhất: <strong>{score} điểm</strong> (Đã hoàn thành)
            </p>
          ) : questions.length > 0 ? (
            <form className="space-y-6">
              {questions.map((question, qIndex) => (
                <div key={question.questionId} className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-gray-900 font-medium mb-3">{question.questionText}</p>
                  {question.answers.map((answer) => (
                    <label key={answer.answerId} className="block ml-4 mb-2">
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        onChange={() => handleAnswerChange(qIndex, answer.answerId)}
                        className="mr-2 accent-blue-600"
                      />
                      <span className="text-gray-700">{answer.optionText}</span>
                    </label>
                  ))}
                </div>
              ))}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Gửi
              </button>
            </form>
          ) : (
            <p className="text-gray-500 italic">Không có câu hỏi cho bài đánh giá này.</p>
          )}
          {!hasCompleted && questions.length > 0 && (
            <button
              className="mt-4 text-blue-600 underline hover:text-blue-800 transition-colors"
              onClick={() => navigate("/UserAppointments")}
            >
              Xem chi tiết & đề xuất
            </button>
          )}
        </section>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Kết quả khảo sát</h3>
            <p className="text-gray-800 mb-4">Điểm số của bạn: <strong>{score}</strong></p>
            <p className="text-gray-800 mb-4">
              {score > 4
                ? "Đề xuất: Bạn nên tham gia tư vấn."
                : "Đề xuất: Bạn nên tham gia khóa học."}
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
              >
                Đóng
              </button>
              <button
                onClick={handleNavigate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
              >
                Chuyển đến {score > 4 ? "Tư vấn" : "Khóa học"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSurveys;