import { useState } from "react";
import { Search, Edit2, Trash2, Plus, ClipboardList, BarChart3, Users, Calendar, X, BookOpen, AlertCircle, Check } from "lucide-react";

const SurveyManagement = () => {
  const [surveys, setSurveys] = useState([
    {
      id: 1,
      name: "ASSIST (Alcohol, Smoking and Substance Involvement Screening Test)",
      description: "Đánh giá mức độ sử dụng và nguy cơ liên quan đến các chất gây nghiện",
      type: "Đánh giá rủi ro",
      questions: 8,
      timeLimit: 15,
      status: "Đang hoạt động",
      completions: 245,
      averageScore: 3.2,
      createdDate: "2024-01-10",
      lastUpdated: "2024-05-01"
    },
    {
      id: 2,
      name: "CRAFFT Screening Interview",
      description: "Công cụ sàng lọc sử dụng chất gây nghiện dành cho thanh thiếu niên",
      type: "Sàng lọc",
      questions: 6,
      timeLimit: 10,
      status: "Đang hoạt động",
      completions: 189,
      averageScore: 2.8,
      createdDate: "2024-02-15",
      lastUpdated: "2024-05-10"
    },
    {
      id: 3,
      name: "Khảo sát nhận thức về ma túy",
      description: "Đánh giá mức độ hiểu biết về tác hại của ma túy",
      type: "Khảo sát nhận thức",
      questions: 20,
      timeLimit: 25,
      status: "Đang phát triển",
      completions: 0,
      averageScore: 0,
      createdDate: "2024-05-01",
      lastUpdated: "2024-05-15"
    },
  ]);

  const [courses] = useState([
    { id: 1, name: "Khóa học phòng chống tệ nạn xã hội", status: "OPEN" },
    { id: 2, name: "Khóa học giáo dục sức khỏe", status: "OPEN" },
    { id: 3, name: "Khóa học tâm lý học đường", status: "CLOSED" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    assessmentName: "",
    description: "",
    assessmentType: "",
    assessmentStage: "",
    minAge: "",
    maxAge: "",
    courseID: ""
  });

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "" || survey.type === filterType;
    const matchesStatus = filterStatus === "" || survey.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.assessmentName.trim()) {
      newErrors.assessmentName = "Tên assessment là bắt buộc";
    } else if (formData.assessmentName.length < 5) {
      newErrors.assessmentName = "Tên assessment phải có ít nhất 5 ký tự";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    } else if (formData.description.length < 10) {
      newErrors.description = "Mô tả phải có ít nhất 10 ký tự";
    }

    if (!formData.assessmentType) {
      newErrors.assessmentType = "Vui lòng chọn loại assessment";
    }

    if (!formData.assessmentStage) {
      newErrors.assessmentStage = "Vui lòng chọn assessment stage";
    }

    if (formData.assessmentStage === "Output" && !formData.courseID) {
      newErrors.courseID = "Vui lòng chọn khóa học khi chọn Output stage";
    }

    if (!formData.minAge || !formData.maxAge) {
      newErrors.age = "Vui lòng nhập độ tuổi";
    } else if (parseInt(formData.minAge) >= parseInt(formData.maxAge)) {
      newErrors.age = "Độ tuổi tối thiểu phải nhỏ hơn độ tuổi tối đa";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateNew = () => {
    setShowModal(true);
    setFormData({
      assessmentName: "",
      description: "",
      assessmentType: "",
      assessmentStage: "",
      minAge: "",
      maxAge: "",
      courseID: ""
    });
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }

    // Auto-fill age ranges based on assessment type
    if (field === "assessmentType") {
      if (value === "Crafft") {
        setFormData(prev => ({
          ...prev,
          assessmentType: value,
          minAge: "12",
          maxAge: "18"
        }));
      } else if (value === "Assist") {
        setFormData(prev => ({
          ...prev,
          assessmentType: value,
          minAge: "19",
          maxAge: "200"
        }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newAssessment = {
      id: surveys.length + 1,
      name: formData.assessmentName,
      description: formData.description,
      type: formData.assessmentType === "Crafft" ? "Sàng lọc thanh thiếu niên" : "Đánh giá rủi ro",
      questions: formData.assessmentType === "Crafft" ? 6 : 8,
      timeLimit: formData.assessmentType === "Crafft" ? 10 : 15,
      status: "Đang phát triển",
      completions: 0,
      averageScore: 0,
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    setSurveys(prev => [...prev, newAssessment]);
    setShowModal(false);
    setIsSubmitting(false);
  };

  const CreateModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Tạo khảo sát mới</h3>
                <p className="text-purple-100 text-sm">Tạo assessment để đánh giá người dùng</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          <div className="space-y-6">
            {/* Assessment Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Tên Assessment <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.assessmentName}
                  onChange={(e) => handleInputChange("assessmentName", e.target.value)}
                  className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200 ${
                    errors.assessmentName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Ví dụ: Khảo sát đánh giá sức khỏe tâm lý..."
                  disabled={isSubmitting}
                />
                {errors.assessmentName && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.assessmentName}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Mô tả chi tiết <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200 resize-none ${
                    errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  rows="4"
                  placeholder="Mô tả mục đích, đối tượng và cách thức thực hiện assessment..."
                  disabled={isSubmitting}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {formData.description.length}/500
                </div>
                {errors.description && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.description}
                  </div>
                )}
              </div>
            </div>

            {/* Assessment Type & Stage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Loại Assessment <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.assessmentType}
                  onChange={(e) => handleInputChange("assessmentType", e.target.value)}
                  className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200 ${
                    errors.assessmentType ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Chọn loại assessment</option>
                  <option value="Crafft">🧒 Crafft (12-18 tuổi)</option>
                  <option value="Assist">👨‍💼 Assist (19+ tuổi)</option>
                </select>
                {errors.assessmentType && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.assessmentType}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Assessment Stage <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.assessmentStage}
                  onChange={(e) => handleInputChange("assessmentStage", e.target.value)}
                  className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200 ${
                    errors.assessmentStage ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Chọn thời điểm</option>
                  <option value="Input">📝 Trước khóa học</option>
                  <option value="Output">🎯 Sau khóa học</option>
                </select>
                {errors.assessmentStage && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.assessmentStage}
                  </div>
                )}
              </div>
            </div>

            {/* Course Selection (conditional) */}
            {formData.assessmentStage === "Output" && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <label className="block text-sm font-semibold text-blue-900">
                    Chọn khóa học liên kết <span className="text-red-500">*</span>
                  </label>
                </div>
                <select
                  value={formData.courseID}
                  onChange={(e) => handleInputChange("courseID", e.target.value)}
                  className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 bg-white ${
                    errors.courseID ? 'border-red-300 bg-red-50' : 'border-blue-200 hover:border-blue-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Chọn khóa học...</option>
                  {courses.filter(course => course.status === "OPEN").map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
                {errors.courseID && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.courseID}
                  </div>
                )}
              </div>
            )}

            {/* Age Range */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
              <h4 className="font-semibold text-gray-700 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Độ tuổi đối tượng
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Tối thiểu
                  </label>
                  <input
                    type="number"
                    value={formData.minAge}
                    onChange={(e) => handleInputChange("minAge", e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all"
                    min="0"
                    max="200"
                    readOnly={formData.assessmentType !== ""}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Tối đa
                  </label>
                  <input
                    type="number"
                    value={formData.maxAge}
                    onChange={(e) => handleInputChange("maxAge", e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all"
                    min="0"
                    max="200"
                    readOnly={formData.assessmentType !== ""}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              {errors.age && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.age}
                </div>
              )}
            </div>

            {/* Preview Info */}
            {formData.assessmentType && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  Thông tin assessment
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-600">Số câu hỏi:</span>
                    <span className="ml-2 font-medium">{formData.assessmentType === "Crafft" ? "6" : "8"} câu</span>
                  </div>
                  <div>
                    <span className="text-green-600">Thời gian:</span>
                    <span className="ml-2 font-medium">{formData.assessmentType === "Crafft" ? "10" : "15"} phút</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
              disabled={isSubmitting}
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Tạo khảo sát</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý khảo sát</h2>
        <button 
          onClick={handleCreateNew}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo khảo sát mới</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm khảo sát..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tất cả loại</option>
          <option value="Đánh giá rủi ro">Đánh giá rủi ro</option>
          <option value="Sàng lọc">Sàng lọc</option>
          <option value="Khảo sát nhận thức">Khảo sát nhận thức</option>
        </select>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Đang hoạt động">Đang hoạt động</option>
          <option value="Đang phát triển">Đang phát triển</option>
          <option value="Không hoạt động">Không hoạt động</option>
        </select>
      </div>

      {/* Surveys Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredSurveys.map((survey) => (
          <div
            key={survey.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <ClipboardList className="w-6 h-6 text-purple-600" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{survey.name}</h3>
                      <p className="text-gray-600 text-sm">{survey.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Loại khảo sát</p>
                      <p className="text-sm font-semibold text-gray-900">{survey.type}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Số câu hỏi</p>
                      <p className="text-lg font-semibold text-gray-900">{survey.questions}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Thời gian (phút)</p>
                      <p className="text-lg font-semibold text-gray-900">{survey.timeLimit}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Lượt hoàn thành</p>
                      <p className="text-lg font-semibold text-gray-900">{survey.completions}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Điểm TB</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {survey.averageScore > 0 ? survey.averageScore.toFixed(1) : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Tạo: {survey.createdDate}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Cập nhật: {survey.lastUpdated}</span>
                      </div>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        survey.status === "Đang hoạt động"
                          ? "bg-green-100 text-green-800"
                          : survey.status === "Đang phát triển"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {survey.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <BarChart3 className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Survey Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">{surveys.length}</div>
          <div className="text-sm text-gray-600">Tổng khảo sát</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {surveys.filter(s => s.status === "Đang hoạt động").length}
          </div>
          <div className="text-sm text-gray-600">Đang hoạt động</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">
            {surveys.reduce((sum, survey) => sum + survey.completions, 0)}
          </div>
          <div className="text-sm text-gray-600">Tổng lượt hoàn thành</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-orange-600">
            {surveys.reduce((sum, survey) => sum + survey.questions, 0)}
          </div>
          <div className="text-sm text-gray-600">Tổng câu hỏi</div>
        </div>
      </div>

      {/* Modal */}
      {showModal && <CreateModal />}
    </div>
  );
};

export default SurveyManagement;