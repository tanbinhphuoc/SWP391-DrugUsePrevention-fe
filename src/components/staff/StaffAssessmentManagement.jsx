    "use client";
    
    import React from "react";
    import { Search, Edit2, Trash2, Plus, FileText, X, Eye, Save, Calendar, Target } from "lucide-react";
    import { toast } from "react-toastify";
    import "./RiskAssessmentManagement.css";
    
    
    class StaffAssessmentManagement extends React.Component {
        state = {
            assessments: [],
            searchTerm: "",
            statusFilter: "",
            token: localStorage.getItem("token") || "",
            showAssessmentModal: false,
            showQuestionModal: false,
            showViewModal: false,
            assessmentType: "Input",
            newAssessmentID: null,
            formData: {
                assessmentName: "",
                description: "",
                assessmentType: "Crafft",
                courseID: "",
            },
            questions: [
                {
                    questionText: "",
                    questionType: "yes/no",
                    answers: [
                        { optionText: "yes", scoreValue: 2 },
                        { optionText: "no", scoreValue: 0 },
                    ],
                },
            ],
            viewQuestions: [],
            selectedAssessmentId: null,
            showAddQuestionForm: false,
            newQuestions: [],
            courses: [],
            isEditing: false,
            editingAssessment: null,
            editingQuestionId: null,
            editingQuestion: { questionText: "", questionType: "yes/no" },
        };
    
        fetchAssessments = async () => {
            if (!this.state.token) {
                toast.error("Vui lòng đăng nhập để tiếp tục");
                return;
            }
            try {
                const inputRes = await fetch("http://localhost:7092/api/Assessment/GetAllInput", {
                    headers: { Authorization: `Bearer ${this.state.token}` },
                });
                const inputData = await inputRes.json();
                const inputAssessments = inputRes.ok && inputData.success
                    ? (inputData.data || []).map((item) => ({ ...item, assessmentStage: "Input" }))
                    : [];
    
                const outputRes = await fetch("http://localhost:7092/api/Assessment/GetAllOutput", {
                    headers: { Authorization: `Bearer ${this.state.token}` },
                });
                const outputData = await outputRes.json();
                const outputAssessments = outputRes.ok && outputData.success
                    ? (outputData.data || []).map((item) => ({ ...item, assessmentStage: "Output" }))
                    : [];
    
                this.setState({
                    assessments: [...inputAssessments, ...outputAssessments],
                });
    
                if (!inputRes.ok || !inputData.success || !outputRes.ok || !outputData.success) {
                    toast.error("Không thể lấy đầy đủ danh sách bài đánh giá");
                }
            } catch (err) {
                toast.error(err.message || "Không thể lấy danh sách bài đánh giá");
            }
        };
    
        fetchCourses = async () => {
            try {
                const res = await fetch("http://localhost:7092/api/Course/GetAllCourse", {
                    headers: { Authorization: `Bearer ${this.state.token}` },
                });
                const data = await res.json();
                if (res.ok && data.success) {
                    this.setState({ courses: data.data || [] });
                } else {
                    toast.error(data.message || "Không thể lấy danh sách khóa học");
                }
            } catch (err) {
                toast.error(err.message || "Không thể lấy danh sách khóa học");
            }
        };
    
        componentDidMount() {
            this.fetchAssessments();
            this.fetchCourses();
        }
    
        handleSearch = (e) => this.setState({ searchTerm: e.target.value });
        handleStatusFilter = (e) => this.setState({ statusFilter: e.target.value });
    
        handleDelete = async (id) => {
            if (!window.confirm("Bạn có chắc chắn muốn xóa bài đánh giá này?")) return;
            try {
                const res = await fetch(`http://localhost:7092/api/Assessment/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${this.state.token}` },
                });
                const data = await res.json();
                if (data.success) {
                    this.setState((prevState) => ({
                        assessments: prevState.assessments.filter((item) => item.assessmentID !== id),
                    }));
                    toast.success("Xóa bài đánh giá thành công");
                } else {
                    toast.error(data.message || "Không thể xóa bài đánh giá");
                }
            } catch (err) {
                toast.error(err.message || "Không thể xóa bài đánh giá");
            }
        };
    
        handleEdit = (id) => {
            const assessment = this.state.assessments.find((item) => item.assessmentID === id);
            this.setState({
                editingAssessment: assessment,
                isEditing: true,
                assessmentType: assessment.assessmentStage,
                formData: {
                    assessmentName: assessment.assessmentName,
                    description: assessment.description || "",
                    assessmentType: assessment.assessmentType,
                    courseID: assessment.courseID || "",
                },
                showAssessmentModal: true,
            });
        };
    
        handleFormChange = (e) => {
            const { name, value } = e.target;
            this.setState((prevState) => ({
                formData: { ...prevState.formData, [name]: value },
            }));
        };
    
        handleAssessmentSubmit = async (e) => {
            e.preventDefault();
            const { formData, assessmentType, isEditing, editingAssessment } = this.state;
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
                        Authorization: `Bearer ${this.state.token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (data.success) {
                    if (isEditing) {
                        this.setState((prevState) => ({
                            assessments: prevState.assessments.map((item) =>
                                item.assessmentID === editingAssessment.assessmentID
                                    ? { ...payload, assessmentID: editingAssessment.assessmentID, assessmentStage: assessmentType }
                                    : item,
                            ),
                            isEditing: false,
                            editingAssessment: null,
                            showAssessmentModal: false,
                            formData: { assessmentName: "", description: "", assessmentType: "Crafft", courseID: "" },
                        }));
                        toast.success("Cập nhật bài đánh giá thành công");
                    } else {
                        this.setState({
                            assessments: [...this.state.assessments, { ...payload, assessmentID: data.data.assessmentId, assessmentStage: assessmentType }],
                            newAssessmentID: data.data.assessmentId,
                            showQuestionModal: true,
                            showAssessmentModal: false,
                            formData: { assessmentName: "", description: "", assessmentType: "Crafft", courseID: "" },
                        });
                        toast.success("Tạo bài đánh giá thành công");
                    }
                } else {
                    toast.error(data.message || "Không thể xử lý bài đánh giá");
                }
            } catch (err) {
                toast.error(err.message || "Không thể xử lý bài đánh giá");
            }
        };
    
        handleQuestionChange = (index, field, value) => {
            this.setState((prevState) => ({
                questions: prevState.questions.map((q, i) => (i === index ? { ...q, [field]: value } : q)),
            }));
        };
    
        handleAnswerChange = (questionIndex, answerIndex, field, value) => {
            this.setState((prevState) => ({
                questions: prevState.questions.map((q, i) =>
                    i === questionIndex
                        ? {
                            ...q,
                            answers: q.answers.map((a, j) => (j === answerIndex ? { ...a, [field]: value } : a)),
                        }
                        : q,
                ),
            }));
        };
    
        handleAnswerOptionSubmit = async (questionId, answer) => {
            try {
                const res = await fetch("http://localhost:7092/api/AnswerOption/CreateAnswerOption", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${this.state.token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        questionID: questionId,
                        optionText: answer.optionText,
                        scoreValue: Number(answer.scoreValue),
                    }),
                });
                const data = await res.json();
                if (data.success) {
                    toast.success("Tạo tùy chọn trả lời thành công");
                    this.handleViewQuestions(this.state.selectedAssessmentId);
                } else {
                    toast.error(data.message || "Tạo tùy chọn trả lời thất bại");
                }
            } catch (err) {
                toast.error(err.message || "Không thể tạo tùy chọn trả lời");
            }
        };
    
        addQuestion = () => {
            this.setState((prevState) => ({
                questions: [
                    ...prevState.questions,
                    {
                        questionText: "",
                        questionType: "yes/no",
                        answers: [
                            { optionText: "yes", scoreValue: 2 },
                            { optionText: "no", scoreValue: 0 },
                        ],
                    },
                ],
            }));
        };
    
        removeQuestion = (index) => {
            this.setState((prevState) => ({
                questions: prevState.questions.filter((_, i) => i !== index),
            }));
        };
    
        handleQuestionSubmit = async (e) => {
            e.preventDefault();
            const { newAssessmentID, questions } = this.state;
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
                        Authorization: `Bearer ${this.state.token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (data.success) {
                    toast.success("Tạo câu hỏi và đáp án thành công");
                    this.setState({
                        showQuestionModal: false,
                        questions: [
                            {
                                questionText: "",
                                questionType: "yes/no",
                                answers: [
                                    { optionText: "yes", scoreValue: 2 },
                                    { optionText: "no", scoreValue: 0 },
                                ],
                            },
                        ],
                    });
                } else {
                    toast.error(data.message || "Tạo câu hỏi thất bại");
                }
            } catch (err) {
                toast.error(err.message || "Không thể tạo câu hỏi");
            }
        };
    
        handleViewQuestions = async (id) => {
            try {
                const res = await fetch(`http://localhost:7092/api/Question/GetQuestionsByAssessmentId/${id}`, {
                    headers: { Authorization: `Bearer ${this.state.token}` },
                });
                const data = await res.json();
                if (data.success) {
                    this.setState({ viewQuestions: data.data || [], selectedAssessmentId: id, showViewModal: true });
                } else {
                    toast.error(data.message || "Không thể lấy danh sách câu hỏi");
                }
            } catch (err) {
                toast.error(err.message || "Không thể lấy danh sách câu hỏi");
            }
        };
    
        handleDeleteQuestion = async (questionId) => {
            if (!window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) return;
            try {
                const res = await fetch(`http://localhost:7092/api/Question/DeleteQuestionForAssessment?id=${questionId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${this.state.token}` },
                });
                const data = await res.json();
                if (data.success) {
                    this.setState((prevState) => ({
                        viewQuestions: prevState.viewQuestions.filter((q) => q.questionId !== questionId),
                    }));
                    toast.success("Xóa câu hỏi thành công");
                } else {
                    toast.error(data.message || "Không thể xóa câu hỏi");
                }
            } catch (err) {
                toast.error(err.message || "Không thể xóa câu hỏi");
            }
        };
    
        handleEditQuestion = (question) => {
            this.setState({
                editingQuestionId: question.questionId,
                editingQuestion: {
                    questionText: question.questionText,
                    questionType: question.questionType,
                },
            });
        };
    
        handleEditQuestionChange = (e) => {
            const { name, value } = e.target;
            this.setState((prevState) => ({
                editingQuestion: { ...prevState.editingQuestion, [name]: value },
            }));
        };
    
        handleEditQuestionSubmit = async (questionId) => {
            const { editingQuestion, selectedAssessmentId } = this.state;
            if (!editingQuestion.questionText || !selectedAssessmentId) {
                return toast.error("Vui lòng nhập nội dung câu hỏi và đảm bảo đã chọn bài đánh giá");
            }
    
            try {
                const res = await fetch(`http://localhost:7092/api/Question/UpdateQuestionForAssessment?id=${questionId}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${this.state.token}`,
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
                    this.setState((prevState) => ({
                        viewQuestions: prevState.viewQuestions.map((q) =>
                            q.questionId === questionId
                                ? { ...q, questionText: editingQuestion.questionText, questionType: editingQuestion.questionType }
                                : q,
                        ),
                        editingQuestionId: null,
                        editingQuestion: { questionText: "", questionType: "yes/no" },
                    }));
                    toast.success("Cập nhật câu hỏi thành công");
                } else {
                    toast.error(data.message || "Cập nhật câu hỏi thất bại");
                }
            } catch (err) {
                toast.error(err.message || "Không thể cập nhật câu hỏi");
            }
        };
    
        handleNewQuestionChange = (index, field, value) => {
            this.setState((prevState) => ({
                newQuestions: prevState.newQuestions.map((q, i) => (i === index ? { ...q, [field]: value } : q)),
            }));
        };
    
        handleNewAnswerChange = (questionIndex, answerIndex, field, value) => {
            this.setState((prevState) => ({
                newQuestions: prevState.newQuestions.map((q, i) =>
                    i === questionIndex
                        ? {
                            ...q,
                            answers: q.answers.map((a, j) => (j === answerIndex ? { ...a, [field]: value } : a)),
                        }
                        : q,
                ),
            }));
        };
    
        addNewQuestion = () => {
            this.setState((prevState) => ({
                newQuestions: [
                    ...prevState.newQuestions,
                    {
                        questionText: "",
                        questionType: "yes/no",
                        answers: [
                            { optionText: "yes", scoreValue: 2 },
                            { optionText: "no", scoreValue: 0 },
                        ],
                    },
                ],
                showAddQuestionForm: true,
            }));
        };
    
        removeNewQuestion = (index) => {
            this.setState((prevState) => ({
                newQuestions: prevState.newQuestions.filter((_, i) => i !== index),
                showAddQuestionForm: prevState.newQuestions.length > 1,
            }));
        };
    
        handleAddQuestionsSubmit = async (e) => {
            e.preventDefault();
            const { selectedAssessmentId, newQuestions } = this.state;
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
                        Authorization: `Bearer ${this.state.token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (data.success) {
                    toast.success("Tạo câu hỏi và đáp án thành công");
                    this.setState({
                        newQuestions: [],
                        showAddQuestionForm: false,
                    });
                    this.handleViewQuestions(selectedAssessmentId);
                } else {
                    toast.error(data.message || "Tạo câu hỏi thất bại");
                }
            } catch (err) {
                toast.error(err.message || "Không thể tạo câu hỏi");
            }
        };
    
        filteredCourses = () => {
            const { courses, formData, isEditing, assessments, editingAssessment } = this.state;
            return courses.filter((course) => {
                const courseType = course.type.trim();
                const matchesType = formData.assessmentType === "Crafft"
                    ? courseType === "HocSinh"
                    : (courseType === "SinhVien" || courseType === "PhuHuynh");
                if (!matchesType) return false;
                const isUsed = assessments.some(
                    (a) =>
                        a.assessmentStage === "Output" &&
                        a.courseID === course.courseID &&
                        (!isEditing || a.assessmentID !== editingAssessment?.assessmentID)
                );
                return !isUsed;
            });
        };
    
        render() {
            const {
                assessments,
                searchTerm,
                statusFilter,
                showAssessmentModal,
                showQuestionModal,
                showViewModal,
                assessmentType,
                formData,
                questions,
                viewQuestions,
                selectedAssessmentId,
                showAddQuestionForm,
                newQuestions,
                isEditing,
                editingQuestionId,
                editingQuestion,
            } = this.state;
    
            const filteredAssessments = assessments.filter(
                (assessment) =>
                    assessment.assessmentName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (statusFilter ? assessment.assessmentStage === statusFilter : true),
            );
    
            return (
                <div className="risk-assessment-container">
                    <div className="header-section">
                        <div className="header-content">
                            <div className="header-text">
                                <h1 className="page-title">Quản lý bài đánh giá</h1>
                                <p className="page-subtitle">Tổng cộng {assessments.length} bài đánh giá</p>
                            </div>
                            <button onClick={() => this.setState({ showAssessmentModal: true })} className="add-button">
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
                                onChange={this.handleSearch}
                                placeholder="Tìm kiếm bài đánh giá..."
                                className="search-input"
                            />
                        </div>
                        <select value={statusFilter} onChange={this.handleStatusFilter} className="filter-select">
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
                                                onClick={() => this.handleEdit(assessment.assessmentID)}
                                                className="action-button edit-button"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => this.handleDelete(assessment.assessmentID)}
                                                className="action-button delete-button"
                                                title="Xóa"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => this.handleViewQuestions(assessment.assessmentID)}
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
                                        onClick={() =>
                                            this.setState({
                                                showAssessmentModal: false,
                                                isEditing: false,
                                                editingAssessment: null,
                                                formData: { assessmentName: "", description: "", assessmentType: "Crafft", courseID: "" },
                                            })
                                        }
                                        className="close-button"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
    
                                <form onSubmit={this.handleAssessmentSubmit} className="modal-form">
                                    <div className="form-group">
                                        <label className="form-label">Loại bài đánh giá</label>
                                        <select
                                            value={assessmentType}
                                            onChange={(e) => this.setState({ assessmentType: e.target.value })}
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
                                            onChange={this.handleFormChange}
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
                                            onChange={this.handleFormChange}
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
                                            onChange={this.handleFormChange}
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
                                                onChange={this.handleFormChange}
                                                className="form-select"
                                                required
                                            >
                                                <option value="">Chọn khóa học</option>
                                                {this.filteredCourses().map((course) => (
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
                                    <button onClick={() => this.setState({ showQuestionModal: false })} className="close-button">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
    
                                <form onSubmit={this.handleQuestionSubmit} className="modal-form">
                                    <div className="questions-container">
                                        {questions.map((question, qIndex) => (
                                            <div key={qIndex} className="question-card">
                                                <div className="question-header">
                                                    <h4 className="question-title">Câu hỏi {qIndex + 1}</h4>
                                                    {questions.length > 1 && (
                                                        <button type="button" onClick={() => this.removeQuestion(qIndex)} className="remove-question-button">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
    
                                                <div className="form-group">
                                                    <label className="form-label">Nội dung câu hỏi</label>
                                                    <input
                                                        type="text"
                                                        value={question.questionText}
                                                        onChange={(e) => this.handleQuestionChange(qIndex, "questionText", e.target.value)}
                                                        className="form-input"
                                                        placeholder="Nhập nội dung câu hỏi..."
                                                        required
                                                    />
                                                </div>
    
                                                <div className="form-group">
                                                    <label className="form-label">Loại câu hỏi</label>
                                                    <select
                                                        value={question.questionType}
                                                        onChange={(e) => this.handleQuestionChange(qIndex, "questionType", e.target.value)}
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
                                                                onChange={(e) => this.handleAnswerChange(qIndex, aIndex, "optionText", e.target.value)}
                                                                placeholder="Tùy chọn"
                                                                className="form-input"
                                                                required
                                                            />
                                                            <input
                                                                type="number"
                                                                value={answer.scoreValue}
                                                                onChange={(e) => this.handleAnswerChange(qIndex, aIndex, "scoreValue", Number(e.target.value))}
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
                                        <button type="button" onClick={this.addQuestion} className="add-question-button">
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
                                    <button onClick={() => this.setState({ showViewModal: false })} className="close-button">
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
                                                                    onClick={() => this.handleEditQuestionSubmit(question.questionId)}
                                                                    className="action-button save-button"
                                                                    title="Lưu"
                                                                >
                                                                    <Save className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => this.setState({ editingQuestionId: null })}
                                                                    className="action-button cancel-button"
                                                                    title="Hủy"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={() => this.handleEditQuestion(question)}
                                                                    className="action-button edit-button"
                                                                    title="Chỉnh sửa"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => this.handleDeleteQuestion(question.questionId)}
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
                                                                onChange={this.handleEditQuestionChange}
                                                                className="form-input"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label">Loại câu hỏi</label>
                                                            <select
                                                                name="questionType"
                                                                value={editingQuestion.questionType}
                                                                onChange={this.handleEditQuestionChange}
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
                                                this.setState({ showAddQuestionForm: true });
                                                this.addNewQuestion();
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
                                            <form onSubmit={this.handleAddQuestionsSubmit}>
                                                <div className="new-questions-container">
                                                    {newQuestions.map((question, qIndex) => (
                                                        <div key={qIndex} className="question-card">
                                                            <div className="question-header">
                                                                <h5 className="question-title">Câu hỏi mới {qIndex + 1}</h5>
                                                                {newQuestions.length > 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => this.removeNewQuestion(qIndex)}
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
                                                                    onChange={(e) => this.handleNewQuestionChange(qIndex, "questionText", e.target.value)}
                                                                    className="form-input"
                                                                    placeholder="Nhập nội dung câu hỏi..."
                                                                    required
                                                                />
                                                            </div>
    
                                                            <div className="form-group">
                                                                <label className="form-label">Loại câu hỏi</label>
                                                                <select
                                                                    value={question.questionType}
                                                                    onChange={(e) => this.handleNewQuestionChange(qIndex, "questionType", e.target.value)}
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
                                                                            onChange={(e) => this.handleNewAnswerChange(qIndex, aIndex, "optionText", e.target.value)}
                                                                            placeholder="Tùy chọn"
                                                                            className="form-input"
                                                                            required
                                                                        />
                                                                        <input
                                                                            type="number"
                                                                            value={answer.scoreValue}
                                                                            onChange={(e) =>
                                                                                this.handleNewAnswerChange(qIndex, aIndex, "scoreValue", Number(e.target.value))
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
                                                    <button type="button" onClick={this.addNewQuestion} className="add-question-button">
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
        }
    }
    
    export default StaffAssessmentManagement;