import { useState, useEffect } from "react";
import { Search, Edit2, UserPlus, Eye, Calendar } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

const StaffManagement = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    email: "",
    fullName: "",
    dateOfBirth: "",
    phone: "",
    address: "",
    roleName: "Staff",
  });
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem("token") || sessionStorage.getItem("tempToken");

  // Fetch staff from API
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch("http://localhost:7092/api/Admin/GetAllUsers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          const processedStaff = data.data
            .filter(user => user.roleName === "Staff")
            .map(user => ({
              id: user.userID,
              name: user.fullName || user.userName,
              email: user.email,
              department: user.roleName || "N/A",
              status: user.status || "Inactive",
              joinDate: user.createdAt ? new Date(user.createdAt).toISOString().split("T")[0] : "N/A",
              lastLogin: user.updatedAt ? new Date(user.updatedAt).toISOString().split("T")[0] : "N/A",
              tasksCompleted: 0,
              coursesManaged: 0,
            }));
          setStaffMembers(processedStaff);
        } else {
          toast.error("Không thể tải danh sách nhân viên.");
        }
      } catch (error) {
        console.error("Error fetching staff:", error.message);
        toast.error("Lỗi tải danh sách nhân viên.");
      }
    };
    if (token) fetchStaff();
    else toast.error("Vui lòng đăng nhập để truy cập!");
  }, [token]);

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
      const body = {
        userName: formData.userName,
        password: formData.password,
        email: formData.email,
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth ? `${formData.dateOfBirth}T00:00:00Z` : null,
        phone: formData.phone,
        address: formData.address,
        roleName: formData.roleName,
      };

      if (!editId) {
        // Tạo mới
        const response = await fetch("http://localhost:7092/api/Auth/admin/create-user", {
          method: "POST",
          headers: {
            "Accept": "*/*",
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Create API Error:", response.status, errorText);
          throw new Error(`Tạo tài khoản thất bại. Mã lỗi: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const newStaff = {
          id: data.userID,
          name: data.fullName,
          email: data.email,
          department: data.roleName,
          status: data.status || "Active",
          joinDate: data.createdAt ? new Date(data.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          lastLogin: data.updatedAt ? new Date(data.updatedAt).toISOString().split("T")[0] : "-",
          tasksCompleted: 0,
          coursesManaged: 0,
        };
        setStaffMembers([...staffMembers, newStaff]);
        toast.success("Tạo tài khoản thành công!");
      } else {
        // Cập nhật
        const updateBody = {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          dateOfBirth: formData.dateOfBirth ? `${formData.dateOfBirth}T00:00:00Z` : null,
          email: formData.email,
        };
        const response = await fetch(`http://localhost:7092/api/Users/${editId}/AdminUpdateProfileUser`, {
          method: "PUT",
          headers: {
            "Accept": "*/*",
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateBody),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Update API Error:", response.status, errorText);
          throw new Error(`Cập nhật tài khoản thất bại. Mã lỗi: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        setStaffMembers(staffMembers.map(s => s.id === editId ? { ...s, ...updateBody, status: data.status, updatedAt: data.updatedAt } : s));
        toast.success("Cập nhật tài khoản thành công!");
      }

      setIsModalOpen(false);
      setFormData({
        userName: "",
        password: "",
        email: "",
        fullName: "",
        dateOfBirth: "",
        phone: "",
        address: "",
        roleName: "Staff",
      });
      setEditId(null);
    } catch (err) {
      console.error("Create/Update Error:", err);
      toast.error(err.message || "Đã xảy ra lỗi khi thực hiện thao tác.");
    }
  };

  const handleEdit = (staff) => {
    setFormData({
      userName: staff.email.split("@")[0],
      password: "",
      email: staff.email,
      fullName: staff.name,
      dateOfBirth: staff.dateOfBirth || "",
      phone: staff.phone || "",
      address: staff.address || "",
      roleName: staff.department,
    });
    setEditId(staff.id);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      const actionMessage = currentStatus === "Active" ? "ngưng kích hoạt" : "kích hoạt";
      const response = await fetch(`http://localhost:7092/api/Admin/users/${userId}/SetStatusForUser`, {
        method: "PUT",
        headers: {
          "Accept": "*/*",
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStatus),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Toggle Status API Error:", response.status, errorText);
        throw new Error(`Cập nhật trạng thái thất bại. Mã lỗi: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Cập nhật trạng thái không thành công.");
      }

      setStaffMembers(staffMembers.map(s => s.id === userId ? { ...s, status: newStatus } : s));
      toast.success(`Đã ${actionMessage} tài khoản thành công!`);
    } catch (err) {
      console.error("Toggle Status Error:", err);
      toast.error(err.message || "Đã xảy ra lỗi khi cập nhật trạng thái.");
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
          <option value="Staff">Staff</option>
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
                      <button onClick={() => handleToggleStatus(staff.id, staff.status)} className="text-yellow-600 hover:text-yellow-900 p-1">
                        {staff.status === "Active" ? "Ngưng kích hoạt" : "Kích hoạt"}
                      </button>
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
                <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-2 border rounded"
                  required={!editId} // Chỉ yêu cầu khi tạo mới
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
                <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Phòng ban</label>
                <select
                  value={formData.roleName}
                  onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="Staff">Staff</option>
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
          <div className="text-2xl font-bold text-purple-600">{(staffMembers.reduce((sum, staff) => sum + staff.tasksCompleted, 0) / staffMembers.length).toFixed(1) || 0}</div>
          <div className="text-sm text-gray-600">Nhiệm vụ TB/người</div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default StaffManagement;
