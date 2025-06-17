import { useState } from "react";
import { Search, Edit2, Trash2, UserPlus, Eye, MoreVertical, Award, Calendar } from "lucide-react";

const StaffManagement = () => {
  const [staffMembers, setStaffMembers] = useState([
    { 
      id: 1, 
      name: "Nguyễn Văn A", 
      email: "nguyenvana@staff.com", 
      role: "Staff", 
      status: "Active",
      joinDate: "2024-01-15",
      lastLogin: "2024-05-20",
      department: "Quản lý khóa học",
      performance: "Xuất sắc",
      tasksCompleted: 45,
      coursesManaged: 12
    },
    { 
      id: 2, 
      name: "Trần Thị B", 
      email: "tranthib@staff.com", 
      role: "Staff", 
      status: "Active",
      joinDate: "2024-02-10",
      lastLogin: "2024-05-19",
      department: "Quản lý khảo sát",
      performance: "Tốt",
      tasksCompleted: 38,
      coursesManaged: 8
    },
    { 
      id: 3, 
      name: "Lê Văn C", 
      email: "levanc@staff.com", 
      role: "Staff", 
      status: "Inactive",
      joinDate: "2024-03-05",
      lastLogin: "2024-04-15",
      department: "Hỗ trợ người dùng",
      performance: "Trung bình",
      tasksCompleted: 22,
      coursesManaged: 5
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "" || staff.department === filterDepartment;
    const matchesStatus = filterStatus === "" || staff.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Staff</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <UserPlus className="w-4 h-4" />
          <span>Thêm Staff mới</span>
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

      {/* Staff Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nhân viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phòng ban
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hiệu suất
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hoạt động
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                          {staff.name.charAt(0)}
                        </div>
                      </div>
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
                    }`}>
                      {staff.performance}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      <Award className="w-3 h-3 inline mr-1" />
                      {staff.tasksCompleted} nhiệm vụ
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>Khóa học: {staff.coursesManaged}</div>
                    <div>Đăng nhập cuối: {staff.lastLogin}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      staff.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {staff.status === "Active" ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900 p-1">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{staffMembers.length}</div>
          <div className="text-sm text-gray-600">Tổng Staff</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {staffMembers.filter(s => s.status === "Active").length}
          </div>
          <div className="text-sm text-gray-600">Đang hoạt động</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-orange-600">
            {staffMembers.reduce((sum, staff) => sum + staff.tasksCompleted, 0)}
          </div>
          <div className="text-sm text-gray-600">Tổng nhiệm vụ hoàn thành</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">
            {(staffMembers.reduce((sum, staff) => sum + staff.tasksCompleted, 0) / staffMembers.length).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Nhiệm vụ TB/người</div>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;