// ConsultantProfile.jsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Award, DollarSign, Calendar, Link2, Edit3, Save, X, Loader, CheckCircle, AlertCircle } from 'lucide-react';

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
      setFormData(data.data);
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
        password: formData.password || null,
        email: formData.email,
        fullName: formData.fullName,
        degree: formData.degree,
        hourlyRate: formData.hourlyRate,
        specialty: formData.specialty,
        experience: formData.experience,
        certificateName: formData.certificateName,
        dateAcquired: formData.dateAcquired,
        googleMeetLink: formData.googleMeetLink,
      };

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
      fetchProfile();
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
                value={formData.password || ''}
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
                value={formData.email}
                onChange={handleEditChange}
                required
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
                value={formData.fullName}
                onChange={handleEditChange}
                required
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
                value={formData.degree}
                onChange={handleEditChange}
                required
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
                value={formData.hourlyRate}
                onChange={handleEditChange}
                required
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
                value={formData.specialty}
                onChange={handleEditChange}
                required
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
                value={formData.experience}
                onChange={handleEditChange}
                required
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
                value={formData.certificateName}
                onChange={handleEditChange}
                required
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
                value={formData.dateAcquired ? formData.dateAcquired.split('T')[0] : ''}
                onChange={handleDateChange}
                required
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
                value={formData.googleMeetLink}
                onChange={handleEditChange}
                required
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

  const formattedDateAcquired = new Date(profile.dateAcquired).toLocaleDateString('vi-VN');

  return (
    <section className="bg-white p-8 rounded-lg shadow">
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

      {/* Profile Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide">Email</h3>
          </div>
          <p className="text-blue-900 font-medium text-lg">{profile.email}</p>
        </div>

        {/* Degree */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-purple-800 uppercase tracking-wide">Bằng cấp</h3>
          </div>
          <p className="text-purple-900 font-medium text-lg">{profile.degree}</p>
        </div>

        {/* Hourly Rate */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wide">Giá tư vấn/giờ</h3>
          </div>
          <p className="text-green-900 font-medium text-lg">{profile.hourlyRate.toLocaleString('vi-VN')} VND</p>
        </div>

        {/* Experience */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-orange-800 uppercase tracking-wide">Kinh nghiệm</h3>
          </div>
          <p className="text-orange-900 font-medium text-lg">{profile.experience}</p>
        </div>

        {/* Certificate */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl border border-indigo-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-indigo-800 uppercase tracking-wide">Tên chứng chỉ</h3>
          </div>
          <p className="text-indigo-900 font-medium text-lg">{profile.certificateName}</p>
        </div>

        {/* Date Acquired */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl border border-pink-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-pink-800 uppercase tracking-wide">Ngày cấp chứng chỉ</h3>
          </div>
          <p className="text-pink-900 font-medium text-lg">{formattedDateAcquired}</p>
        </div>
      </div>

      {/* Google Meet Link */}
      <div className="mt-6">
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-2xl border border-cyan-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-cyan-800 uppercase tracking-wide">Link Google Meet</h3>
          </div>
          <a 
            href={profile.googleMeetLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-cyan-700 hover:text-cyan-900 font-medium text-lg hover:underline transition-colors duration-200 break-all"
          >
            {profile.googleMeetLink}
          </a>
        </div>
      </div>
    </section>
  );
};

export default ConsultantProfile;