"use client"
import { useState, useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, UserCheck } from "lucide-react"
import "react-toastify/dist/ReactToastify.css"

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    dateOfBirth: "",
    phone: "",
    address: "",
  })

  const calculateAge = (dobStr) => {
    if (!dobStr) return ""
    const dob = new Date(dobStr)
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    return age
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.")
        }
        const response = await fetch("http://localhost:7092/api/Users/GetProfileMember", {
          method: "GET",
          headers: {
            Accept: "text/plain",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }

        const data = await response.json()

        setForm({
          name: data.fullName,
          email: data.email,
          role: data.roleName,
          dateOfBirth: data.dateOfBirth.split("T")[0],
          phone: data.phone,
          address: data.address,
        })
      } catch (error) {
        toast.error(error.message || "Không thể tải hồ sơ người dùng!")
      }
    }

    fetchProfile()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.")
      }
      const updateData = {
        fullName: form.name,
        phone: form.phone,
        address: form.address,
        dateOfBirth: new Date(form.dateOfBirth).toISOString(),
        email: form.email,
      }

      const updateResponse = await fetch("http://localhost:7092/api/Users/profile/UserUpdateProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })

      if (!updateResponse.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedProfile = await updateResponse.json()

      setForm({
        name: updatedProfile.fullName,
        email: updatedProfile.email,
        role: updatedProfile.roleName,
        dateOfBirth: updatedProfile.dateOfBirth.split("T")[0],
        phone: updatedProfile.phone,
        address: updatedProfile.address,
      })

      toast.success("Cập nhật hồ sơ thành công!")
      setIsEditing(false)
      localStorage.setItem("userAge", calculateAge(updatedProfile.dateOfBirth))
    } catch (error) {
      toast.error(error.message || "Cập nhật thất bại!")
    }
  }

  return (
    <div className="mt-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,_rgba(120,119,198,0.3)_0%,_transparent_50%),radial-gradient(circle_at_80%_20%,_rgba(255,119,198,0.3)_0%,_transparent_50%)]"></div>

        <div className="relative z-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-1 text-shadow">Hồ sơ cá nhân</h2>
              <p className="text-white/90 font-medium">Quản lý thông tin tài khoản của bạn</p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-white/30 hover:transform hover:-translate-y-1 hover:shadow-lg"
              aria-label="Cập nhật hồ sơ cá nhân"
            >
              <Edit3 className="w-4 h-4" />
              <span>Chỉnh sửa</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-8">
        {isEditing ? (
          /* Edit Form */
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 hover:border-gray-300 hover:shadow-md placeholder:text-gray-400"
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 hover:border-gray-300 hover:shadow-md placeholder:text-gray-400"
                  placeholder="Nhập địa chỉ email"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 hover:border-gray-300 hover:shadow-md placeholder:text-gray-400"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Ngày sinh
                </label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 hover:border-gray-300 hover:shadow-md"
                  required
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2 space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 hover:border-gray-300 hover:shadow-md placeholder:text-gray-400"
                  placeholder="Nhập địa chỉ"
                  required
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:transform hover:-translate-y-1 hover:shadow-lg shadow-green-500/25"
              >
                <Save className="w-4 h-4" />
                <span>Lưu thay đổi</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 bg-gray-100 border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-200 hover:border-gray-300 hover:transform hover:-translate-y-1"
              >
                <X className="w-4 h-4" />
                <span>Hủy bỏ</span>
              </button>
            </div>
          </form>
        ) : (
          /* Display View */
          <div className="space-y-8">
            {/* Avatar Section */}
            <div className="flex items-center gap-6 p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/30">
                {form.name ? form.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{form.name || "Chưa có tên"}</h3>
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold border border-blue-200">
                  <UserCheck className="w-4 h-4" />
                  <span>{form.role || "Chưa xác định"}</span>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid gap-6">
              <div className="flex items-center gap-4 p-6 bg-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-200 transition-all duration-300 hover:bg-gray-100/80 hover:transform hover:-translate-y-1 hover:shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-semibold text-gray-600 block mb-1">Email</span>
                  <span className="text-base font-medium text-gray-900">{form.email || "Chưa có email"}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-200 transition-all duration-300 hover:bg-gray-100/80 hover:transform hover:-translate-y-1 hover:shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-semibold text-gray-600 block mb-1">Số điện thoại</span>
                  <span className="text-base font-medium text-gray-900">{form.phone || "Chưa có số điện thoại"}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-200 transition-all duration-300 hover:bg-gray-100/80 hover:transform hover:-translate-y-1 hover:shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-semibold text-gray-600 block mb-1">Địa chỉ</span>
                  <span className="text-base font-medium text-gray-900">{form.address || "Chưa có địa chỉ"}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-200 transition-all duration-300 hover:bg-gray-100/80 hover:transform hover:-translate-y-1 hover:shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-semibold text-gray-600 block mb-1">Tuổi</span>
                  <span className="text-base font-medium text-gray-900">
                    {calculateAge(form.dateOfBirth) ? `${calculateAge(form.dateOfBirth)} tuổi` : "Chưa có thông tin"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="!rounded-xl !shadow-xl !border !border-white/20 !backdrop-blur-md"
        bodyClassName="!font-medium"
      />
    </div>
  )
}

export default UserProfile
