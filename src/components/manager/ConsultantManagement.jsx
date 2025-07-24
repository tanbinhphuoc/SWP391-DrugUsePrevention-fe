"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Edit2,
  UserPlus,
  Calendar,
  Mail,
  User,
  GraduationCap,
  Star,
  Globe,
  ShieldCheck,
  ShieldX,
} from "lucide-react"

const ConsultantManagement = () => {
  const [consultants, setConsultants] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSpecialty, setFilterSpecialty] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    email: "",
    fullName: "",
    degree: "",
    hourlyRate: "0",
    specialty: "",
    experience: "",
    certificateName: "",
    dateAcquired: "",
    googleMeetLink: "",
  })
  const [editId, setEditId] = useState(null)
  const token = localStorage.getItem("token") || sessionStorage.getItem("tempToken")

  // Show notification function
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000)
  }

  // Fetch consultants from API
  const fetchConsultants = async () => {
    try {
      const response = await fetch("http://localhost:7092/api/Appointments/GetAllConsultant", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.success) {
        const processedConsultants = data.data.map((c) => ({
          id: c.consultantID,
          userName: c.userName || "",
          name: c.fullName || c.userName,
          email: c.email,
          specialty: c.specialty || "",
          degree: c.degree || "",
          hourlyRate: c.hourlyRate || 0,
          certificateName: c.certificateName || "",
          dateAcquired: c.dateAcquired ? new Date(c.dateAcquired).toISOString().split("T")[0] : "",
          experience: c.experience || "",
          googleMeetLink: c.googleMeetLink || "",
          status: c.status || "Inactive",
          createdAt: c.createdAt ? new Date(c.createdAt).toISOString().split("T")[0] : "",
          updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString().split("T")[0] : "",
        }))
        setConsultants(processedConsultants)
      } else {
        showNotification("Không thể tải danh sách tư vấn viên.", "error")
      }
    } catch (error) {
      console.error("Error fetching consultants:", error.message)
      showNotification("Lỗi tải danh sách tư vấn viên.", "error")
    }
  }

  useEffect(() => {
    if (token) {
      fetchConsultants()
    } else {
      showNotification("Vui lòng đăng nhập để truy cập!", "error")
    }
  }, [token])

  // Toggle status
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

      setConsultants(consultants.map((c) => (c.id === userId ? { ...c, status: newStatus } : c)))
      showNotification(`Đã ${currentStatus === "Active" ? "ngưng kích hoạt" : "kích hoạt"} tài khoản thành công!`)
    } catch (err) {
      console.error("Toggle Status Error:", err)
      showNotification(err.message || "Đã xảy ra lỗi khi cập nhật trạng thái.", "error")
    }
  }

  // Filter consultants
  const filteredConsultants = consultants.filter((consultant) => {
    const matchesSearch =
      consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultant.userName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialty = filterSpecialty === "" || consultant.specialty === filterSpecialty
    const matchesStatus = filterStatus === "" || consultant.status === filterStatus
    return matchesSearch && matchesSpecialty && matchesStatus
  })

  // Handle form submission
  const handleAddOrUpdate = async (e) => {
    e.preventDefault()
    if (!token) {
      showNotification("Vui lòng đăng nhập để thực hiện thao tác!", "error")
      return
    }

    try {
      const body = {}
      if (formData.userName) body.userName = formData.userName
      if (formData.password && editId === null) body.password = formData.password
      if (formData.email) body.email = formData.email
      if (formData.fullName) body.fullName = formData.fullName
      if (formData.degree) body.degree = formData.degree
      if (formData.hourlyRate !== "") body.hourlyRate = Number.parseFloat(formData.hourlyRate)
      if (formData.specialty) body.specialty = formData.specialty
      if (formData.experience) body.experience = formData.experience
      if (formData.certificateName) body.certificateName = formData.certificateName
      if (formData.dateAcquired) body.dateAcquired = `${formData.dateAcquired}T00:00:00Z`
      if (formData.googleMeetLink) body.googleMeetLink = formData.googleMeetLink

      if (
        editId === null &&
        (!body.userName || !body.email || !body.fullName || !body.degree || !body.specialty || !body.certificateName)
      ) {
        showNotification("Vui lòng điền đầy đủ các trường bắt buộc khi thêm mới!", "error")
        return
      }

      const url =
        editId !== null
          ? `http://localhost:7092/api/Consultant/${editId}`
          : "http://localhost:7092/api/Consultant/createConsultant(Admin)"

      const response = await fetch(url, {
        method: editId !== null ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.message === "Consultant updated successfully." || data.message === "Consultant created successfully.") {
        await fetchConsultants()
        showNotification(data.message || (editId ? "Cập nhật thành công!" : "Thêm tư vấn viên thành công!"))
        setIsModalOpen(false)
        setFormData({
          userName: "",
          password: "",
          email: "",
          fullName: "",
          degree: "",
          hourlyRate: "0",
          specialty: "",
          experience: "",
          certificateName: "",
          dateAcquired: "",
          googleMeetLink: "",
        })
        setEditId(null)
      } else {
        showNotification(data.message || "Thao tác thất bại!", "error")
      }
    } catch (error) {
      console.error("Error:", error.message)
      showNotification(`Thao tác thất bại: ${error.message}`, "error")
    }
  }

  // Handle edit
  const handleEdit = (consultant) => {
    setFormData({
      userName: consultant.userName,
      password: "",
      email: consultant.email,
      fullName: consultant.name,
      degree: consultant.degree || "",
      hourlyRate: consultant.hourlyRate !== undefined ? consultant.hourlyRate.toString() : "0",
      specialty: consultant.specialty || "",
      experience: consultant.experience || "",
      certificateName: consultant.certificateName || "",
      dateAcquired: consultant.dateAcquired || "",
      googleMeetLink: consultant.googleMeetLink || "",
    })
    setEditId(consultant.id)
    setIsModalOpen(true)
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
                <UserPlus className="w-8 h-8 text-blue-600" />
                Quản lý Consultant
              </h1>
              <p className="text-gray-600 mt-2">Tổng cộng {consultants.length} tư vấn viên</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <UserPlus className="w-5 h-5" />
              <span>Thêm Consultant</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 bg-white/50"
            >
              <option value="">Tất cả chuyên môn</option>
              <option value="Tâm lý học lâm sàng">Tâm lý học lâm sàng</option>
              <option value="Tư vấn gia đình">Tư vấn gia đình</option>
              <option value="Y học cộng đồng">Y học cộng đồng</option>
              <option value="suport prevention">Hỗ trợ phòng ngừa</option>
            </select>
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

        {/* Consultant Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {filteredConsultants.map((consultant) => (
            <div
              key={consultant.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {consultant.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{consultant.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {consultant.userName}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    consultant.status === "Active"
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}
                >
                  {consultant.status === "Active" ? "Hoạt động" : "Không hoạt động"}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="break-all">{consultant.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <GraduationCap className="w-4 h-4 text-purple-500" />
                  <span>{consultant.specialty}</span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 text-xs text-purple-600 mb-1">
                    <GraduationCap className="w-3 h-3" />
                    Bằng cấp
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{consultant.degree || "Chưa có"}</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 text-xs text-green-600 mb-1">
                    <Star className="w-3 h-3" />
                    Lệ phí/giờ
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{consultant.hourlyRate.toLocaleString()} VND</p>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  Tham gia: {consultant.createdAt || "N/A"}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  Cập nhật: {consultant.updatedAt || "N/A"}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(consultant)}
                  className="flex-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 py-2 px-3 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 text-sm font-medium border border-blue-200"
                >
                  <Edit2 className="w-4 h-4 inline mr-1" />
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => handleToggleStatus(consultant.id, consultant.status)}
                  className={`py-2 px-3 rounded-xl transition-all duration-300 text-sm font-medium border ${
                    consultant.status === "Active"
                      ? "bg-gradient-to-r from-red-50 to-red-100 text-red-600 border-red-200 hover:from-red-100 hover:to-red-200"
                      : "bg-gradient-to-r from-green-50 to-green-100 text-green-600 border-green-200 hover:from-green-100 hover:to-green-200"
                  }`}
                >
                  {consultant.status === "Active" ? (
                    <ShieldX className="w-4 h-4 inline mr-1" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 inline mr-1" />
                  )}
                  {consultant.status === "Active" ? "Ngưng" : "Kích hoạt"}
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
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{consultants.length}</div>
                <div className="text-sm text-gray-600">Tổng Consultant</div>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {consultants.filter((c) => c.status === "Active").length}
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
                <h3 className="text-xl font-bold text-gray-900">
                  {editId ? "Sửa tư vấn viên" : "Thêm tư vấn viên mới"}
                </h3>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bằng cấp</label>
                    <input
                      type="text"
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300"
                      required={isAddMode}
                      placeholder="Nhập bằng cấp"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lệ phí/giờ (VND)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.hourlyRate}
                      onChange={(e) =>
                        setFormData({ ...formData, hourlyRate: e.target.value === "" ? "0" : e.target.value })
                      }
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300"
                      placeholder="Nhập lệ phí"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chuyên môn <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300"
                      required={isAddMode}
                    >
                      <option value="">Chọn chuyên môn</option>
                      <option value="Tâm lý học lâm sàng">Tâm lý học lâm sàng</option>
                      <option value="Tư vấn gia đình">Tư vấn gia đình</option>
                      <option value="Y học cộng đồng">Y học cộng đồng</option>
                      <option value="suport prevention">Hỗ trợ phòng ngừa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kinh nghiệm</label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300"
                      placeholder="Nhập kinh nghiệm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chứng chỉ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.certificateName}
                      onChange={(e) => setFormData({ ...formData, certificateName: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300"
                      required={isAddMode}
                      placeholder="Nhập tên chứng chỉ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày cấp chứng chỉ</label>
                    <input
                      type="date"
                      value={formData.dateAcquired}
                      onChange={(e) => setFormData({ ...formData, dateAcquired: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Liên kết Google Meet</label>
                    <input
                      type="url"
                      value={formData.googleMeetLink}
                      onChange={(e) => setFormData({ ...formData, googleMeetLink: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300"
                      placeholder="Nhập liên kết Google Meet"
                    />
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
                        degree: "",
                        hourlyRate: "0",
                        specialty: "",
                        experience: "",
                        certificateName: "",
                        dateAcquired: "",
                        googleMeetLink: "",
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

export default ConsultantManagement