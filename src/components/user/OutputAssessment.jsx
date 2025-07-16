// OutputAssessment.jsx (Updated with better error handling, loading, debug, and result display without immediate navigation)
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";  // Added useLocation to receive state
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const OutputAssessment = () => {
  const navigate = useNavigate();
  const location = useLocation();  // To receive courseId from state
  const { assessmentId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [score, setScore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [courseId, setCourseId] = useState(null);  // State for courseId

  const token = localStorage.getItem("token") || sessionStorage.getItem("tempToken");

  // Get courseId from location state if not fetched
  useEffect(() => {
    if (location.state && location.state.courseId) {
      setCourseId(location.state.courseId);
    }
  }, [location]);

  useEffect(() => {
    if (token && assessmentId) {
      const fetchAssessmentDetail = async () => {
        try {
          const parsedAssessmentId = parseInt(assessmentId);
          const response = await fetch(`http://localhost:7092/api/Assessment/${parsedAssessmentId}`, {  // Assuming API to get assessment detail with courseId
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log("Assessment detail response:", data);  // Debug
          if (data.success) {
            setCourseId(data.data.courseID);  // Set courseId from response
          } else {
            throw new Error(data.message || "Không lấy được thông tin assessment.");
          }
        } catch (error) {
          console.error("Fetch assessment detail error:", error);
          toast.error("Lỗi tải thông tin assessment.");
        }
      };
      fetchAssessmentDetail();
    }
  }, [assessmentId, token]);

  useEffect(() => {
    if (token && assessmentId) {
      const fetchQuestions = async () => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
          const parsedAssessmentId = parseInt(assessmentId);  // Ensure assessmentId is number
          if (isNaN(parsedAssessmentId) || parsedAssessmentId <= 0) {
            throw new Error("ID bài đánh giá không hợp lệ.");
          }
          const response = await fetch(`http://localhost:7092/api/Question/GetQuestionsByAssessmentId/${parsedAssessmentId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log("API Response for questions:", data);  // Debug response
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
          console.error("Fetch error:", error);  // Debug error
          toast.error(error.message || "Lỗi tải câu hỏi.");
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
    if (!courseId) {
      toast.error("Không tìm thấy ID khóa học.");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.nameid;
      const parsedAssessmentId = parseInt(assessmentId);
      const payload = {
        userId,
        assessmentId: parsedAssessmentId,
        answerOptionId: selectedAnswers,
        courseId: courseId  // Added courseId to payload
      };
      console.log("Submit payload:", payload);  // Debug payload
      const response = await fetch("http://localhost:7092/api/AssessmentResults/create-output", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Submit response:", data);  // Debug response
      if (data.success) {
        setScore(data.score);
        setHasCompleted(true);
        toast.success(data.message);
        // Update assessment stage or complete course
        await updateAssessmentStage();  // Call to update stage if needed
        // Removed immediate navigate to show result on page
      } else {
        throw new Error(data.message || "Gửi thất bại!");
      }
    } catch (error) {
      console.error("Submit error:", error);  // Debug error
      toast.error(error.message || "Lỗi gửi bài đánh giá đầu ra.");
    }
  };

  const updateAssessmentStage = async () => {
    try {
      const response = await fetch("http://localhost:7092/api/Users/UpdateAssessmentStage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stage: "Completed" }),  // Update to completed or similar
      });
      if (!response.ok) {
        console.error("Failed to update assessment stage");
      }
    } catch (error) {
      console.error("Error updating assessment stage:", error);
    }
  };

  if (isLoading) {
    return <p>Đang tải bài đánh giá đầu ra...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">🧠 Bài đánh giá đầu ra</h2>
      {hasCompleted ? (
        <div className="bg-green-100 p-4 rounded mb-4">
          <p className="font-bold">Kết quả bài đánh giá đầu ra: <strong>{score} điểm</strong></p>
          <p>(Đã hoàn thành khóa học)</p>
          <button 
            onClick={() => navigate("/member-dashboard?tab=courses")} 
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Hoàn thành 
          </button>
        </div>
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
        <p>Không có câu hỏi cho bài đánh giá đầu ra này.</p>
      )}
    </div>
  );
};

export default OutputAssessment;