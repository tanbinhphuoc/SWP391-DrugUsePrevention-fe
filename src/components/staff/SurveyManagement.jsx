import { useState } from "react";
import { Search, Edit2, Trash2, Plus, ClipboardList, BarChart3, Users, Calendar } from "lucide-react";

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

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "" || survey.type === filterType;
    const matchesStatus = filterStatus === "" || survey.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý khảo sát</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
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
    </div>
  );
};

export default SurveyManagement;