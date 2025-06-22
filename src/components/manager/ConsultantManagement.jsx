import { useState, useEffect } from "react";
import { Search, Edit2, Trash2, UserPlus, Calendar, Star, Clock, Award } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

// Giả lập API
const mockApi = {
  fetchConsultants: async () => [
    { id: 1, name: "TS. Nguyễn Minh Anh", email: "nguyenminhanh@consultant.com", role: "Consultant", status: "Active", joinDate: "2024-01-10", lastLogin: "2024-05-20", specialty: "Tâm lý học lâm sàng", experience: "15 năm", rating: 4.9, totalSessions: 156, weeklyHours: 25, certifications: ["Bác sĩ tâm lý", "Chứng chỉ tư vấn nghiện"], availability: ["Thứ 2-6, 8:00-17:00"] },
    { id: 2, name: "ThS. Trần Hương Ly", email: "tranhuongly@consultant.com", role: "Consultant", status: "Active", joinDate: "2024-02-15", lastLogin: "2024-05-19", specialty: "Tư vấn gia đình", experience: "12 năm", rating: 4.8, totalSessions: 134, weeklyHours: 20, certifications: ["Thạc sĩ tâm lý", "Chứng chỉ tư vấn gia đình"], availability: ["Thứ 2,4,6, 9:00-16:00"] },
    { id: 3, name: "BS. Lê Văn Đức", email: "levanduc@consultant.com", role: "Consultant", status: "Inactive", joinDate: "2024-03-01", lastLogin: "2024-04-20", specialty: "Y học cộng đồng", experience: "10 năm", rating: 4.7, totalSessions: 89, weeklyHours: 15, certifications: ["Bác sĩ đa khoa", "Chứng chỉ y học cộng đồng"], availability: ["Thứ 3,5,7, 14:00-18:00"] },
  ],
  addConsultant: async (data) => ({ id: Date.now(), ...data }),
  updateConsultant: async (id, data) => ({ id, ...data }),
  deleteConsultant: async (id) => id,
};

const ConsultantManagement = () => {
  const [consultants, setConsultants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", specialty: "", experience: "", certifications: [], availability: [] });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    mockApi.fetchConsultants().then(setConsultants);
  }, []);

  const filteredConsultants = consultants.filter(consultant => {
    const matchesSearch = consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = filterSpecialty === "" || consultant.specialty === filterSpecialty;
    const matchesStatus = filterStatus === "" || consultant.status === filterStatus;
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      const processedData = {
        ...formData,
        certifications: formData.certifications.split(",").map(c => c.trim()),
        availability: formData.availability.split(",").map(a => a.trim()),
        status: "Active",
      };
      if (editId) {
        const updated = await mockApi.updateConsultant(editId, processedData);
        setConsultants(consultants.map(c => c.id === editId ? updated : c));
        toast.success("Cập nhật tư vấn viên thành công!");
      } else {
        const newConsultant = await mockApi.addConsultant({ ...processedData, joinDate: new Date().toISOString().split("T")[0], lastLogin: "-", totalSessions: 0, weeklyHours: 20, rating: 0 });
        setConsultants([...consultants, newConsultant]);
        toast.success("Thêm tư vấn viên thành công!");
      }
      setIsModalOpen(false);
      setFormData({ name: "", email: "", specialty: "", experience: "", certifications: [], availability: [] });
      setEditId(null);
    } catch {
      toast.error("Thao tác thất bại!");
    }
  };

  const handleEdit = (consultant) => {
    setFormData({
      name: consultant.name,
      email: consultant.email,
      specialty: consultant.specialty,
      experience: consultant.experience,
      certifications: consultant.certifications.join(", "),
      availability: consultant.availability.join(", ")
    });
    setEditId(consultant.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await mockApi.deleteConsultant(id);
      setConsultants(consultants.filter(c => c.id !== id));
      toast.success("Xóa tư vấn viên thành công!");
    } catch {
      toast.error("Xóa thất bại!");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Consultant</h2>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <UserPlus className="w-4 h-4" />
          <span>Thêm Consultant mới</span>
        </button>
      </div>

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
              }`}>{consultant.status === "Active" ? "Hoạt động" : "Không hoạt động"}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-sm text-gray-600 mb-1"><Award className="w-4 h-4 mr-1" />Kinh nghiệm</div>
                <p className="font-semibold text-gray-900">{consultant.experience}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-sm text-gray-600 mb-1"><Clock className="w-4 h-4 mr-1" />Giờ/tuần</div>
                <p className="font-semibold text-gray-900">{consultant.weeklyHours}h</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Chứng chỉ:</p>
              <div className="flex flex-wrap gap-2">
                {consultant.certifications.map((cert, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{cert}</span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center text-sm text-gray-600 mb-1"><Calendar className="w-4 h-4 mr-1" />Lịch làm việc:</div>
              <p className="text-sm text-gray-800">{consultant.availability.join(", ")}</p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>Tham gia: {consultant.joinDate}</span>
              <span>Đăng nhập cuối: {consultant.lastLogin}</span>
            </div>

            <div className="flex space-x-2">
              <button onClick={() => handleEdit(consultant)} className="flex-1 bg-purple-50 text-purple-600 py-2 px-3 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium">
                <Edit2 className="w-4 h-4 inline mr-1" />Chỉnh sửa
              </button>
              <button onClick={() => handleDelete(consultant.id)} className="bg-red-50 text-red-600 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{editId ? "Sửa tư vấn viên" : "Thêm tư vấn viên mới"}</h3>
            <form onSubmit={handleAddOrUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tên</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Chuyên môn</label>
                <select
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Chọn chuyên môn</option>
                  <option value="Tâm lý học lâm sàng">Tâm lý học lâm sàng</option>
                  <option value="Tư vấn gia đình">Tư vấn gia đình</option>
                  <option value="Y học cộng đồng">Y học cộng đồng</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Kinh nghiệm</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Chứng chỉ (phân tách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="VD: Bác sĩ tâm lý, Chứng chỉ tư vấn"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Lịch làm việc (phân tách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="VD: Thứ 2-6, 8:00-17:00"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded">Lưu</button>
                <button type="button" onClick={() => { setIsModalOpen(false); setEditId(null); }} className="px-4 py-2 bg-gray-600 text-white rounded">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">{consultants.length}</div>
          <div className="text-sm text-gray-600">Tổng Consultant</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{consultants.filter(c => c.status === "Active").length}</div>
          <div className="text-sm text-gray-600">Đang hoạt động</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{consultants.reduce((sum, consultant) => sum + consultant.totalSessions, 0)}</div>
          <div className="text-sm text-gray-600">Tổng buổi tư vấn</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-orange-600">{(consultants.reduce((sum, consultant) => sum + consultant.rating, 0) / consultants.length).toFixed(1)}</div>
          <div className="text-sm text-gray-600">Đánh giá trung bình</div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ConsultantManagement;
