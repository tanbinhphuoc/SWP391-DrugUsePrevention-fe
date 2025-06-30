import { useState } from "react";
import { Search, Edit2, Trash2, Plus, Megaphone, Users, Calendar, Target, Filter, BarChart3, TrendingUp, Award, Clock } from "lucide-react";

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
      linkedSurveys: ["Khảo sát trước chương trình", "Khảo sát sau chương trình"],
      progress: 65,
      effectiveness: 88
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
      linkedSurveys: ["Đánh giá hiệu quả hội thảo"],
      progress: 95,
      effectiveness: 0
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
      linkedSurveys: ["Đánh giá kiến thức trước đào tạo", "Đánh giá sau đào tạo"],
      progress: 100,
      effectiveness: 92
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

  const getTypeIcon = (type) => {
    switch (type) {
      case "Tuyên truyền": return <Megaphone className="w-5 h-5" />;
      case "Hội thảo": return <Users className="w-5 h-5" />;
      case "Đào tạo": return <Award className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Tuyên truyền": return "from-orange-500 to-red-500";
      case "Hội thảo": return "from-blue-500 to-indigo-500";
      case "Đào tạo": return "from-green-500 to-emerald-500";
      default: return "from-gray-500 to-slate-500";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Đang diễn ra":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200";
      case "Sắp diễn ra":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200";
      case "Đã hoàn thành":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 mb-8 text-white shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Quản lý chương trình truyền thông
            </h1>
            <p className="text-blue-100 text-lg">Theo dõi và quản lý các chương trình một cách hiệu quả</p>
          </div>
          <button className="group flex items-center space-x-3 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-semibold">Tạo chương trình mới</span>
          </button>
        </div>
      </div>

      {/* Enhanced Search and Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-xl border border-white/50">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Tìm kiếm chương trình..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md"
            />
          </div>
          <div className="flex space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md appearance-none cursor-pointer"
              >
                <option value="">Tất cả loại</option>
                <option value="Tuyên truyền">Tuyên truyền</option>
                <option value="Hội thảo">Hội thảo</option>
                <option value="Đào tạo">Đào tạo</option>
              </select>
            </div>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md appearance-none cursor-pointer"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Đang diễn ra">Đang diễn ra</option>
                <option value="Sắp diễn ra">Sắp diễn ra</option>
                <option value="Đã hoàn thành">Đã hoàn thành</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Programs Grid */}
      <div className="grid grid-cols-1 gap-8 mb-8">
        {filteredPrograms.map((program) => (
          <div
            key={program.id}
            className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-white/50 hover:border-indigo-200 transform hover:-translate-y-2"
          >
            {/* Gradient Header */}
            <div className={`h-2 bg-gradient-to-r ${getTypeColor(program.type)}`}></div>
            
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${getTypeColor(program.type)} text-white shadow-lg`}>
                      {getTypeIcon(program.type)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                        {program.title}
                      </h3>
                      <p className="text-gray-600 text-base leading-relaxed">{program.description}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Tiến độ</span>
                      <span className="text-sm font-bold text-indigo-600">{program.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${program.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Enhanced Info Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100 hover:shadow-lg transition-all duration-300">
                      <p className="text-sm text-orange-600 font-medium mb-1">Loại chương trình</p>
                      <p className="text-sm font-bold text-gray-900">{program.type}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300">
                      <p className="text-sm text-blue-600 font-medium mb-1">Đối tượng</p>
                      <p className="text-sm font-bold text-gray-900">{program.targetAudience}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium mb-1">Người tham gia</p>
                          <p className="text-xl font-bold text-gray-900">{program.participants.toLocaleString()}</p>
                        </div>
                        <Users className="w-6 h-6 text-green-500" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300">
                      <p className="text-sm text-purple-600 font-medium mb-1">Ngân sách</p>
                      <p className="text-sm font-bold text-gray-900">{program.budget}</p>
                    </div>
                  </div>

                  {/* Enhanced Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-indigo-500" />
                      <div>
                        <p className="text-xs text-gray-500">Bắt đầu</p>
                        <p className="text-sm font-semibold text-gray-900">{program.startDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-indigo-500" />
                      <div>
                        <p className="text-xs text-gray-500">Kết thúc</p>
                        <p className="text-sm font-semibold text-gray-900">{program.endDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Users className="w-5 h-5 text-indigo-500" />
                      <div>
                        <p className="text-xs text-gray-500">Điều phối</p>
                        <p className="text-sm font-semibold text-gray-900">{program.coordinator}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-500">Trạng thái</p>
                        <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${getStatusStyle(program.status)}`}>
                          {program.status}
                        </span>
                      </div>
                      {program.effectiveness > 0 && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm font-bold">{program.effectiveness}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Linked Surveys */}
                  <div className="border-t border-gray-100 pt-6">
                    <p className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-indigo-500" />
                      Khảo sát liên kết
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {program.linkedSurveys.map((survey, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105"
                        >
                          <Target className="w-3 h-3 mr-2" />
                          {survey}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex flex-col space-y-3 ml-6">
                  <button className="group p-3 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300 border border-emerald-200 hover:border-emerald-300 hover:shadow-lg transform hover:scale-110">
                    <Edit2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </button>
                  <button className="group p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 border border-red-200 hover:border-red-300 hover:shadow-lg transform hover:scale-110">
                    <Trash2 className="w-5 h-5 group-hover:scale-125 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold mb-1">{programs.length}</div>
              <div className="text-orange-100 font-medium">Tổng chương trình</div>
            </div>
            <BarChart3 className="w-10 h-10 text-white/80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold mb-1">
                {programs.filter(p => p.status === "Đang diễn ra").length}
              </div>
              <div className="text-green-100 font-medium">Đang diễn ra</div>
            </div>
            <TrendingUp className="w-10 h-10 text-white/80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold mb-1">
                {programs.reduce((sum, program) => sum + program.participants, 0).toLocaleString()}
              </div>
              <div className="text-blue-100 font-medium">Tổng người tham gia</div>
            </div>
            <Users className="w-10 h-10 text-white/80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold mb-1">
                {programs.filter(p => p.status === "Đã hoàn thành").length}
              </div>
              <div className="text-purple-100 font-medium">Đã hoàn thành</div>
            </div>
            <Award className="w-10 h-10 text-white/80" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramManagement;