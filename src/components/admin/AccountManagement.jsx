"use client"

import React, { useState, useEffect } from "react"
import { Search, Edit2, Power, RefreshCw, Users, UserPlus } from "lucide-react"
import toast, { Toaster } from 'react-hot-toast'; // Assuming react-hot-toast is installed; install via npm if not

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-600 p-4 bg-red-50 border border-red-200 rounded-lg m-4">
          <h3 className="font-semibold">Đã xảy ra lỗi:</h3>
          <p>{this.state.error?.message || "Lỗi không xác định"}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

const AccountManagement = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    email: '',
    fullName: '',
    dateOfBirth: '',
    phone: '',
    address: '',
    roleName: 'Member',
    degree: '',
    hourlyRate: '',
    specialty: '',
    experience: '',
    certificateName: '',
    dateAcquired: '',
    googleMeetLink: '',
  })

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Vui lòng đăng nhập với vai trò Admin để tiếp tục.")
      }

      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]))
        const expiresAt = tokenData.exp ? new Date(tokenData.exp * 1000) : null
        const now = new Date() 
        if (expiresAt && now > expiresAt) {
          throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")
        }

        if (!tokenData.role || tokenData.role !== "Admin") {
          throw new Error("Bạn không có quyền Admin để truy cập.")
        }
      } catch (e) {
        console.warn("Không thể giải mã token", e)
        throw new Error("Token xác thực không hợp lệ. Vui lòng đăng nhập lại.")
      }

      const response = await fetch("http://localhost:7092/api/Admin/GetAllUsers", {
        method: "GET",
        headers: {
          "Accept": "*/*",
          "Authorization": `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error:", response.status, errorText)
        throw new Error(`Lấy danh sách người dùng thất bại. Mã lỗi: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      if (!data.success || !Array.isArray(data.data)) {
        console.error("API Response:", data)
        throw new Error(data.message || "Dữ liệu API không hợp lệ.")
      }

      setUsers(data.data.map((user) => ({
        id: user.userID,
        userName: user.userName || '',
        fullName: user.fullName || '',
        email: user.email || "Không có email",
        role: user.roleName || "Unknown",
        status: user.status || "Inactive",
      })))
    } catch (err) {
      console.error("Fetch Error:", err)
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.")
      toast.error(err.message || "Đã xảy ra lỗi khi tải dữ liệu.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSearch = (e) => setSearchTerm(e.target.value)
  const handleRoleFilter = (e) => setRoleFilter(e.target.value)
  const handleStatusFilter = (e) => setStatusFilter(e.target.value)

  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (user) =>
          user &&
          (
            user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
          ) &&
          (roleFilter ? user.role === roleFilter : true) &&
          (statusFilter ? user.status === statusFilter : true)
      )
    : []

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Thêm validation cho form data
  const validateFormData = (data) => {
    if (!data.email?.includes('@')) {
      toast.error('Email không hợp lệ');
      return false;
    }
    if (data.roleName === 'Consultant' && !data.hourlyRate) {
      toast.error('Vui lòng nhập giá tư vấn');
      return false;
    }
    return true;
  };

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!validateFormData(formData)) return;
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Vui lòng đăng nhập với vai trò Admin để tiếp tục.")
      }

      let url
      let body
      if (formData.roleName === "Consultant") {
        url = "http://localhost:7092/api/Consultant/createConsultant(Admin)"
        body = {
          userName: formData.userName,
          password: formData.password,
          email: formData.email,
          fullName: formData.fullName,
          degree: formData.degree,
          hourlyRate: parseFloat(formData.hourlyRate),
          specialty: formData.specialty,
          experience: formData.experience,
          certificateName: formData.certificateName,
          dateAcquired: formData.dateAcquired ? `${formData.dateAcquired}T00:00:00Z` : null,
        }
      } else {
        url = "http://localhost:7092/api/Auth/admin/create-user"
        body = {
          userName: formData.userName,
          password: formData.password,
          email: formData.email,
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth ? `${formData.dateOfBirth}T00:00:00Z` : null,
          phone: formData.phone,
          address: formData.address,
          roleName: formData.roleName,
        }
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Accept": "*/*",
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Create API Error:", response.status, errorText)
        throw new Error(`Tạo tài khoản thất bại. Mã lỗi: ${response.status} - ${errorText}`)
      }

      toast.success("Tạo tài khoản thành công!")
      setShowCreateModal(false)
      fetchUsers()
    } catch (err) {
      console.error("Create Error:", err)
      toast.error(err.message || "Đã xảy ra lỗi khi tạo tài khoản.")
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!validateFormData(formData)) return;
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Vui lòng đăng nhập với vai trò Admin để tiếp tục.")
      }

      let url
      let body
      if (selectedUser.role === "Consultant") {
        url = `http://localhost:7092/api/Consultant/${selectedUser.id}UpdateConsultant`
        body = {
          userName: formData.userName,
          password: formData.password,
          email: formData.email,
          fullName: formData.fullName,
          degree: formData.degree,
          hourlyRate: parseFloat(formData.hourlyRate) || 0,
          specialty: formData.specialty,
          experience: formData.experience,
          certificateName: formData.certificateName,
          dateAcquired: formData.dateAcquired ? `${formData.dateAcquired}T00:00:00Z` : null,
          googleMeetLink: formData.googleMeetLink || null,
        }
      } else {
        url = `http://localhost:7092/api/Users/${selectedUser.id}/AdminUpdateProfileUser`
        body = {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          dateOfBirth: formData.dateOfBirth ? `${formData.dateOfBirth}T00:00:00Z` : null,
          email: formData.email,
        }
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Accept": "*/*",
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Update API Error:", response.status, errorText)
        throw new Error(`Cập nhật tài khoản thất bại. Mã lỗi: ${response.status} - ${errorText}`)
      }

      toast.success("Cập nhật tài khoản thành công!")
      setShowEditModal(false)
      fetchUsers()
    } catch (err) {
      console.error("Update Error:", err)
      toast.error(err.message || "Đã xảy ra lỗi khi cập nhật tài khoản.")
    }
  }

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    const actionMessage = newStatus === "Inactive" ? "vô hiệu hóa" : "kích hoạt";

    if (!window.confirm(`Bạn có chắc chắn muốn ${actionMessage} tài khoản này?`)) return;

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Vui lòng đăng nhập với vai trò Admin để tiếp tục.")
      }

      const url = `http://localhost:7092/api/Admin/users/${user.id}/SetStatusForUser`;

      const response = await fetch(url, {
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

      toast.success(`Đã ${actionMessage} tài khoản thành công!`);
      fetchUsers();
    } catch (err) {
      console.error("Toggle Status Error:", err);
      toast.error(err.message || "Đã xảy ra lỗi khi cập nhật trạng thái.");
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user)
    setFormData({
      userName: user.userName,
      password: '',
      email: user.email,
      fullName: user.fullName,
      dateOfBirth: '',
      phone: '',
      address: '',
      degree: '',
      hourlyRate: '',
      specialty: '',
      experience: '',
      certificateName: '',
      dateAcquired: '',
      googleMeetLink: '',
    })
    setShowEditModal(true)
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý tài khoản</h1>
              <p className="text-gray-600">Quản lý và theo dõi tất cả tài khoản người dùng</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Làm mới
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                Thêm tài khoản
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border-0 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Tìm kiếm tài khoản theo tên hoặc email..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={roleFilter}
                  onChange={handleRoleFilter}
                  className="w-48 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                >
                  <option value="">Tất cả vai trò</option>
                  {Array.from(new Set(users.map(user => user.role))).sort().map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={handleStatusFilter}
                  className="w-48 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                >
                  <option value="">Tất cả trạng thái</option>
                  {Array.from(new Set(users.map(user => user.status))).sort().map(status => (
                    <option key={status} value={status}>{status === "Active" ? "Đang hoạt động" : status === "Inactive" ? "Không hoạt động" : "Không xác định"}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-red-800">{error}</span>
                <button
                  onClick={fetchUsers}
                  className="px-3 py-1 text-sm border border-red-300 text-red-700 rounded hover:bg-red-100 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="flex items-center gap-3 text-gray-600">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Đang tải tài khoản...</span>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredUsers.length === 0 && (
            <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border-0">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy tài khoản</h3>
              <p className="text-gray-600 mb-4">Thử thay đổi bộ lọc hoặc tạo tài khoản mới</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Tạo tài khoản mới
              </button>
            </div>
          )}

          {/* Users Table */}
          {!loading && !error && filteredUsers.length > 0 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border-0 overflow-hidden">
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
                        <div className="text-sm font-medium text-gray-900">{user.fullName || user.userName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "Admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "Consultant"
                              ? "bg-yellow-100 text-yellow-800"
                              : user.role === "Staff"
                              ? "bg-green-100 text-green-800"
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
                          {user.status === "Active" ? "Đang hoạt động" : user.status === "Inactive" ? "Không hoạt động" : "Không xác định"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          aria-label={`Edit user ${user.fullName || user.userName}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`${user.status === "Active" ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}`}
                          aria-label={`${user.status === "Active" ? "Deactivate" : "Activate"} user ${user.id}`}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Create Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Tạo tài khoản mới</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                    <input
                      name="userName"
                      value={formData.userName}
                      onChange={handleFormChange}
                      required
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                    <input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      required
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      required
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                    <select
                      name="roleName"
                      value={formData.roleName}
                      onChange={handleFormChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Member">Member</option>
                      <option value="Staff">Staff</option>
                      <option value="Consultant">Consultant</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  {formData.roleName !== 'Consultant' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                        <input
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleFormChange}
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleFormChange}
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                        <input
                          name="address"
                          value={formData.address}
                          onChange={handleFormChange}
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}
                  {formData.roleName === 'Consultant' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bằng cấp</label>
                        <input
                          name="degree"
                          value={formData.degree}
                          onChange={handleFormChange}
                          required
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Giá tư vấn/giờ</label>
                        <input
                          name="hourlyRate"
                          type="number"
                          value={formData.hourlyRate}
                          onChange={handleFormChange}
                          required
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Chuyên môn</label>
                        <input
                          name="specialty"
                          value={formData.specialty}
                          onChange={handleFormChange}
                          required
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Kinh nghiệm</label>
                        <input
                          name="experience"
                          value={formData.experience}
                          onChange={handleFormChange}
                          required
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tên chứng chỉ</label>
                        <input
                          name="certificateName"
                          value={formData.certificateName}
                          onChange={handleFormChange}
                          required
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Ngày cấp chứng chỉ</label>
                        <input
                          name="dateAcquired"
                          type="date"
                          value={formData.dateAcquired}
                          onChange={handleFormChange}
                          required
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Tạo
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditModal && selectedUser && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Sửa thông tin tài khoản</h2>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      required
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {selectedUser.role !== 'Consultant' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                        <input
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleFormChange}
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleFormChange}
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                        <input
                          name="address"
                          value={formData.address}
                          onChange={handleFormChange}
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}
                  {selectedUser.role === 'Consultant' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                        <input
                          name="userName"
                          value={formData.userName}
                          onChange={handleFormChange}
                          required
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Mật khẩu (tùy chọn)</label>
                        <input
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleFormChange}
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bằng cấp</label>
                        <input
                          name="degree"
                          value={formData.degree}
                          onChange={handleFormChange}
                          required
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Giá tư vấn/giờ</label>
                        <input
                          name="hourlyRate"
                          type="number"
                          value={formData.hourlyRate}
                          onChange={handleFormChange}
                          required
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Chuyên môn</label>
                        <input
                          name="specialty"
                          value={formData.specialty}
                          onChange={handleFormChange}
                          required
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Kinh nghiệm</label>
                        <input
                          name="experience"
                          value={formData.experience}
                          onChange={handleFormChange}
                          required
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tên chứng chỉ</label>
                        <input
                          name="certificateName"
                          value={formData.certificateName}
                          onChange={handleFormChange}
                          required
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Ngày cấp chứng chỉ</label>
                        <input
                          name="dateAcquired"
                          type="date"
                          value={formData.dateAcquired}
                          onChange={handleFormChange}
                          required
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Link Google Meet</label>
                        <input
                          name="googleMeetLink"
                          value={formData.googleMeetLink}
                          onChange={handleFormChange}
                          className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Cập nhật
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              duration: 3000,
              style: {
                background: '#22c55e',
                color: 'white',
              },
            },
            error: {
              duration: 3000,
              style: {
                background: '#ef4444', 
                color: 'white',
              },
            },
          }}
        />
      </div>
    </ErrorBoundary>
  )
}

export default AccountManagement