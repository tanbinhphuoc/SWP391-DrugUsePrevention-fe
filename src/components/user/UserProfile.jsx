// THAY ĐỔI: Thêm useState, toast, và API giả lập
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

// API giả lập để cập nhật hồ sơ
const updateProfile = async (data) => {
  return new Promise((resolve) => setTimeout(() => resolve(data), 1000));
};

const UserProfile = () => {
  // THAY ĐỔI: Thêm state cho form và chế độ chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "Nguyễn Văn C",
    email: "nguyenvanc@example.com",
    role: "Sinh viên",
  });

  // THAY ĐỔI: Hàm xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(form);
      toast.success("Cập nhật hồ sơ thành công!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">👤 Hồ sơ cá nhân</h2>
      {/* THAY ĐỔI: Hiển thị form khi chỉnh sửa, thông tin tĩnh khi không chỉnh sửa */}
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
            <label className="block">Đối tượng</label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
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
          {/* THAY ĐỔI: Button kích hoạt chế độ chỉnh sửa */}
          <button
            onClick={() => setIsEditing(true)}
            className="mt-2 text-blue-600 underline"
            aria-label="Cập nhật hồ sơ cá nhân"
          >
            Cập nhật thông tin
          </button>
        </>
      )}
      {/* THAY ĐỔI: Thêm ToastContainer để hiển thị thông báo */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserProfile;