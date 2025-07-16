// UserSurveys.jsx (Enhanced with API integration, profile fetch for age, improved loading/error handling, and modal for score and navigation)
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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

  useEffect(() => {
    if (token) {
      const fetchProfile = async () => {
        setIsLoadingProfile(true);
        try {
          const response = await fetch("http://localhost:7092/api/Users/GetProfileMember", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
    } else {
      setErrorMessage("Không có token xác thực.");
      setIsLoadingProfile(false);
    }
  }, [token]);

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
            const selectedAssessment = data.data.find(a => a.assessmentType === type);
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
    if (selectedAnswers.some(a => a === null)) {
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

  const handleNavigate = (tab) => {
    setShowModal(false);
    navigate(`?tab=${tab}`);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (isLoadingProfile || isLoadingAssessments || isLoadingQuestions) {
    return <p>Đang tải bài đánh giá...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">🧠 Kết quả khảo sát</h2>
      {hasCompleted ? (
        <p>Bài test gần nhất: <strong>{score} điểm</strong> (Đã hoàn thành)</p>
      ) : questions.length > 0 ? (
        <form className="space-y-4">
          {questions.map((question, qIndex) => (
            <div key={question.questionId}>
              <p>{question.questionText}</p>
              {question.answers.map((answer) => (
                <label key={answer.answerId} className="block">
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    onChange={() => handleAnswerChange(qIndex, answer.answerId)}
                  />
                  {answer.optionText}
                </label>
              ))}
            </div>
          ))}
          <button type="button" onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
            Gửi
          </button>
        </form>
      ) : (
        <p>Không có câu hỏi cho bài đánh giá này.</p>
      )}
      <button className="mt-2 text-blue-600 underline">Xem chi tiết & đề xuất</button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Kết quả khảo sát</h3>
            <p className="mb-4">Điểm số của bạn: <strong>{score}</strong></p>
            <p className="mb-4">
              {score > 4 
                ? "Đề xuất: Bạn nên tham gia tư vấn. Nhấn để chuyển đến trang Tư vấn." 
                : "Đề xuất: Bạn nên tham gia khóa học. Nhấn để chuyển đến trang Khóa học."}
            </p>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={closeModal} 
                className="px-4 py-2 bg-gray-600 text-white rounded"
              >
                Đóng
              </button>
              <button 
                onClick={() => handleNavigate(score > 4 ? "appointments" : "courses")} 
                className="px-4 py-2 bg-blue-600 text-white rounded"
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