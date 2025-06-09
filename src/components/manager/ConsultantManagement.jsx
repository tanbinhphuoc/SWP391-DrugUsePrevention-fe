import { useState } from "react";
import { Search, Edit2, Trash2, UserPlus, Eye, Calendar, Star, Clock, Award } from "lucide-react";

const ConsultantManagement = () => {
  const [consultants, setConsultants] = useState([
    { 
      id: 1, 
      name: "TS. Nguyễn Minh Anh", 
      email: "nguyenminhanh@consultant.com", 
      role: "Consultant", 
      status: "Active",
      joinDate: "2024-01-10",
      lastLogin: "2024-05-20",
      specialty: "Tâm lý học lâm sàng",
      experience: "15 năm",
      rating: 4.9,
      totalSessions: 156,
      weeklyHours: 25,
      certifications: ["Bác sĩ tâm lý", "Chứng chỉ tư vấn nghiện"],
      availability: "Thứ 2-6, 8:00-17:00"
    },
    { 
      id: 2, 
      name: "ThS. Trần Hương Ly", 
      email: "tranhuongly@consultant.com", 
      role: "Consultant", 
      status: "Active",
      joinDate: "2024-02-15",
      lastLogin: "2024-05-19",
      specialty: "Tư vấn gia đình",
      experience: "12 năm",
      rating: 4.8,
      totalSessions: 134,
      weeklyHours: 20,
      certifications: ["Thạc sĩ tâm lý", "Chứng chỉ tư vấn gia đình"],
      availability: "Thứ 2,4,6, 9:00-16:00"
    },
    { 
      id: 3, 
      name: "BS. Lê Văn Đức", 
      email: "levanduc@consultant.com", 
      role: "Consultant", 
      status: "Inactive",
      joinDate: "2024-03-01",
      lastLogin: "2024-04-20",
      specialty: "Y học cộng đồng",
      experience: "10 năm",
      rating: 4.7,
      totalSessions: 89,
      weeklyHours: 15,
      certifications: ["Bác sĩ đa khoa", "Chứng chỉ y học cộng đồng"],
      availability: "Thứ 3,5,7, 14:00-18:00"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredConsultants = consultants.filter(consultant => {
    const matchesSearch = consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = filterSpecialty === "" || consultant.specialty === filterSpecialty;
    const matchesStatus = filterStatus === "" || consultant.status === filterStatus;
    
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Consultant</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <UserPlus className="w-4 h-4" />
          <span>Thêm Consultant mới</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select 
          value={filterSpecialty}
          onChange={(e) => setFilterSpecialty(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tất cả chuyên môn</option>
          <option value="Tâm lý học lâm sàng">Tâm lý học lâm sàng</option>
          <option value="Tư vấn gia đình">Tư vấn gia đình</option>
          <option value="Y học cộng đồng">Y học cộng đồng</option>
        </select>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Active">Đang hoạt động</option>
          <option value="Inactive">Không hoạt động</option>
        </select>
      </div>

      {/* Consultants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredConsultants.map((consultant) => (
          <div key={consultant.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                  {consultant.name.split(' ').pop().charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{consultant.name}</h3>
                  <p className="text-sm text-gray-600">{consultant.specialty}</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-700 ml-1">{consultant.rating}</span>
                    <span className="text-sm text-gray-500 ml-2">({consultant.totalSessions} buổi)</span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                consultant.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {consultant.status === "Active" ? "Hoạt động" : "Không hoạt động"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Award className="w-4 h-4 mr-1" />
                  <span>Kinh nghiệm</span>
                </div>
                <p className="font-semibold text-gray-900">{consultant.experience}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Giờ/tuần</span>
                </div>
                <p className="font-semibold text-gray-900">{consultant.weeklyHours}h</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Chứng chỉ:</p>
              <div className="flex flex-wrap gap-2">
                {consultant.certifications.map((cert, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Lịch làm việc:</span>
              </div>
              <p className="text-sm text-gray-800">{consultant.availability}</p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>Tham gia: {consultant.joinDate}</span>
              <span>Đăng nhập cuối: {consultant.lastLogin}</span>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                <Eye className="w-4 h-4 inline mr-1" />
                Xem chi tiết
              </button>
              <button className="flex-1 bg-purple-50 text-purple-600 py-2 px-3 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium">
                <Edit2 className="w-4 h-4 inline mr-1" />
                Chỉnh sửa
              </button>
              <button className="bg-red-50 text-red-600 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Consultant Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">{consultants.length}</div>
          <div className="text-sm text-gray-600">Tổng Consultant</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {consultants.filter(c => c.status === "Active").length}
          </div>
          <div className="text-sm text-gray-600">Đang hoạt động</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">
            {consultants.reduce((sum, consultant) => sum + consultant.totalSessions, 0)}
          </div>
          <div className="text-sm text-gray-600">Tổng buổi tư vấn</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-orange-600">
            {(consultants.reduce((sum, consultant) => sum + consultant.rating, 0) / consultants.length).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Đánh giá trung bình</div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantManagement;