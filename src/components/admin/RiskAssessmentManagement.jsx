import { useState } from "react";
import { Search, Edit2, Trash2, Plus, FileText, AlertTriangle } from "lucide-react";

const RiskAssessmentManagement = () => {
  const [assessments, setAssessments] = useState([
    {
      id: 1,
      name: "ASSIST (Alcohol, Smoking and Substance Involvement Screening Test)",
      description: "Đánh giá mức độ sử dụng và nguy cơ liên quan đến các chất gây nghiện",
      questions: 8,
      timeLimit: 15,
      status: "Đang hoạt động",
      completions: 245,
      riskLevels: ["Thấp", "Trung bình", "Cao"],
    },
    {
      id: 2,
      name: "CRAFFT Screening Interview",
      description: "Công cụ sàng lọc sử dụng chất gây nghiện dành cho thanh thiếu niên",
      questions: 6,
      timeLimit: 10,
      status: "Đang hoạt động",
      completions: 189,
      riskLevels: ["Không có nguy cơ", "Có nguy cơ"],
    },
    {
      id: 3,
      name: "DAST (Drug Abuse Screening Test)",
      description: "Đánh giá mức độ lạm dụng ma túy và các vấn đề liên quan",
      questions: 10,
      timeLimit: 20,
      status: "Đang phát triển",
      completions: 0,
      riskLevels: ["Thấp", "Trung bình", "Đáng kể", "Nghiêm trọng"],
    },
  ]);

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
            placeholder="Tìm kiếm bài đánh giá..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="development">Đang phát triển</option>
          <option value="inactive">Không hoạt động</option>
        </select>
      </div>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 gap-6">
        {assessments.map((assessment) => (
          <div
            key={assessment.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{assessment.name}</h3>
                      <p className="text-gray-600 text-sm">{assessment.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Số câu hỏi</p>
                      <p className="text-lg font-semibold text-gray-900">{assessment.questions}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Thời gian (phút)</p>
                      <p className="text-lg font-semibold text-gray-900">{assessment.timeLimit}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Lượt hoàn thành</p>
                      <p className="text-lg font-semibold text-gray-900">{assessment.completions}</p>
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
                        {assessment.status}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Các mức độ nguy cơ:</p>
                    <div className="flex flex-wrap gap-2">
                      {assessment.riskLevels.map((level, index) => (
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
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
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
    </div>
  );
};

export default RiskAssessmentManagement;