// ConsultantProfile.jsx
import React, { useState, useEffect } from 'react';

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
        password: formData.password || null, // Password might be optional; set to null if empty
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
      fetchProfile(); // Refresh profile after update
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!profile) {
    return <div>Không có dữ liệu hồ sơ.</div>;
  }

  if (isEditing) {
    return (
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Chỉnh sửa hồ sơ</h2>
        {editError && <div className="text-red-600 mb-4">{editError}</div>}
        {success && <div className="text-green-600 mb-4">{success}</div>}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mật khẩu (tùy chọn)</label>
            <input
              type="password"
              name="password"
              value={formData.password || ''}
              onChange={handleEditChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleEditChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleEditChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bằng cấp</label>
            <input
              name="degree"
              value={formData.degree}
              onChange={handleEditChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Giá tư vấn/giờ</label>
            <input
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleEditChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Chuyên môn</label>
            <input
              name="specialty"
              value={formData.specialty}
              onChange={handleEditChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Kinh nghiệm</label>
            <input
              name="experience"
              value={formData.experience}
              onChange={handleEditChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên chứng chỉ</label>
            <input
              name="certificateName"
              value={formData.certificateName}
              onChange={handleEditChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày cấp chứng chỉ</label>
            <input
              type="date"
              name="dateAcquired"
              value={formData.dateAcquired ? formData.dateAcquired.split('T')[0] : ''}
              onChange={handleDateChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Link Google Meet</label>
            <input
              name="googleMeetLink"
              value={formData.googleMeetLink}
              onChange={handleEditChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={editLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {editLoading ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </section>
    );
  }

  const formattedDateAcquired = new Date(profile.dateAcquired).toLocaleDateString('vi-VN');

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Hồ sơ</h2>
      <div className="space-y-2">
        <p><strong>Tên:</strong> {profile.fullName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Chuyên môn:</strong> {profile.specialty}</p>
        <p><strong>Bằng cấp:</strong> {profile.degree}</p>
        <p><strong>Giá tư vấn/giờ:</strong> {profile.hourlyRate.toLocaleString('vi-VN')} VND</p>
        <p><strong>Tên chứng chỉ:</strong> {profile.certificateName}</p>
        <p><strong>Ngày cấp chứng chỉ:</strong> {formattedDateAcquired}</p>
        <p><strong>Kinh nghiệm:</strong> {profile.experience}</p>
        <p><strong>Link Google Meet:</strong> <a href={profile.googleMeetLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profile.googleMeetLink}</a></p>
      </div>
      <button 
        onClick={() => setIsEditing(true)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Chỉnh sửa hồ sơ
      </button>
    </section>
  );
};

export default ConsultantProfile;