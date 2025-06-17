import { useState, useEffect } from "react";
import { Search, Edit2, Trash2, Plus, FileText, AlertTriangle } from "lucide-react";

const RiskAssessmentManagement = () => {
  const [assessments, setAssessments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState(""); // State mới cho độ tuổi

  // Fetch danh sách assessments khi component mount
  useEffect(() => {
    fetchAssessments();
  }, []);

  // Hàm fetch assessments từ API
  const fetchAssessments = async (age = null) => {
    try {
      const token = localStorage.getItem("token");
      const url = age
        ? `https://localhost:7092/api/Assessment/GetAssessmentByAge?age=${age}`
        : "https://localhost:7092/api/Assessment/GetAllAssessment";
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Không thể tải danh sách bài đánh giá.");
      const data = await response.json();
      setAssessments(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Xử lý filter theo trạng thái
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  // Xử lý filter theo độ tuổi
  const handleAgeFilter = (e) => {
    const age = e.target.value;
    setAgeFilter(age);
    fetchAssessments(age ? parseInt(age) : null);
  };

  // Xử lý xóa assessment
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài đánh giá này?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://localhost:7092/api/Assessment/DeleteAssessment?id=${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Xóa thất bại.");
        setAssessments(assessments.filter((item) => item.assessmentID !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Xử lý chỉnh sửa assessment
  const handleEdit = (id) => {
    console.log("Editing assessment:", id);
  };

  // Filter assessments dựa trên search và status
  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch = assessment.assessmentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? assessment.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý bài đánh giá</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Thêm bài đánh giá</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Tìm kiếm bài đánh giá..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={handleStatusFilter}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Đang hoạt động">Đang hoạt động</option>
          <option value="Đang phát triển">Đang phát triển</option>
          <option value="Không hoạt động">Không hoạt động</option>
        </select>
        <select
          value={ageFilter}
          onChange={handleAgeFilter}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tất cả độ tuổi</option>
          <option value="16">Dưới 18 tuổi</option>
          <option value="20">Trên 18 tuổi</option>
        </select>
      </div>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredAssessments.map((assessment) => (
          <div
            key={assessment.assessmentID}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{assessment.assessmentName}</h3>
                      <p className="text-gray-600 text-sm">{assessment.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Số câu hỏi</p>
                      <p className="text-lg font-semibold text-gray-900">{assessment.questions?.length || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Thời gian (phút)</p>
                      <p className="text-lg font-semibold text-gray-900">{assessment.timeLimit || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Lượt hoàn thành</p>
                      <p className="text-lg font-semibold text-gray-900">{assessment.completions || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Trạng thái</p>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          assessment.status === "Đang hoạt động"
                            ? "bg-green-100 text-green-800"
                            : assessment.status === "Đang phát triển"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {assessment.status || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Các mức độ nguy cơ:</p>
                    <div className="flex flex-wrap gap-2">
                      {(assessment.riskLevels || []).map((level, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                        >
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(assessment.assessmentID)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(assessment.assessmentID)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskAssessmentManagement;