"use client";

import { useState, useEffect } from "react";
import { Search, Edit2, Trash2, Plus, FileText, X, Eye, Save, Calendar, Target } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "./RiskAssessmentManagement.css";

const RiskAssessmentManagement = () => {
  const [assessments, setAssessments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [token] = useState(localStorage.getItem("token") || "");
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [assessmentType, setAssessmentType] = useState("Input");
  const [newAssessmentID, setNewAssessmentID] = useState(null);
  const [formData, setFormData] = useState({
    assessmentName: "",
    description: "",
    assessmentType: "Crafft",
    courseID: "",
  });
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      questionType: "yes/no",
      answers: [
        { optionText: "yes", scoreValue: 2 },
        { optionText: "no", scoreValue: 0 },
      ],
    },
  ]);
  const [viewQuestions, setViewQuestions] = useState([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  const [newQuestions, setNewQuestions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState({ questionText: "", questionType: "yes/no" });

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!token) return toast.error("Vui lòng đăng nhập để tiếp tục");
      try {
        // Fetch Input assessments
        const inputRes = await fetch("http://localhost:7092/api/Assessment/GetAllInput", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const inputData = await inputRes.json();
        const inputAssessments = inputRes.ok && inputData.success
          ? (inputData.data || []).map((item) => ({
              ...item,
              assessmentStage: "Input",
            }))
          : [];

        // Fetch Output assessments
        const outputRes = await fetch("http://localhost:7092/api/Assessment/GetAllOutput", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const outputData = await outputRes.json();
        const outputAssessments = outputRes.ok && outputData.success
          ? (outputData.data || []).map((item) => ({
              ...item,
              assessmentStage: "Output",
            }))
          : [];

        // Combine both
        setAssessments([...inputAssessments, ...outputAssessments]);

        if (!inputRes.ok || !inputData.success || !outputRes.ok || !outputData.success) {
          toast.error("Không thể lấy đầy đủ danh sách bài đánh giá");
        }
      } catch (err) {
        toast.error(err.message || "Không thể lấy danh sách bài đánh giá");
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:7092/api/Course/GetAllCourse", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setCourses(data.data || []);
        } else {
          toast.error(data.message || "Không thể lấy danh sách khóa học");
        }
      } catch (err) {
        toast.error(err.message || "Không thể lấy danh sách khóa học");
      }
    };

    fetchAssessments();
    fetchCourses();
  }, [token]);

  useEffect(() => {
    if (assessmentType === "Output") {
      setFormData((prev) => ({ ...prev, courseID: "" }));
    }
  }, [formData.assessmentType]);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleStatusFilter = (e) => setStatusFilter(e.target.value);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài đánh giá này?")) return;
    try {
      const res = await fetch(`http://localhost:7092/api/Assessment/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setAssessments(assessments.filter((item) => item.assessmentID !== id));
        toast.success("Xóa bài đánh giá thành công");
      } else {
        toast.error(data.message || "Không thể xóa bài đánh giá");
      }
    } catch (err) {
      toast.error(err.message || "Không thể xóa bài đánh giá");
    }
  };

  const handleEdit = (id) => {
    const assessment = assessments.find((item) => item.assessmentID === id);
    setEditingAssessment(assessment);
    setIsEditing(true);
    setAssessmentType(assessment.assessmentStage);
    setFormData({
      assessmentName: assessment.assessmentName,
      description: assessment.description || "",
      assessmentType: assessment.assessmentType,
      courseID: assessment.courseID || "",
    });
    setShowAssessmentModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssessmentSubmit = async (e) => {
    e.preventDefault();
    if (
      assessmentType === "Output" &&
      (!formData.courseID || isNaN(formData.courseID) || Number(formData.courseID) <= 0)
    ) {
      return toast.error("Vui lòng chọn khóa học hợp lệ cho bài đánh giá Output");
    }

    const url = isEditing
      ? assessmentType === "Input"
        ? `http://localhost:7092/api/Assessment/UpdateInputAssessment/${editingAssessment.assessmentID}`
        : `http://localhost:7092/api/Assessment/UpdateOutputAssessment/${editingAssessment.assessmentID}`
      : assessmentType === "Input"
      ? "http://localhost:7092/api/Assessment/CreateInputAssessment"
      : "http://localhost:7092/api/Assessment/CreateOutputAssessment";

    const payload = assessmentType === "Input"
      ? { assessmentName: formData.assessmentName, description: formData.description, assessmentType: formData.assessmentType }
      : { assessmentName: formData.assessmentName, description: formData.description, assessmentType: formData.assessmentType, courseID: Number(formData.courseID) };

    try {
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        if (isEditing) {
          setAssessments(
            assessments.map((item) =>
              item.assessmentID === editingAssessment.assessmentID
                ? { ...payload, assessmentID: editingAssessment.assessmentID, assessmentStage: assessmentType }
                : item,
            ),
          );
          setIsEditing(false);
          setEditingAssessment(null);
          toast.success("Cập nhật bài đánh giá thành công");
          setShowAssessmentModal(false);
        } else {
          setAssessments([...assessments, { ...payload, assessmentID: data.assessmentId, assessmentStage: assessmentType }]);
          setNewAssessmentID(data.assessmentId);
          setShowQuestionModal(true);
          toast.success("Tạo bài đánh giá thành công");
          setShowAssessmentModal(false);
        }
        setFormData({
          assessmentName: "",
          description: "",
          assessmentType: "Crafft",
          courseID: "",
        });
      } else {
        toast.error(data.message || "Không thể xử lý bài đánh giá");
      }
    } catch (err) {
      toast.error(err.message || "Không thể xử lý bài đánh giá");
    }
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, [field]: value } : q)));
  };

  const handleAnswerChange = (questionIndex, answerIndex, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              answers: q.answers.map((a, j) => (j === answerIndex ? { ...a, [field]: value } : a)),
            }
          : q,
      ),
    );
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        questionType: "yes/no",
        answers: [
          { optionText: "yes", scoreValue: 2 },
          { optionText: "no", scoreValue: 0 },
        ],
      },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!newAssessmentID) return toast.error("Vui lòng tạo bài đánh giá trước khi thêm câu hỏi");
    if (!questions.every((q) => q.questionText && q.answers.every((a) => a.optionText && a.scoreValue !== undefined))) {
      return toast.error("Vui lòng nhập đầy đủ nội dung câu hỏi và đáp án");
    }

    const payload = questions.map((q) => ({
      assessmentID: newAssessmentID,
      questionText: q.questionText,
      questionType: q.questionType,
      answers: q.answers.filter((a) => a.optionText && a.scoreValue !== undefined),
    }));

    try {
      const res = await fetch("http://localhost:7092/api/Question/CreateMultipleQuestionsWithAnswers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Tạo câu hỏi và đáp án thành công");
        setShowQuestionModal(false);
        setQuestions([
          {
            questionText: "",
            questionType: "yes/no",
            answers: [
              { optionText: "yes", scoreValue: 2 },
              { optionText: "no", scoreValue: 0 },
            ],
          },
        ]);
      } else {
        toast.error(data.message || "Tạo câu hỏi thất bại");
      }
    } catch (err) {
      toast.error(err.message || "Không thể tạo câu hỏi");
    }
  };

  const handleViewQuestions = async (id) => {
    try {
      const res = await fetch(`http://localhost:7092/api/Question/GetQuestionsByAssessmentId/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setViewQuestions(data.data || []);
        setSelectedAssessmentId(id);
        setShowViewModal(true);
      } else {
        toast.error(data.message || "Không thể lấy danh sách câu hỏi");
      }
    } catch (err) {
      toast.error(err.message || "Không thể lấy danh sách câu hỏi");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) return;
    try {
      const res = await fetch(`http://localhost:7092/api/Question/DeleteQuestionForAssessment?id=${questionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("API Response for Delete Question:", { status: res.status, data }); // Debug chi tiết

      if (res.ok && (data.success || data.message === "Xóa Question Thành Công.")) {
        setViewQuestions(viewQuestions.filter((q) => q.questionId !== questionId));
        toast.success("Xóa câu hỏi thành công");
      } else {
        const errorMessage = data.message || `Lỗi xóa câu hỏi (Mã trạng thái: ${res.status})`;
        toast.error(errorMessage);
        console.error("Delete failed:", errorMessage);
      }
    } catch (err) {
      console.error("Error deleting question:", err);
      toast.error("Không thể xóa câu hỏi do lỗi kết nối");
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestionId(question.questionId);
    setEditingQuestion({
      questionText: question.questionText,
      questionType: question.questionType,
    });
  };

  const handleEditQuestionChange = (e) => {
    const { name, value } = e.target;
    setEditingQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditQuestionSubmit = async (questionId) => {
    if (!editingQuestion.questionText || !selectedAssessmentId) {
      return toast.error("Vui lòng nhập nội dung câu hỏi và đảm bảo đã chọn bài đánh giá");
    }

    try {
      const res = await fetch(`http://localhost:7092/api/Question/UpdateQuestionForAssessment?id=${questionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assessmentID: selectedAssessmentId,
          questionText: editingQuestion.questionText,
          questionType: editingQuestion.questionType,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setViewQuestions(
          viewQuestions.map((q) =>
            q.questionId === questionId
              ? { ...q, questionText: editingQuestion.questionText, questionType: editingQuestion.questionType }
              : q,
          ),
        );
        setEditingQuestionId(null);
        setEditingQuestion({ questionText: "", questionType: "yes/no" });
        toast.success("Cập nhật câu hỏi thành công");
      } else {
        toast.error(data.message || "Cập nhật câu hỏi thất bại");
      }
    } catch (err) {
      toast.error(err.message || "Không thể cập nhật câu hỏi");
    }
  };

  const handleNewQuestionChange = (index, field, value) => {
    setNewQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, [field]: value } : q)));
  };

  const handleNewAnswerChange = (questionIndex, answerIndex, field, value) => {
    setNewQuestions((prev) =>
      prev.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              answers: q.answers.map((a, j) => (j === answerIndex ? { ...a, [field]: value } : a)),
            }
          : q,
      ),
    );
  };

  const addNewQuestion = () => {
    setNewQuestions([
      ...newQuestions,
      {
        questionText: "",
        questionType: "yes/no",
        answers: [
          { optionText: "yes", scoreValue: 2 },
          { optionText: "no", scoreValue: 0 },
        ],
      },
    ]);
    setShowAddQuestionForm(true);
  };

  const removeNewQuestion = (index) => {
    setNewQuestions(newQuestions.filter((_, i) => i !== index));
    if (newQuestions.length === 1) setShowAddQuestionForm(false);
  };

  const handleAddQuestionsSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssessmentId) return toast.error("Vui lòng chọn bài đánh giá trước khi tạo câu hỏi");
    if (newQuestions.length === 0) return toast.error("Vui lòng thêm ít nhất một câu hỏi");
    if (!newQuestions.every((q) => q.questionText && q.answers.every((a) => a.optionText && a.scoreValue !== undefined))) {
      return toast.error("Vui lòng nhập đầy đủ nội dung câu hỏi và đáp án");
    }

    const payload = newQuestions.map((q) => ({
      assessmentID: selectedAssessmentId,
      questionText: q.questionText,
      questionType: q.questionType,
      answers: q.answers.filter((a) => a.optionText && a.scoreValue !== undefined),
    }));

    try {
      const res = await fetch("http://localhost:7092/api/Question/CreateMultipleQuestionsWithAnswers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Tạo câu hỏi và đáp án thành công");
        setNewQuestions([]);
        setShowAddQuestionForm(false);
        handleViewQuestions(selectedAssessmentId);
      } else {
        toast.error(data.message || "Tạo câu hỏi thất bại");
      }
    } catch (err) {
      toast.error(err.message || "Không thể tạo câu hỏi");
    }
  };

  const filteredAssessments = assessments.filter(
    (assessment) =>
      assessment.assessmentName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter ? assessment.assessmentStage === statusFilter : true),
  );

  const filteredCourses = courses.filter((course) => {
    const courseType = course.type.trim();
    const matchesType = formData.assessmentType === "Crafft"
      ? courseType === "HocSinh"
      : courseType === "SinhVien" || courseType === "PhuHuynh";
    if (!matchesType) return false;
    const isUsed = assessments.some(
      (a) =>
        a.assessmentStage === "Output" &&
        a.courseID === course.courseID &&
        (!isEditing || a.assessmentID !== editingAssessment?.assessmentID),
    );
    return !isUsed;
  });

  return (
    <div className="risk-assessment-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="header-section">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">Quản lý bài đánh giá</h1>
            <p className="page-subtitle">Tổng cộng {assessments.length} bài đánh giá</p>
          </div>
          <button onClick={() => setShowAssessmentModal(true)} className="add-button">
            <Plus className="w-5 h-5" />
            <span>Thêm bài đánh giá</span>
          </button>
        </div>
      </div>

      <div className="search-filter-section">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Tìm kiếm bài đánh giá..."
            className="search-input"
          />
        </div>
        <select value={statusFilter} onChange={handleStatusFilter} className="filter-select">
          <option value="">Tất cả trạng thái</option>
          <option value="Input">Input</option>
          <option value="Output">Output</option>
        </select>
      </div>

      <div className="assessment-grid">
        {filteredAssessments.length > 0 ? (
          filteredAssessments.map((assessment) => (
            <div key={assessment.assessmentID} className="assessment-card">
              <div className="card-header">
                <div className="card-icon">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="card-actions">
                  <button
                    onClick={() => handleEdit(assessment.assessmentID)}
                    className="action-button edit-button"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(assessment.assessmentID)}
                    className="action-button delete-button"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleViewQuestions(assessment.assessmentID)}
                    className="action-button view-button"
                    title="Xem câu hỏi"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="card-content">
                <h3 className="assessment-title">{assessment.assessmentName}</h3>
                <p className="assessment-description">{assessment.description || "Không có mô tả"}</p>

                <div className="assessment-stats">
                  <div className="stat-item">
                    <Target className="stat-icon" />
                    <div className="stat-content">
                      <span className="stat-label">Loại</span>
                      <span className="stat-value">{assessment.assessmentType}</span>
                    </div>
                  </div>

                  <div className="stat-item">
                    <Calendar className="stat-icon" />
                    <div className="stat-content">
                      <span className="stat-label">Trạng thái</span>
                      <span className={`status-badge ${assessment.assessmentStage.toLowerCase()}`}>
                        {assessment.assessmentStage}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Không có dữ liệu bài đánh giá</p>
        )}
      </div>

      {showAssessmentModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">{isEditing ? "Chỉnh sửa bài đánh giá" : "Tạo bài đánh giá mới"}</h3>
              <button
                onClick={() => {
                  setShowAssessmentModal(false);
                  setIsEditing(false);
                  setEditingAssessment(null);
                  setFormData({
                    assessmentName: "",
                    description: "",
                    assessmentType: "Crafft",
                    courseID: "",
                  });
                }}
                className="close-button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssessmentSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Loại bài đánh giá</label>
                <select
                  value={assessmentType}
                  onChange={(e) => setAssessmentType(e.target.value)}
                  className="form-select"
                  disabled={isEditing}
                >
                  <option value="Input">Input</option>
                  <option value="Output">Output</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tên bài đánh giá</label>
                <input
                  type="text"
                  name="assessmentName"
                  value={formData.assessmentName}
                  onChange={handleFormChange}
                  className="form-input"
                  placeholder="Nhập tên bài đánh giá..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  className="form-textarea"
                  placeholder="Nhập mô tả bài đánh giá..."
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Loại đánh giá</label>
                <select
                  name="assessmentType"
                  value={formData.assessmentType}
                  onChange={handleFormChange}
                  className="form-select"
                >
                  <option value="Crafft">Crafft</option>
                  <option value="Assist">Assist</option>
                </select>
              </div>

              {assessmentType === "Output" && (
                <div className="form-group">
                  <label className="form-label">Khóa học</label>
                  <select
                    name="courseID"
                    value={formData.courseID}
                    onChange={handleFormChange}
                    className="form-select"
                    required
                  >
                    <option value="">Chọn khóa học</option>
                    {filteredCourses.map((course) => (
                      <option key={course.courseID} value={course.courseID}>
                        {course.courseName} ({course.type.trim()})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button type="submit" className="submit-button">
                {isEditing ? "Cập nhật bài đánh giá" : "Tạo bài đánh giá"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showQuestionModal && (
        <div className="modal-overlay">
          <div className="modal-container large">
            <div className="modal-header">
              <h3 className="modal-title">Thêm câu hỏi cho bài đánh giá</h3>
              <button onClick={() => setShowQuestionModal(false)} className="close-button">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuestionSubmit} className="modal-form">
              <div className="questions-container">
                {questions.map((question, qIndex) => (
                  <div key={qIndex} className="question-card">
                    <div className="question-header">
                      <h4 className="question-title">Câu hỏi {qIndex + 1}</h4>
                      {questions.length > 1 && (
                        <button type="button" onClick={() => removeQuestion(qIndex)} className="remove-question-button">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nội dung câu hỏi</label>
                      <input
                        type="text"
                        value={question.questionText}
                        onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
                        className="form-input"
                        placeholder="Nhập nội dung câu hỏi..."
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Loại câu hỏi</label>
                      <select
                        value={question.questionType}
                        onChange={(e) => handleQuestionChange(qIndex, "questionType", e.target.value)}
                        className="form-select"
                      >
                        <option value="yes/no">Yes/No</option>
                      </select>
                    </div>

                    <div className="answers-section">
                      <label className="form-label">Câu trả lời</label>
                      {question.answers.map((answer, aIndex) => (
                        <div key={aIndex} className="answer-row">
                          <input
                            type="text"
                            value={answer.optionText}
                            onChange={(e) => handleAnswerChange(qIndex, aIndex, "optionText", e.target.value)}
                            placeholder="Tùy chọn"
                            className="form-input"
                            required
                          />
                          <input
                            type="number"
                            value={answer.scoreValue}
                            onChange={(e) => handleAnswerChange(qIndex, aIndex, "scoreValue", Number(e.target.value))}
                            placeholder="Điểm"
                            className="form-input score-input"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="modal-actions">
                <button type="button" onClick={addQuestion} className="add-question-button">
                  <Plus className="w-4 h-4" />
                  Thêm câu hỏi
                </button>
                <button type="submit" className="submit-button">
                  Lưu tất cả câu hỏi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && (
        <div className="modal-overlay">
          <div className="modal-container large">
            <div className="modal-header">
              <h3 className="modal-title">Quản lý câu hỏi - ID: {selectedAssessmentId}</h3>
              <button onClick={() => setShowViewModal(false)} className="close-button">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="view-questions-content">
              <div className="existing-questions">
                {viewQuestions.map((question, qIndex) => (
                  <div key={question.questionId} className="view-question-card">
                    <div className="question-header">
                      <h4 className="question-number">Câu hỏi {qIndex + 1}</h4>
                      <div className="question-actions">
                        {editingQuestionId === question.questionId ? (
                          <>
                            <button
                              onClick={() => setEditingQuestionId(null)}
                              className="action-button cancel-button"
                              title="Hủy"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleDeleteQuestion(question.questionId)}
                              className="action-button delete-button"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {editingQuestionId === question.questionId ? (
                      <div className="edit-question-form">
                        <div className="form-group">
                          <label className="form-label">Nội dung câu hỏi</label>
                          <input
                            type="text"
                            name="questionText"
                            value={editingQuestion.questionText}
                            onChange={handleEditQuestionChange}
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Loại câu hỏi</label>
                          <select
                            name="questionType"
                            value={editingQuestion.questionType}
                            onChange={handleEditQuestionChange}
                            className="form-select"
                          >
                            <option value="yes/no">Yes/No</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="question-content">
                        <p className="question-text">{question.questionText}</p>
                        <div className="question-meta">
                          <span className="question-type">Loại: {question.questionType}</span>
                        </div>
                        <div className="answers-display">
                          <h5 className="answers-title">Câu trả lời:</h5>
                          <div className="answers-grid">
                            {question.answers.map((answer) => (
                              <div key={answer.answerId} className="answer-item">
                                <span className="answer-text">{answer.optionText}</span>
                                <span className="answer-score">{answer.scoreValue} điểm</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!showAddQuestionForm && (
                <button
                  onClick={() => {
                    setShowAddQuestionForm(true);
                    addNewQuestion();
                  }}
                  className="add-new-question-button"
                >
                  <Plus className="w-5 h-5" />
                  Tạo câu hỏi mới
                </button>
              )}

              {showAddQuestionForm && (
                <div className="add-questions-section">
                  <h4 className="section-title">Thêm câu hỏi mới</h4>
                  <form onSubmit={handleAddQuestionsSubmit}>
                    <div className="new-questions-container">
                      {newQuestions.map((question, qIndex) => (
                        <div key={qIndex} className="question-card">
                          <div className="question-header">
                            <h5 className="question-title">Câu hỏi mới {qIndex + 1}</h5>
                            {newQuestions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeNewQuestion(qIndex)}
                                className="remove-question-button"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="form-group">
                            <label className="form-label">Nội dung câu hỏi</label>
                            <input
                              type="text"
                              value={question.questionText}
                              onChange={(e) => handleNewQuestionChange(qIndex, "questionText", e.target.value)}
                              className="form-input"
                              placeholder="Nhập nội dung câu hỏi..."
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">Loại câu hỏi</label>
                            <select
                              value={question.questionType}
                              onChange={(e) => handleNewQuestionChange(qIndex, "questionType", e.target.value)}
                              className="form-select"
                            >
                              <option value="yes/no">Yes/No</option>
                            </select>
                          </div>

                          <div className="answers-section">
                            <label className="form-label">Câu trả lời</label>
                            {question.answers.map((answer, aIndex) => (
                              <div key={aIndex} className="answer-row">
                                <input
                                  type="text"
                                  value={answer.optionText}
                                  onChange={(e) => handleNewAnswerChange(qIndex, aIndex, "optionText", e.target.value)}
                                  placeholder="Tùy chọn"
                                  className="form-input"
                                  required
                                />
                                <input
                                  type="number"
                                  value={answer.scoreValue}
                                  onChange={(e) =>
                                    handleNewAnswerChange(qIndex, aIndex, "scoreValue", Number(e.target.value))
                                  }
                                  placeholder="Điểm"
                                  className="form-input score-input"
                                  required
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="modal-actions">
                      <button type="button" onClick={addNewQuestion} className="add-question-button">
                        <Plus className="w-4 h-4" />
                        Thêm câu hỏi
                      </button>
                      <button type="submit" className="submit-button">
                        Lưu câu hỏi mới
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskAssessmentManagement;