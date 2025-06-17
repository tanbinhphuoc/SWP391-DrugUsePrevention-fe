import { useState, useEffect } from "react";
import { Search, Edit2, Trash2, UserPlus, X } from "lucide-react";

// Error Boundary Component
import React from "react";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-600 p-4">
          <h3>Đã xảy ra lỗi:</h3>
          <p>{this.state.error?.message || "Lỗi không xác định"}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AccountManagement = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    email: "",
    fullName: "",
    dateOfBirth: "",
    phone: "",
    address: "",
    roleName: "Member",
  });
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Định nghĩa danh sách role tĩnh
  const roles = ["Member", "Staff", "Manager"];

  // Use mock data instead of API call
  useEffect(() => {
    const mockUsers = [
      { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@example.com", role: "Member", status: "Active" },
      { id: 2, name: "Trần Thị B", email: "tranthib@example.com", role: "Manager", status: "Active" },
      { id: 3, name: "Lê Văn C", email: "levanc@example.com", role: "Staff", status: "Inactive" },
    ];
    setUsers(mockUsers);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Cập nhật tất cả các trường mà không kiểm tra ngay lập tức
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Xóa lỗi khi người dùng nhập lại
  };

  // Validate form
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.userName.trim()) {
      setError("Vui lòng nhập tên đăng nhập.");
      return false;
    }
    if (!formData.password.trim() || formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return false;
    }
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      setError("Vui lòng nhập email hợp lệ (e.g., example@email.com).");
      return false;
    }
    if (!formData.fullName.trim()) {
      setError("Vui lòng nhập họ và tên.");
      return false;
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      setError("Số điện thoại phải là 10 chữ số.");
      return false;
    }
    return true;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError("");

    try {
      const newUser = {
        id: Date.now(), // Temporary ID
        name: formData.fullName,
        email: formData.email,
        role: formData.roleName,
        status: "Active",
      };
      setUsers((prev) => [...prev, newUser]);
      setIsModalOpen(false);
      setFormData({
        userName: "",
        password: "",
        email: "",
        fullName: "",
        dateOfBirth: "",
        phone: "",
        address: "",
        roleName: "Member",
      });
      alert("Tạo tài khoản thành công! 🎉 (Mock data)");
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi tạo tài khoản.");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name &&
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (roleFilter ? user.role === roleFilter : true) &&
      (statusFilter ? user.status === statusFilter : true)
  );

  const InputField = ({ label, name, type = "text", placeholder, required = false }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name] || ""}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Quản lý tài khoản</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm tài khoản</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm tài khoản..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả vai trò</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Active">Đang hoạt động</option>
            <option value="Inactive">Không hoạt động</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
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
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "Manager"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Adding User */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Thêm tài khoản mới</h3>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <form onSubmit={handleCreateUser}>
                <InputField
                  label="Tên đăng nhập"
                  name="userName"
                  placeholder="Nhập tên đăng nhập (e.g., user123)"
                  required
                />
                <InputField
                  label="Mật khẩu"
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                  required
                />
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Nhập email (e.g., user@example.com)"
                  required
                />
                <InputField
                  label="Họ và tên"
                  name="fullName"
                  placeholder="Nhập họ và tên (e.g., Nguyễn Văn A)"
                  required
                />
                <InputField
                  label="Ngày sinh"
                  name="dateOfBirth"
                  type="date"
                  placeholder="Chọn ngày sinh"
                />
                <InputField
                  label="Số điện thoại"
                  name="phone"
                  type="tel"
                  placeholder="Nhập số điện thoại (10 số, e.g., 0901234567)"
                />
                <InputField
                  label="Địa chỉ"
                  name="address"
                  placeholder="Nhập địa chỉ (e.g., 123 Đường ABC)"
                />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                  <select
                    name="roleName"
                    value={formData.roleName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="" disabled>
                      Chọn vai trò
                    </option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tạo tài khoản
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AccountManagement;