import { useState, useEffect } from "react";
import { Search, Edit2, Trash2, UserPlus, Eye, Award, Calendar } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

// Giả lập API
const mockApi = {
  fetchStaff: async () => [
    { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@staff.com", role: "Staff", status: "Active", joinDate: "2024-01-15", lastLogin: "2024-05-20", department: "Quản lý khóa học", performance: "Xuất sắc", tasksCompleted: 45, coursesManaged: 12 },
    { id: 2, name: "Trần Thị B", email: "tranthib@staff.com", role: "Staff", status: "Active", joinDate: "2024-02-10", lastLogin: "2024-05-19", department: "Quản lý khảo sát", performance: "Tốt", tasksCompleted: 38, coursesManaged: 8 },
    { id: 3, name: "Lê Văn C", email: "levanc@staff.com", role: "Staff", status: "Inactive", joinDate: "2024-03-05", lastLogin: "2024-04-15", department: "Hỗ trợ người dùng", performance: "Trung bình", tasksCompleted: 22, coursesManaged: 5 },
  ],
  addStaff: async (data) => ({ id: Date.now(), ...data }),
  updateStaff: async (id, data) => ({ id, ...data }),
  deleteStaff: async (id) => id,
};

const StaffManagement = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", department: "", performance: "Tốt" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    mockApi.fetchStaff().then(setStaffMembers);
  }, []);

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "" || staff.department === filterDepartment;
    const matchesStatus = filterStatus === "" || staff.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const updated = await mockApi.updateStaff(editId, { ...formData, status: "Active" });
        setStaffMembers(staffMembers.map(s => s.id === editId ? updated : s));
        toast.success("Cập nhật nhân viên thành công!");
      } else {
        const newStaff = await mockApi.addStaff({ ...formData, status: "Active", joinDate: new Date().toISOString().split("T")[0], lastLogin: "-", tasksCompleted: 0, coursesManaged: 0 });
        setStaffMembers([...staffMembers, newStaff]);
        toast.success("Thêm nhân viên thành công!");
      }
      setIsModalOpen(false);
      setFormData({ name: "", email: "", department: "", performance: "Tốt" });
      setEditId(null);
    } catch {
      toast.error("Thao tác thất bại!");
    }
  };

  const handleEdit = (staff) => {
    setFormData({ name: staff.name, email: staff.email, department: staff.department, performance: staff.performance });
    setEditId(staff.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await mockApi.deleteStaff(id);
      setStaffMembers(staffMembers.filter(s => s.id !== id));
      toast.success("Xóa nhân viên thành công!");
    } catch {
      toast.error("Xóa thất bại!");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Staff</h2>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <UserPlus className="w-4 h-4" />
          <span>Thêm Staff mới</span>
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
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tất cả phòng ban</option>
          <option value="Quản lý khóa học">Quản lý khóa học</option>
          <option value="Quản lý khảo sát">Quản lý khảo sát</option>
          <option value="Hỗ trợ người dùng">Hỗ trợ người dùng</option>
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhân viên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng ban</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hiệu suất</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hoạt động</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">{staff.name.charAt(0)}</div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                        <div className="text-sm text-gray-500">{staff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{staff.department}</div>
                    <div className="text-sm text-gray-500">Tham gia: {staff.joinDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      staff.performance === "Xuất sắc" ? "bg-green-100 text-green-800" :
                      staff.performance === "Tốt" ? "bg-blue-100 text-blue-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>{staff.performance}</span>
                    <div className="text-xs text-gray-500 mt-1"><Award className="w-3 h-3 inline mr-1" />{staff.tasksCompleted} nhiệm vụ</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>Khóa học: {staff.coursesManaged}</div>
                    <div>Đăng nhập cuối: {staff.lastLogin}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      staff.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>{staff.status === "Active" ? "Hoạt động" : "Không hoạt động"}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => handleEdit(staff)} className="text-indigo-600 hover:text-indigo-900 p-1"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(staff.id)} className="text-red-600 hover:text-red-900 p-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{editId ? "Sửa nhân viên" : "Thêm nhân viên mới"}</h3>
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
                <label className="block text-sm font-medium text-gray-700">Phòng ban</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Chọn phòng ban</option>
                  <option value="Quản lý khóa học">Quản lý khóa học</option>
                  <option value="Quản lý khảo sát">Quản lý khảo sát</option>
                  <option value="Hỗ trợ người dùng">Hỗ trợ người dùng</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Hiệu suất</label>
                <select
                  value={formData.performance}
                  onChange={(e) => setFormData({ ...formData, performance: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="Xuất sắc">Xuất sắc</option>
                  <option value="Tốt">Tốt</option>
                  <option value="Trung bình">Trung bình</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Lưu</button>
                <button type="button" onClick={() => { setIsModalOpen(false); setEditId(null); }} className="px-4 py-2 bg-gray-600 text-white rounded">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{staffMembers.length}</div>
          <div className="text-sm text-gray-600">Tổng Staff</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{staffMembers.filter(s => s.status === "Active").length}</div>
          <div className="text-sm text-gray-600">Đang hoạt động</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-orange-600">{staffMembers.reduce((sum, staff) => sum + staff.tasksCompleted, 0)}</div>
          <div className="text-sm text-gray-600">Tổng nhiệm vụ hoàn thành</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">{(staffMembers.reduce((sum, staff) => sum + staff.tasksCompleted, 0) / staffMembers.length).toFixed(1)}</div>
          <div className="text-sm text-gray-600">Nhiệm vụ TB/người</div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default StaffManagement;
