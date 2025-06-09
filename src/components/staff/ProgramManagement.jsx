import { useState } from "react";
import { Search, Edit2, Trash2, Plus, Megaphone, Users, Calendar, Target } from "lucide-react";

const ProgramManagement = () => {
  const [programs, setPrograms] = useState([
    {
      id: 1,
      title: "Chiến dịch Tuyên truyền Học đường 2024",
      description: "Chương trình tuyên truyền về tác hại của ma túy tại các trường học",
      type: "Tuyên truyền",
      targetAudience: "Học sinh THPT",
      startDate: "2024-03-01",
      endDate: "2024-06-30",
      status: "Đang diễn ra",
      participants: 1250,
      budget: "50,000,000 VNĐ",
      coordinator: "Nguyễn Văn A",
      linkedSurveys: ["Khảo sát trước chương trình", "Khảo sát sau chương trình"]
    },
    {
      id: 2,
      title: "Hội thảo Phòng chống Ma túy Cộng đồng",
      description: "Tổ chức hội thảo nâng cao nhận thức cho cộng đồng",
      type: "Hội thảo",
      targetAudience: "Cộng đồng",
      startDate: "2024-06-15",
      endDate: "2024-06-16",
      status: "Sắp diễn ra",
      participants: 300,
      budget: "20,000,000 VNĐ",
      coordinator: "Trần Thị B",
      linkedSurveys: ["Đánh giá hiệu quả hội thảo"]
    },
    {
      id: 3,
      title: "Chương trình Đào tạo Giáo viên",
      description: "Đào tạo giáo viên về phương pháp giáo dục phòng chống ma túy",
      type: "Đào tạo",
      targetAudience: "Giáo viên",
      startDate: "2024-01-15",
      endDate: "2024-02-28",
      status: "Đã hoàn thành",
      participants: 150,
      budget: "30,000,000 VNĐ",
      coordinator: "Lê Văn C",
      linkedSurveys: ["Đánh giá kiến thức trước đào tạo", "Đánh giá sau đào tạo"]
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "" || program.type === filterType;
    const matchesStatus = filterStatus === "" || program.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý chương trình truyền thông</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Tạo chương trình mới</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm chương trình..."
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
          <option value="Tuyên truyền">Tuyên truyền</option>
          <option value="Hội thảo">Hội thảo</option>
          <option value="Đào tạo">Đào tạo</option>
        </select>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Đang diễn ra">Đang diễn ra</option>
          <option value="Sắp diễn ra">Sắp diễn ra</option>
          <option value="Đã hoàn thành">Đã hoàn thành</option>
        </select>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredPrograms.map((program) => (
          <div
            key={program.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <Megaphone className="w-6 h-6 text-orange-600" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{program.title}</h3>
                      <p className="text-gray-600 text-sm">{program.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Loại chương trình</p>
                      <p className="text-sm font-semibold text-gray-900">{program.type}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Đối tượng</p>
                      <p className="text-sm font-semibold text-gray-900">{program.targetAudience}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Người tham gia</p>
                      <p className="text-lg font-semibold text-gray-900">{program.participants}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Ngân sách</p>
                      <p className="text-sm font-semibold text-gray-900">{program.budget}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Bắt đầu: {program.startDate}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Kết thúc: {program.endDate}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Điều phối: {program.coordinator}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          program.status === "Đang diễn ra"
                            ? "bg-green-100 text-green-800"
                            : program.status === "Sắp diễn ra"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {program.status}
                      </span>
                    </div>
                  </div>

                  {/* Linked Surveys */}
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Khảo sát liên kết:</p>
                    <div className="flex flex-wrap gap-2">
                      {program.linkedSurveys.map((survey, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          <Target className="w-3 h-3 mr-1" />
                          {survey}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
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

      {/* Program Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-orange-600">{programs.length}</div>
          <div className="text-sm text-gray-600">Tổng chương trình</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {programs.filter(p => p.status === "Đang diễn ra").length}
          </div>
          <div className="text-sm text-gray-600">Đang diễn ra</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">
            {programs.reduce((sum, program) => sum + program.participants, 0)}
          </div>
          <div className="text-sm text-gray-600">Tổng người tham gia</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">
            {programs.filter(p => p.status === "Đã hoàn thành").length}
          </div>
          <div className="text-sm text-gray-600">Đã hoàn thành</div>
        </div>
      </div>
    </div>
  );
};

export default ProgramManagement;