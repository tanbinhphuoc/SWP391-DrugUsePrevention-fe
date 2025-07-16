// UserProfile.jsx (Updated with additional fields and direct dateOfBirth editing)
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    dateOfBirth: "",
    phone: "",
    address: "",
  });

  const calculateAge = (dobStr) => {
    if (!dobStr) return "";
    const dob = new Date(dobStr);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Lấy token động từ localStorage
        if (!token) {
          throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.');
        }
        const response = await fetch('http://localhost:7092/api/Users/GetProfileMember', {
          method: 'GET',
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();

        setForm({
          name: data.fullName,
          email: data.email,
          role: data.roleName,
          dateOfBirth: data.dateOfBirth.split('T')[0],
          phone: data.phone,
          address: data.address,
        });
      } catch (error) {
        toast.error(error.message || "Không thể tải hồ sơ người dùng!");
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Lấy token động từ localStorage
      if (!token) {
        throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.');
      }
      const updateData = {
        fullName: form.name,
        phone: form.phone,
        address: form.address,
        dateOfBirth: new Date(form.dateOfBirth).toISOString(),
        email: form.email
      };

      const updateResponse = await fetch('http://localhost:7092/api/Users/profile/UserUpdateProfile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await updateResponse.json();

      setForm({
        name: updatedProfile.fullName,
        email: updatedProfile.email,
        role: updatedProfile.roleName,
        dateOfBirth: updatedProfile.dateOfBirth.split('T')[0],
        phone: updatedProfile.phone,
        address: updatedProfile.address,
      });

      toast.success("Cập nhật hồ sơ thành công!");
      setIsEditing(false);
      // Save age to localStorage if needed
      localStorage.setItem("userAge", calculateAge(updatedProfile.dateOfBirth));
    } catch (error) {
      toast.error(error.message || "Cập nhật thất bại!");
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">👤 Hồ sơ cá nhân</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label className="block">Họ tên</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block">Số điện thoại</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block">Địa chỉ</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block">Ngày sinh</label>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Lưu
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Hủy
            </button>
          </div>
        </form>
      ) : (
        <>
          <p>Họ tên: {form.name}</p>
          <p>Email: {form.email}</p>
          <p>Đối tượng: {form.role}</p>
          <p>Số điện thoại: {form.phone}</p>
          <p>Địa chỉ: {form.address}</p>
          <p>Tuổi: {calculateAge(form.dateOfBirth)}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-2 text-blue-600 underline"
            aria-label="Cập nhật hồ sơ cá nhân"
          >
            Cập nhật thông tin
          </button>
        </>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserProfile;