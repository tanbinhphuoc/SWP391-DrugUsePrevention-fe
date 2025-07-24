"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Edit2,
  UserPlus,
  Calendar,
  Mail,
  User,
  Phone,
  MapPin,
  Shield,
  ShieldCheck,
  ShieldX,
  Users,
  UserCheck,
} from "lucide-react"

const StaffManagement = () => {
  const [staffMembers, setStaffMembers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    email: "",
    fullName: "",
    dateOfBirth: "",
    phone: "",
    address: "",
    roleName: "Staff",
  })
  const [editId, setEditId] = useState(null)
  const token = localStorage.getItem("token") || sessionStorage.getItem("tempToken")

  // Show notification function
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000)
  }

  // Fetch staff from API
  const fetchStaff = async () => {
    try {
      const response = await fetch("http://localhost:7092/api/Admin/GetAllUsers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.success) {
        const processedStaff = data.data
          .filter((user) => user.roleName === "Staff")
          .map((user) => ({
            id: user.userID,
            userName: user.userName || "",
            name: user.fullName || user.userName,
            email: user.email,
            roleName: user.roleName || "Staff",
            status: user.status || "Inactive",
            dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "",
            phone: user.phone || "",
            address: user.address || "",
            createdAt: user.createdAt ? new Date(user.createdAt).toISOString().split("T")[0] : "",
            updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString().split("T")[0] : "",
          }))
        setStaffMembers(processedStaff)
      } else {
        showNotification("Không thể tải danh sách nhân viên.", "error")
      }
    } catch (error) {
      console.error("Error fetching staff:", error.message)
      showNotification("Lỗi tải danh sách nhân viên.", "error")
    }
  }

  useEffect(() => {
    if (token) {
      fetchStaff()
    } else {
      showNotification("Vui lòng đăng nhập để truy cập!", "error")
    }
  }, [token])

  // Filter staff
  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.userName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "" || staff.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Handle form submission
  const handleAddOrUpdate = async (e) => {
    e.preventDefault()
    if (!token) {
      showNotification("Vui lòng đăng nhập để thực hiện thao tác!", "error")
      return
    }

    try {
      if (!editId) {
        // Create new staff
        const body = {
          userName: formData.userName,
          password: formData.password,
          email: formData.email,
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth ? `${formData.dateOfBirth}T00:00:00Z` : null,
          phone: formData.phone,
          address: formData.address,
          roleName: formData.roleName,
        }

        const response = await fetch("http://localhost:7092/api/Auth/admin/create-user", {
          method: "POST",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Tạo tài khoản thất bại. Mã lỗi: ${response.status}`)
        }

        await fetchStaff() // Reload data
        showNotification("Tạo tài khoản thành công!")
      } else {
        // Update existing staff
        const updateBody = {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          dateOfBirth: formData.dateOfBirth ? `${formData.dateOfBirth}T00:00:00Z` : null,
          email: formData.email,
        }

        const response = await fetch(`http://localhost:7092/api/Users/${editId}/AdminUpdateProfileUser`, {
          method: "PUT",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateBody),
        })

        if (!response.ok) {
          throw new Error(`Cập nhật tài khoản thất bại. Mã lỗi: ${response.status}`)
        }

        await fetchStaff() // Reload data
        showNotification("Cập nhật tài khoản thành công!")
      }

      setIsModalOpen(false)
      setFormData({
        userName: "",
        password: "",
        email: "",
        fullName: "",
        dateOfBirth: "",
        phone: "",
        address: "",
        roleName: "Staff",
      })
      setEditId(null)
    } catch (err) {
      console.error("Create/Update Error:", err)
      showNotification(err.message || "Đã xảy ra lỗi khi thực hiện thao tác.", "error")
    }
  }

  // Handle edit
  const handleEdit = (staff) => {
    setFormData({
      userName: staff.userName,
      password: "",
      email: staff.email,
      fullName: staff.name,
      dateOfBirth: staff.dateOfBirth || "",
      phone: staff.phone || "",
      address: staff.address || "",
      roleName: staff.roleName,
    })
    setEditId(staff.id)
    setIsModalOpen(true)
  }

  // Handle toggle status
  const handleToggleStatus = async (userId, currentStatus) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn ${currentStatus === "Active" ? "ngưng kích hoạt" : "kích hoạt"} tài khoản này?`,
      )
    )
      return

    try {
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active"
      const response = await fetch(`http://localhost:7092/api/Admin/users/${userId}/SetStatusForUser`, {
        method: "PUT",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStatus),
      })

      if (!response.ok) {
        throw new Error(`Cập nhật trạng thái thất bại. Mã lỗi: ${response.status}`)
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || "Cập nhật trạng thái không thành công.")
      }

      setStaffMembers(staffMembers.map((s) => (s.id === userId ? { ...s, status: newStatus } : s)))
      showNotification(`Đã ${currentStatus === "Active" ? "ngưng kích hoạt" : "kích hoạt"} tài khoản thành công!`)
    } catch (err) {
      console.error("Toggle Status Error:", err)
      showNotification(err.message || "Đã xảy ra lỗi khi cập nhật trạng thái.", "error")
    }
  }

  const isAddMode = editId === null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                Quản lý Staff
              </h1>
              <p className="text-gray-600 mt-2">Tổng cộng {staffMembers.length} nhân viên</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <UserPlus className="w-5 h-5" />
              <span>Thêm Staff</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email hoặc username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 bg-white/50"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 bg-white/50"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Active">Đang hoạt động</option>
              <option value="Inactive">Không hoạt động</option>
            </select>
          </div>
        </div>

        {/* Staff Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {staff.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{staff.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {staff.userName}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    staff.status === "Active"
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}
                >
                  {staff.status === "Active" ? "Hoạt động" : "Không hoạt động"}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="break-all">{staff.email}</span>
                </div>
                {staff.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-green-500" />
                    <span>{staff.phone}</span>
                  </div>
                )}
                {staff.address && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>{staff.address}</span>
                  </div>
                )}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 text-xs text-purple-600 mb-1">
                    <Shield className="w-3 h-3" />
                    Vai trò
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{staff.roleName}</p>
                </div>
                {staff.dateOfBirth && (
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 text-xs text-blue-600 mb-1">
                      <Calendar className="w-3 h-3" />
                      Ngày sinh
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{staff.dateOfBirth}</p>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  Tham gia: {staff.createdAt || "N/A"}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  Cập nhật: {staff.updatedAt || "N/A"}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(staff)}
                  className="flex-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 py-2 px-3 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 text-sm font-medium border border-blue-200"
                >
                  <Edit2 className="w-4 h-4 inline mr-1" />
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => handleToggleStatus(staff.id, staff.status)}
                  className={`py-2 px-3 rounded-xl transition-all duration-300 text-sm font-medium border ${
                    staff.status === "Active"
                      ? "bg-gradient-to-r from-red-50 to-red-100 text-red-600 border-red-200 hover:from-red-100 hover:to-red-200"
                      : "bg-gradient-to-r from-green-50 to-green-100 text-green-600 border-green-200 hover:from-green-100 hover:to-green-200"
                  }`}
                >
                  {staff.status === "Active" ? (
                    <ShieldX className="w-4 h-4 inline mr-1" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 inline mr-1" />
                  )}
                  {staff.status === "Active" ? "Ngưng" : "Kích hoạt"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{staffMembers.length}</div>
                <div className="text-sm text-gray-600">Tổng Staff</div>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {staffMembers.filter((s) => s.status === "Active").length}
                </div>
                <div className="text-sm text-gray-600">Đang hoạt động</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">{editId ? "Sửa nhân viên" : "Thêm nhân viên mới"}</h3>
              </div>

              <form onSubmit={handleAddOrUpdate} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên đăng nhập {isAddMode && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={formData.userName}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300"
                      required={isAddMode}
                      disabled={!isAddMode}
                      placeholder="Nhập tên đăng nhập"
                    />
                  </div>

                  {isAddMode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300"
                        required={isAddMode}
                        placeholder="Nhập mật khẩu"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300"
                      required
                      placeholder="Nhập email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300"
                      required
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300"
                      placeholder="Nhập địa chỉ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vai trò <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.roleName}
                      onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300"
                      required
                    >
                      <option value="Staff">Staff</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                  >
                    {editId ? "Cập nhật" : "Thêm mới"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false)
                      setEditId(null)
                      setFormData({
                        userName: "",
                        password: "",
                        email: "",
                        fullName: "",
                        dateOfBirth: "",
                        phone: "",
                        address: "",
                        roleName: "Staff",
                      })
                    }}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StaffManagement
