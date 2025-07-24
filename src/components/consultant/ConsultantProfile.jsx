import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Award, DollarSign, Calendar, Link2, Edit3, Save, X, Loader, CheckCircle, AlertCircle } from "lucide-react";

const ConsultantProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editError, setEditError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Vui lòng đăng nhập để tiếp tục.");
      }

      const response = await fetch("http://localhost:7092/api/Consultant/ConsultantGetProfile", {
        method: "GET",
        headers: {
          "Accept": "*/*",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lấy thông tin hồ sơ thất bại: ${errorText}`);
      }

      const data = await response.json();
      if (!data.success || !data.data) {
        throw new Error("Dữ liệu không hợp lệ.");
      }

      setProfile(data.data);
      setFormData(data.data); // Nạp dữ liệu đầy đủ vào formData khi tải lần đầu
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value ? `${value}T00:00:00Z` : null }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Vui lòng đăng nhập để tiếp tục.");
      }

      const body = {
        password: formData.password || undefined,
        email: formData.email || undefined,
        fullName: formData.fullName || undefined,
        degree: formData.degree || undefined,
        hourlyRate: formData.hourlyRate || undefined,
        specialty: formData.specialty || undefined,
        experience: formData.experience || undefined,
        certificateName: formData.certificateName || undefined,
        dateAcquired: formData.dateAcquired || undefined,
        googleMeetLink: formData.googleMeetLink || undefined,
      };

      // Loại bỏ các trường undefined để hỗ trợ partial update
      Object.keys(body).forEach((key) => body[key] === undefined && delete body[key]);

      const response = await fetch("http://localhost:7092/api/Consultant/UpdateConsultantByConsultant", {
        method: "PUT",
        headers: {
          "Accept": "*/*",
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cập nhật hồ sơ thất bại: ${errorText}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error("Cập nhật không thành công.");
      }

      setSuccess("Cập nhật hồ sơ thành công!");
      setIsEditing(false);
      await fetchProfile();

      // Auto hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
        <section className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <Loader className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-gray-600">Đang tải...</p>
            </div>
          </div>
        </section>
    );
  }

  if (error) {
    return (
        <section className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            </div>
          </div>
        </section>
    );
  }

  if (!profile) {
    return (
        <section className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-md">
              <div className="flex items-center space-x-3">
                <User className="w-6 h-6 text-gray-400" />
                <p className="text-gray-600 font-medium">Không có dữ liệu hồ sơ.</p>
              </div>
            </div>
          </div>
        </section>
    );
  }

  if (isEditing) {
    return (
        <section className="bg-white p-8 rounded-lg shadow">
          {/* Edit Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Edit3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Chỉnh sửa hồ sơ</h2>
                <p className="text-gray-600 text-sm">Cập nhật thông tin cá nhân của bạn</p>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {editError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-600 font-medium">{editError}</p>
                </div>
              </div>
          )}

          {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-green-600 font-medium">{success}</p>
                </div>
              </div>
          )}

          {/* Edit Form */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* UserName (Read-only) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Tên đăng nhập</span>
                  </div>
                </label>
                <input
                    type="text"
                    name="userName"
                    value={formData.userName || ""}
                    disabled // Không cho phép chỉnh sửa
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Password */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Mật khẩu (tùy chọn)</span>
                  </div>
                </label>
                <input
                    type="password"
                    name="password"
                    value={formData.password || ""}
                    onChange={handleEditChange}
                    placeholder="Để trống nếu không muốn thay đổi"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </div>
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Họ và tên</span>
                  </div>
                </label>
                <input
                    name="fullName"
                    value={formData.fullName || ""}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Degree */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4" />
                    <span>Bằng cấp</span>
                  </div>
                </label>
                <input
                    name="degree"
                    value={formData.degree || ""}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Hourly Rate */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Giá tư vấn/giờ</span>
                  </div>
                </label>
                <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate || ""}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Specialty */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4" />
                    <span>Chuyên môn</span>
                  </div>
                </label>
                <input
                    name="specialty"
                    value={formData.specialty || ""}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Kinh nghiệm</span>
                  </div>
                </label>
                <input
                    name="experience"
                    value={formData.experience || ""}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Certificate Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4" />
                    <span>Tên chứng chỉ</span>
                  </div>
                </label>
                <input
                    name="certificateName"
                    value={formData.certificateName || ""}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Date Acquired */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Ngày cấp chứng chỉ</span>
                  </div>
                </label>
                <input
                    type="date"
                    name="dateAcquired"
                    value={formData.dateAcquired ? formData.dateAcquired.split("T")[0] : ""}
                    onChange={handleDateChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Google Meet Link */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Link2 className="w-4 h-4" />
                    <span>Link Google Meet</span>
                  </div>
                </label>
                <input
                    name="googleMeetLink"
                    value={formData.googleMeetLink || ""}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                <X className="w-4 h-4" />
                <span>Hủy</span>
              </button>
              <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={editLoading}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                {editLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Đang cập nhật...</span>
                    </>
                ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Cập nhật</span>
                    </>
                )}
              </button>
            </div>
          </div>
        </section>
    );
  }

  return (
      <section className="bg-white p-8 rounded-lg shadow">
        {/* Success Message */}
        {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-green-600 font-medium">{success}</p>
              </div>
            </div>
        )}

        {/* Profile Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{profile.fullName}</h2>
              <p className="text-gray-600 text-lg">{profile.specialty}</p>
              <p className="text-gray-500 text-sm mt-1">{profile.email}</p>
            </div>
          </div>
          <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            <Edit3 className="w-4 h-4" />
            <span>Chỉnh sửa hồ sơ</span>
          </button>
        </div>

        {/* Profile Information - Vertical Layout */}
        <div className="max-w-2xl mx-auto space-y-4">
          {/* UserName */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Tên đăng nhập</h3>
                <p className="text-gray-800 font-medium text-lg">{profile.userName}</p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</h3>
                <p className="text-gray-800 font-medium text-lg">{profile.email}</p>
              </div>
            </div>
          </div>

          {/* Degree */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Bằng cấp</h3>
                <p className="text-gray-800 font-medium text-lg">{profile.degree}</p>
              </div>
            </div>
          </div>

          {/* Hourly Rate */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Giá tư vấn/giờ</h3>
                <p className="text-gray-800 font-medium text-lg">{profile.hourlyRate?.toLocaleString("vi-VN") || "0"} VND</p>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Kinh nghiệm</h3>
                <p className="text-gray-800 font-medium text-lg">{profile.experience}</p>
              </div>
            </div>
          </div>

          {/* Certificate */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Tên chứng chỉ</h3>
                <p className="text-gray-800 font-medium text-lg">{profile.certificateName || "Chưa có"}</p>
              </div>
            </div>
          </div>

          {/* Date Acquired */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-pink-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Ngày cấp chứng chỉ</h3>
                <p className="text-gray-800 font-medium text-lg">{profile.dateAcquired ? new Date(profile.dateAcquired).toLocaleDateString("vi-VN") : "Chưa có"}</p>
              </div>
            </div>
          </div>

          {/* Google Meet Link */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Link2 className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Link Google Meet</h3>
                <a
                    href={profile.googleMeetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-600 hover:text-cyan-800 font-medium text-lg hover:underline transition-colors duration-200 break-all"
                >
                  {profile.googleMeetLink || "Chưa có"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default ConsultantProfile;