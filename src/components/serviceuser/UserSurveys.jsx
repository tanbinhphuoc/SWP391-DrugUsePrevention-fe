import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ArrowLeft, Shield, Brain, Heart, CheckCircle, AlertCircle, Clock, Award, Users } from "lucide-react";

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
  const [showValidation, setShowValidation] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

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
    setShowValidation(false);
  };

  const handleSubmit = async () => {
    if (selectedAnswers.some((a) => a === null)) {
      setShowValidation(true);
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
        setShowModal(true);
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

  const getAssessmentType = () => {
    return userAge < 18 ? "CRAFFT" : "ASSIST";
  };

  const getAssessmentInfo = () => {
    const type = getAssessmentType();
    return {
      CRAFFT: {
        title: "Khảo Sát CRAFFT (Dành cho tuổi vị thành niên)",
        description: "Bài đánh giá được thiết kế đặc biệt cho độ tuổi 12-17, giúp phát hiện sớm các yếu tố nguy cơ và tạo kế hoạch can thiệp phù hợp.",
        icon: <Users className="w-8 h-8 text-blue-600" />,
        color: "from-blue-500 to-cyan-600"
      },
      ASSIST: {
        title: "Khảo Sát ASSIST (Dành cho người trưởng thành)",
        description: "Công cụ đánh giá toàn diện cho người trưởng thành, hỗ trợ xác định mức độ nguy cơ và đưa ra lời khuyên phù hợp.",
        icon: <Brain className="w-8 h-8 text-green-600" />,
        color: "from-green-500 to-emerald-600"
      }
    }[type];
  };

  const answeredCount = selectedAnswers.filter((a) => a !== null).length;
  const progressPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  const BackToHomeButton = () => (
    <button
      onClick={() => navigate("/")}
      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl hover:from-gray-800 hover:to-gray-950 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-8 font-medium"
    >
      <ArrowLeft className="w-5 h-5" />
      <span>Quay lại trang chủ</span>
    </button>
  );

  const LoadingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-4"></div>
          <Shield className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-gray-700 text-lg font-medium">Đang tải bài đánh giá...</p>
        <p className="text-gray-500 text-sm mt-2">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  );

  const ErrorScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Có lỗi xảy ra</h3>
        <p className="text-red-600 mb-6">{errorMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
        >
          Thử lại
        </button>
      </div>
    </div>
  );

  if (isLoadingProfile || isLoadingAssessments || isLoadingQuestions) {
    return <LoadingScreen />;
  }

  if (errorMessage) {
    return <ErrorScreen />;
  }

  const assessmentInfo = getAssessmentInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <BackToHomeButton />
        
        {/* Header Section */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 mb-8 overflow-hidden">
          <div className={`bg-gradient-to-r ${assessmentInfo.color} p-8 text-white relative`}>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex items-center space-x-4">
              {assessmentInfo.icon}
              <div>
                <h1 className="text-3xl font-bold mb-2">Khảo Sát Phòng Chống Ma Túy</h1>
                <p className="text-white/90 text-lg">{assessmentInfo.title}</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-700 leading-relaxed">{assessmentInfo.description}</p>
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Thời gian: 10-15 phút</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Hoàn toàn bảo mật</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Heart className="w-4 h-4" />
                <span>Hỗ trợ chuyên nghiệp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {hasCompleted ? (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Khảo sát hoàn thành!</h2>
                <p className="text-gray-600">Cảm ơn bạn đã tham gia khảo sát</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Award className="w-8 h-8 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-800">Kết quả của bạn</h3>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">{score}</div>
                  <p className="text-gray-700 text-lg">điểm</p>
                </div>
              </div>
            </div>
          ) : questions.length > 0 ? (
            <div className="p-8">
              {/* Progress Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-2xl font-bold text-gray-800">Câu hỏi khảo sát</h2>
                  <div className="text-sm text-gray-600 font-medium">
                    Câu {answeredCount} / {questions.length}
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {Math.round(progressPercentage)}% hoàn thành
                </p>
              </div>

              {/* Questions */}
              <form className="space-y-6">
                {questions.map((question, qIndex) => (
                  <div
                    key={question.questionId}
                    className={`p-6 rounded-2xl shadow-lg border-2 transition-all duration-300 ${
                      showValidation && selectedAnswers[qIndex] === null
                        ? 'border-red-300 bg-red-50/50 shadow-red-100'
                        : selectedAnswers[qIndex] !== null
                        ? 'border-green-300 bg-green-50/30 shadow-green-100'
                        : 'border-gray-200 bg-gray-50/50 hover:border-blue-300 hover:shadow-blue-100'
                    }`}
                  >
                    <div className="flex items-start space-x-3 mb-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        selectedAnswers[qIndex] !== null ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {selectedAnswers[qIndex] !== null ? <CheckCircle className="w-4 h-4" /> : qIndex + 1}
                      </div>
                      <p className="text-gray-900 font-medium text-lg leading-relaxed flex-1">
                        {question.questionText}
                      </p>
                    </div>
                    
                    <div className="ml-11 space-y-3">
                      {question.answers.map((answer) => (
                        <label
                          key={answer.answerId}
                          className="flex items-center p-3 rounded-xl hover:bg-white/80 cursor-pointer transition-all duration-200 group"
                        >
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            onChange={() => handleAnswerChange(qIndex, answer.answerId)}
                            className="mr-4 w-5 h-5 accent-blue-600 scale-110"
                          />
                          <span className="text-gray-700 group-hover:text-gray-900 flex-1">
                            {answer.optionText}
                          </span>
                        </label>
                      ))}
                    </div>
                    
                    {showValidation && selectedAnswers[qIndex] === null && (
                      <div className="ml-11 mt-3 flex items-center space-x-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">Vui lòng chọn một đáp án</span>
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="pt-6">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={answeredCount === 0}
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    {answeredCount === questions.length ? '✨ Hoàn thành khảo sát' : `Gửi (${answeredCount}/${questions.length})`}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 italic text-lg">Không có câu hỏi cho bài đánh giá này.</p>
            </div>
          )}
          
          {!hasCompleted && questions.length > 0 && (
            <div className="px-8 pb-8">
              <div className="border-t border-gray-200 pt-6">
                <button
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
                  onClick={() => navigate("/UserAppointments")}
                >
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
            <div className={`bg-gradient-to-r ${score > 4 ? 'from-orange-500 to-red-600' : 'from-green-500 to-emerald-600'} p-6 text-white`}>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {score > 4 ? <AlertCircle className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl font-bold mb-2">Kết quả khảo sát</h3>
                <div className="text-4xl font-bold mb-1">{score}</div>
                <p className="text-white/90">điểm</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className={`p-4 rounded-xl mb-6 ${
                score > 4 
                  ? 'bg-orange-50 border border-orange-200' 
                  : 'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-center space-x-3">
                  {score > 4 ? (
                    <Heart className="w-6 h-6 text-orange-600" />
                  ) : (
                    <Award className="w-6 h-6 text-green-600" />
                  )}
                  <div>
                    <h4 className={`font-semibold ${score > 4 ? 'text-orange-800' : 'text-green-800'}`}>
                      Đề xuất cho bạn:
                    </h4>
                    <p className={`text-sm ${score > 4 ? 'text-orange-700' : 'text-green-700'}`}>
                      {score > 4
                        ? "Bạn nên tham gia tư vấn chuyên sâu với các chuyên gia của chúng tôi."
                        : "Bạn nên tham gia các khóa học phòng ngừa để nâng cao kiến thức."}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
                >
                  Đóng
                </button>
                <button
                  onClick={handleNavigate}
                  className={`flex-1 px-4 py-3 text-white rounded-xl transition-all duration-300 font-medium ${
                    score > 4
                      ? 'bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800'
                      : 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800'
                  }`}
                >
                  Đến {score > 4 ? 'Tư vấn' : 'Khóa học'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSurveys;