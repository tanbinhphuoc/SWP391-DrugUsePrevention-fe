"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  CheckCircle,
  Clock,
  Award,
  Target,
  Home,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";

const OutputAssessment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { assessmentId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [score, setScore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const token = localStorage.getItem("token") || sessionStorage.getItem("tempToken");

  // Show notification function
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  // Get courseId from location state or fetch from API
  useEffect(() => {
    if (location.state && location.state.courseId) {
      setCourseId(location.state.courseId);
    } else if (token && assessmentId) {
      const fetchAssessmentDetail = async () => {
        try {
          const parsedAssessmentId = Number.parseInt(assessmentId);
          const response = await fetch(`http://localhost:7092/api/Assessment/${parsedAssessmentId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Assessment detail request:", {
            url: `http://localhost:7092/api/Assessment/${parsedAssessmentId}`,
            method: "GET",
            status: response.status,
          });
          if (!response.ok) {
            const errorText = await response.text();
            console.error("Error response:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data.success) {
            setCourseId(data.data.courseID);
          } else {
            throw new Error(data.message || "Không lấy được courseId.");
          }
        } catch (error) {
          console.error("Fetch assessment detail error:", error);
          showNotification("Lỗi tải thông tin assessment.", "error");
        }
      };
      fetchAssessmentDetail();
    }
  }, [location, assessmentId, token]);

  // Fetch questions
  useEffect(() => {
    if (token && assessmentId) {
      const fetchQuestions = async () => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
          const parsedAssessmentId = Number.parseInt(assessmentId);
          if (Number.isNaN(parsedAssessmentId) || parsedAssessmentId <= 0) {
            throw new Error("ID bài đánh giá không hợp lệ.");
          }
          const response = await fetch(
            `http://localhost:7092/api/Question/GetQuestionsByAssessmentId/${parsedAssessmentId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          console.log("Questions request:", {
            url: `http://localhost:7092/api/Question/GetQuestionsByAssessmentId/${parsedAssessmentId}`,
            method: "GET",
            status: response.status,
          });
          if (!response.ok) {
            const errorText = await response.text();
            console.error("Error response:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data.success) {
            setQuestions(data.data || []);
            setSelectedAnswers(new Array((data.data || []).length).fill(null));
            if ((data.data || []).length === 0) {
              setErrorMessage("Không có câu hỏi nào cho bài đánh giá đầu ra này.");
            }
          } else {
            throw new Error(data.message || "Dữ liệu câu hỏi không thành công.");
          }
        } catch (error) {
          console.error("Fetch error:", error);
          showNotification(error.message || "Lỗi tải câu hỏi.", "error");
          setErrorMessage("Không thể tải câu hỏi.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchQuestions();
    } else {
      setErrorMessage("Không có token xác thực hoặc ID bài đánh giá.");
      setIsLoading(false);
    }
  }, [assessmentId, token]);

  // Handle answer selection
  const handleAnswerChange = (questionIndex, answerId) => {
    const updated = [...selectedAnswers];
    updated[questionIndex] = answerId;
    setSelectedAnswers(updated);
  };

  // Handle submission
  const handleSubmit = async () => {
    if (selectedAnswers.some((a) => a === null)) {
      showNotification("Vui lòng trả lời tất cả câu hỏi!", "error");
      return;
    }
    if (!courseId) {
      showNotification("Không tìm thấy ID khóa học.", "error");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.nameid;
      const parsedAssessmentId = Number.parseInt(assessmentId);
      const payload = {
        userId,
        assessmentId: parsedAssessmentId,
        answerOptionId: selectedAnswers,
        courseId: courseId,
      };
      console.log("Submit payload:", payload); // Log payload
      const response = await fetch("http://localhost:7092/api/AssessmentResults/create-output", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      console.log("Submit response:", {
        status: response.status,
        url: "http://localhost:7092/api/AssessmentResults/create-output",
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setScore(data.score);
        setHasCompleted(true);
        showNotification(data.message);
        await updateAssessmentStage();
      } else {
        throw new Error(data.message || "Gửi thất bại!");
      }
    } catch (error) {
      console.error("Submit error:", error);
      showNotification(error.message || "Lỗi gửi bài đánh giá đầu ra.", "error");
    }
  };

  // Update assessment stage (missing implementation)
  const updateAssessmentStage = async () => {
    try {
      const response = await fetch("http://localhost:7092/api/Users/UpdateAssessmentStage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stage: "Completed" }),
      });
      console.log("Update stage response:", {
        status: response.status,
        url: "http://localhost:7092/api/Users/UpdateAssessmentStage",
      });
      if (!response.ok) {
        console.error("Failed to update assessment stage");
      }
    } catch (error) {
      console.error("Error updating assessment stage:", error);
    }
  };

  const handleBack = () => navigate(-1);
  const handleGoHome = () => navigate("/");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-medium text-gray-700">Đang tải bài đánh giá đầu ra...</span>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h3>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
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

      <div className="max-w-4xl mx-auto">
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
              <div className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-xl shadow-lg">
                <span className="font-bold text-sm">🧠 Đánh giá</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Bài đánh giá đầu ra
              </h1>
              <p className="text-gray-600 text-lg">Hoàn thành bài kiểm tra để nhận chứng chỉ khóa học</p>
            </div>
          </div>

          {/* Assessment Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{questions.length}</div>
                  <div className="text-sm text-gray-600">Câu hỏi</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">Không giới hạn</div>
                  <div className="text-sm text-gray-600">Thời gian</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">Chứng chỉ</div>
                  <div className="text-sm text-gray-600">Phần thưởng</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Content */}
        {hasCompleted ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Chúc mừng! Bạn đã hoàn thành</h2>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 mb-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Award className="w-8 h-8 text-green-600" />
                  <span className="text-2xl font-bold text-green-800">Kết quả: {score} điểm</span>
                </div>
                <p className="text-green-700 font-medium">Bạn đã hoàn thành khóa học thành công!</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/member-dashboard")}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-bold"
                >
                  <BookOpen className="w-6 h-6" />
                  <span>Về Dashboard</span>
                </button>
                <button
                  onClick={handleGoHome}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-bold"
                >
                  <Home className="w-6 h-6" />
                  <span>Trang chủ</span>
                </button>
              </div>
            </div>
          </div>
        ) : questions.length > 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Câu hỏi đánh giá</h2>
                  <p className="text-gray-600">Vui lòng chọn đáp án đúng nhất cho mỗi câu hỏi</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-gray-200 rounded-full h-2 mb-6">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(selectedAnswers.filter((a) => a !== null).length / questions.length) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Đã trả lời: {selectedAnswers.filter((a) => a !== null).length}/{questions.length} câu hỏi
              </p>
            </div>

            <form className="space-y-8">
              {questions.map((question, qIndex) => (
                <div
                  key={question.questionId}
                  className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 p-6 transition-all duration-300 hover:border-blue-300"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-white font-bold text-sm">{qIndex + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">{question.questionText}</h3>
                      <div className="space-y-3">
                        {question.answers.map((answer) => (
                          <label
                            key={answer.answerId}
                            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                              selectedAnswers[qIndex] === answer.answerId
                                ? "border-blue-500 bg-blue-50 shadow-md"
                                : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${qIndex}`}
                              checked={selectedAnswers[qIndex] === answer.answerId}
                              onChange={() => handleAnswerChange(qIndex, answer.answerId)}
                              className="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-blue-500 focus:ring-2 mr-4"
                            />
                            <span className="text-gray-800 font-medium flex-1">{answer.optionText}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </form>

            <div className="mt-8 pt-6 border-t-2 border-gray-200">
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={selectedAnswers.some((a) => a === null)}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-bold text-lg"
                >
                  <CheckCircle className="w-6 h-6" />
                  <span>Nộp bài đánh giá</span>
                </button>
                {selectedAnswers.some((a) => a === null) && (
                  <p className="text-red-500 text-sm mt-4">Vui lòng trả lời tất cả câu hỏi trước khi nộp bài</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Không có câu hỏi</h3>
              <p className="text-gray-500 mb-6">Không có câu hỏi nào cho bài đánh giá đầu ra này.</p>
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg"
              >
                Quay lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputAssessment;