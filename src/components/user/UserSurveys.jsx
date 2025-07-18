import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FileText, // Icon cho khảo sát
  HelpCircle, // Icon cho câu hỏi
  CheckCircle, // Icon cho hoàn thành
  ClipboardCheck, // Icon cho kết quả
  Zap, // Icon cho khuyến nghị
  ArrowRight, // Icon cho điều hướng
} from "lucide-react"; // Import thêm các icon từ Lucide React

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
            const selectedAssessment = data.data.find((a) => a.assessmentType === type);
            if (selectedAssessment) {
              setAssessmentId(selectedAssessment.assessmentID);
            } else {
              setErrorMessage(
                `Không tìm thấy bài đánh giá loại "${type}" phù hợp với độ tuổi ${userAge}.`
              );
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
          const response = await fetch(
            `http://localhost:7092/api/Question/GetQuestionsByAssessmentId/${assessmentId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
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

  const handleNavigate = (tab) => {
    setShowModal(false);
    navigate(`?tab=${tab}`);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (isLoadingProfile || isLoadingAssessments || isLoadingQuestions) {
    return (
      <div className="flex items-center justify-center min-h-[300px] bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-700 font-medium">Đang tải bài khảo sát...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative min-h-[300px] flex items-center justify-center">
        <span className="block sm:inline">{errorMessage}</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200">
        <FileText className="w-8 h-8 text-blue-600" />
        <h2 className="text-3xl font-extrabold text-gray-800">
          Bài Khảo Sát Đánh Giá Ban Đầu
        </h2>
      </div>

      {hasCompleted ? (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-xl text-white shadow-md flex items-center space-x-4 mb-6">
          <CheckCircle className="w-8 h-8 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-semibold">Bạn đã hoàn thành khảo sát!</h3>
            <p className="mt-1 text-emerald-100">
              Bài test gần nhất của bạn:{" "}
              <strong className="text-2xl font-bold">{score} điểm</strong>
            </p>
            <p className="mt-2 text-emerald-100">
              Cảm ơn bạn đã dành thời gian hoàn thành bài khảo sát này.
            </p>
          </div>
        </div>
      ) : questions.length > 0 ? (
        <div className="space-y-8">
          <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-800 mb-3 flex items-center space-x-2">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              <span>Hướng dẫn khảo sát</span>
            </h3>
            <p className="text-gray-700">
              Vui lòng đọc kỹ và trả lời tất cả các câu hỏi một cách trung thực. Bài khảo sát này
              giúp chúng tôi hiểu rõ hơn về nhu cầu của bạn để đưa ra những hỗ trợ tốt nhất.
            </p>
          </div>

          <form className="space-y-6">
            {questions.map((question, qIndex) => (
              <div
                key={question.questionId}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
              >
                <p className="font-semibold text-lg text-gray-800 mb-4 flex items-start space-x-2">
                  <span className="text-blue-600">Câu {qIndex + 1}:</span>{" "}
                  <span>{question.questionText}</span>
                </p>
                <div className="space-y-3">
                  {question.answers.map((answer) => (
                    <label
                      key={answer.answerId}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 
                      ${
                        selectedAnswers[qIndex] === answer.answerId
                          ? "bg-blue-100 border-blue-500 shadow-sm"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        value={answer.answerId}
                        checked={selectedAnswers[qIndex] === answer.answerId}
                        onChange={() => handleAnswerChange(qIndex, answer.answerId)}
                        className="form-radio h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                      />
                      <span className="ml-3 text-gray-700 text-base">
                        {answer.optionText}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              <ClipboardCheck className="w-5 h-5" />
              <span>Hoàn thành khảo sát</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 text-yellow-800 shadow-md flex items-center space-x-4">
          <Zap className="w-8 h-8 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-semibold">Chưa có câu hỏi nào</h3>
            <p className="mt-1">
              Hiện tại không có câu hỏi nào cho bài khảo sát này. Vui lòng thử lại sau.
            </p>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300 scale-100 animate-fade-in-up">
            <div className="text-center mb-6">
              <ClipboardCheck className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Kết quả khảo sát</h3>
              <p className="text-gray-600 text-lg">
                Điểm số của bạn:{" "}
                <strong className="text-blue-600 text-4xl">{score}</strong>
              </p>
            </div>

            <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-gray-700 text-center">
                {score > 4
                  ? "Dựa trên kết quả, chúng tôi khuyến nghị bạn nên tham gia chương trình tư vấn để nhận được hỗ trợ chuyên sâu."
                  : "Dựa trên kết quả, chúng tôi khuyến nghị bạn nên tham gia các khóa học giáo dục để nâng cao kiến thức và phòng tránh."}
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={() => handleNavigate(score > 4 ? "appointments" : "courses")}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md transform hover:scale-[1.02]"
              >
                <span>Chuyển đến {score > 4 ? "Tư vấn" : "Khóa học"}</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button
                onClick={closeModal}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-300 shadow-md"
              >
                <span>Đóng</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSurveys;