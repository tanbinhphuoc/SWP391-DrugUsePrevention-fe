import { useState, useEffect } from "react";
import { Search, Edit2, Trash2, UserPlus, Calendar, Star, Clock, Award } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

const ConsultantManagement = () => {
  const [consultants, setConsultants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    email: "",
    fullName: "",
    degree: "",
    hourlyRate: "",
    specialty: "",
    experience: "",
    certificateName: "",
    dateAcquired: "",
    googleMeetLink: "",
  });
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem("token") || sessionStorage.getItem("tempToken");

  // Fetch consultants from API
  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const response = await fetch("http://localhost:7092/api/Appointments/GetAllConsultant", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          const processedConsultants = data.data.map((c) => ({
            id: c.consultantID,
            name: c.fullName,
            email: c.email,
            specialty: c.specialty || "N/A",
            degree: c.degree || "N/A",
            hourlyRate: c.hourlyRate || 0,
            certificateName: c.certificateName || "N/A",
            dateAcquired: c.dateAcquired ? new Date(c.dateAcquired).toISOString().split("T")[0] : null,
            experience: c.experience || "N/A",
            googleMeetLink: c.googleMeetLink || null,
            status: c.status || "Inactive",
            joinDate: "N/A",
            lastLogin: "N/A",
            totalSessions: 0,
            weeklyHours: 0,
            rating: 0,
            availability: [],
          }));
          setConsultants(processedConsultants);
        } else {
          toast.error("Không thể tải danh sách tư vấn viên.");
        }
      } catch (error) {
        console.error("Error fetching consultants:", error.message);
        toast.error("Lỗi tải danh sách tư vấn viên.");
      }
    };
    if (token) fetchConsultants();
    else toast.error("Vui lòng đăng nhập để truy cập!");
  }, [token]);

  const filteredConsultants = consultants.filter((consultant) => {
    const matchesSearch =
      consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = filterSpecialty === "" || consultant.specialty === filterSpecialty;
    const matchesStatus = filterStatus === "" || consultant.status === filterStatus;
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Vui lòng đăng nhập để thực hiện thao tác!");
      return;
    }

    try {
      const url =
        editId !== null
          ? `http://localhost:7092/api/Consultant/${editId}UpdateConsultant`
          : "http://localhost:7092/api/Consultant/createConsultant(Admin)";
      const body = {
        userName: formData.userName,
        password: formData.password || "default123",
        email: formData.email,
        fullName: formData.fullName,
        degree: formData.degree,
        hourlyRate: parseFloat(formData.hourlyRate) || 0,
        specialty: formData.specialty,
        experience: formData.experience,
        certificateName: formData.certificateName,
        dateAcquired: formData.dateAcquired ? `${formData.dateAcquired}T00:00:00Z` : null,
        googleMeetLink: formData.googleMeetLink || null,
      };

      console.log("Sending request to:", url, "with body:", body);

      const response = await fetch(url, {
        method: editId !== null ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || "Unknown error"}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.success || data.message === "Consultant updated successfully.") {
        if (editId) {
          const updatedConsultant = {
            id: editId,
            name: data.consultant.fullName || formData.fullName,
            email: data.consultant.email || formData.email,
            specialty: data.consultant.specialty || formData.specialty,
            degree: data.consultant.degree || formData.degree,
            hourlyRate: data.consultant.hourlyRate || parseFloat(formData.hourlyRate),
            certificateName: data.consultant.certificateName || formData.certificateName,
            dateAcquired: data.consultant.dateAcquired
              ? new Date(data.consultant.dateAcquired).toISOString().split("T")[0]
              : formData.dateAcquired,
            experience: data.consultant.experience || formData.experience,
            googleMeetLink: data.consultant.googleMeetLink || formData.googleMeetLink,
            status: data.consultant.status || "Active", // Fallback nếu không có status
          };
          setConsultants((prevConsultants) =>
            prevConsultants.map((c) => (c.id === editId ? updatedConsultant : c))
          );
          toast.success(data.message || "Cập nhật tư vấn viên thành công!");
        } else {
          const newConsultant = {
            id: data.data?.consultantID || Date.now(),
            name: body.fullName,
            email: body.email,
            specialty: body.specialty,
            degree: body.degree,
            hourlyRate: body.hourlyRate,
            certificateName: body.certificateName,
            dateAcquired: body.dateAcquired,
            experience: body.experience,
            googleMeetLink: body.googleMeetLink,
            status: "Active",
          };
          setConsultants((prevConsultants) => [...prevConsultants, newConsultant]);
          toast.success(data.message || "Thêm tư vấn viên thành công!");
        }
        setIsModalOpen(false);
        setFormData({
          userName: "",
          password: "",
          email: "",
          fullName: "",
          degree: "",
          hourlyRate: "",
          specialty: "",
          experience: "",
          certificateName: "",
          dateAcquired: "",
          googleMeetLink: "",
        });
        setEditId(null);
      } else {
        toast.error(data.message || "Thao tác thất bại!");
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(`Thao tác thất bại: ${error.message}`);
    }
  };

  const handleEdit = (consultant) => {
    setFormData({
      userName: consultant.email.split("@")[0],
      password: "",
      email: consultant.email,
      fullName: consultant.name,
      degree: consultant.degree,
      hourlyRate: consultant.hourlyRate,
      specialty: consultant.specialty,
      experience: consultant.experience,
      certificateName: consultant.certificateName,
      dateAcquired: consultant.dateAcquired ? new Date(consultant.dateAcquired).toISOString().split("T")[0] : "",
      googleMeetLink: consultant.googleMeetLink,
    });
    setEditId(consultant.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:7092/api/Consultant/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setConsultants(consultants.filter((c) => c.id !== id));
      toast.success("Xóa tư vấn viên thành công!");
    } catch (error) {
      console.error("Error deleting consultant:", error.message);
      toast.error("Xóa thất bại!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <UserPlus className="w-6 h-6" />
            <span>Quản lý Consultant</span>
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
          >
            <UserPlus className="w-5 h-5" />
            <span>Thêm Consultant mới</span>
          </button>
        </div>

        <div className="mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Active">Đang hoạt động</option>
            <option value="Inactive">Không hoạt động</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredConsultants.map((consultant) => (
            <div
              key={consultant.id} // Đảm bảo key duy nhất
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                    {consultant.name.split(" ").pop().charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{consultant.name}</h3>
                    <p className="text-sm text-gray-600">{consultant.specialty}</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700 ml-1">
                        {consultant.rating || "N/A"}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({consultant.totalSessions || 0} buổi)
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    consultant.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {consultant.status === "Active" ? "Hoạt động" : "Không hoạt động"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Award className="w-4 h-4 mr-1" />Kinh nghiệm
                  </div>
                  <p className="font-semibold text-gray-900">{consultant.experience}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Clock className="w-4 h-4 mr-1" />Lệ phí/giờ
                  </div>
                  <p className="font-semibold text-gray-900">{consultant.hourlyRate} VND</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Chứng chỉ:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {consultant.certificateName}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Calendar className="w-4 h-4 mr-1" />Ngày cấp chứng chỉ:
                </div>
                <p className="text-sm text-gray-800">
                  {consultant.dateAcquired || "N/A"}
                </p>
              </div>

              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Calendar className="w-4 h-4 mr-1" />Liên kết Google Meet:
                </div>
                <p className="text-sm text-gray-800 break-all">
                  {consultant.googleMeetLink || "N/A"}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Tham gia: {consultant.joinDate}</span>
                <span>Đăng nhập cuối: {consultant.lastLogin}</span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(consultant)}
                  className="flex-1 bg-purple-50 text-purple-600 py-2 px-3 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4 inline mr-1" />Chỉnh sửa
                </button>
                <button
                  onClick={() => handleDelete(consultant.id)}
                  className="bg-red-50 text-red-600 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
              <h3 className="text-lg font-semibold mb-4">
                {editId ? "Sửa tư vấn viên" : "Thêm tư vấn viên mới"}
              </h3>
              <form onSubmit={handleAddOrUpdate}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Bằng cấp</label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Lệ phí/giờ (VND)</label>
                  <input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Chuyên môn</label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Chọn chuyên môn</option>
                    <option value="Tâm lý học lâm sàng">Tâm lý học lâm sàng</option>
                    <option value="Tư vấn gia đình">Tư vấn gia đình</option>
                    <option value="Y học cộng đồng">Y học cộng đồng</option>
                    <option value="suport prevention">Hỗ trợ phòng ngừa</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Kinh nghiệm</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Chứng chỉ</label>
                  <input
                    type="text"
                    value={formData.certificateName}
                    onChange={(e) => setFormData({ ...formData, certificateName: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Ngày cấp chứng chỉ</label>
                  <input
                    type="date"
                    value={formData.dateAcquired}
                    onChange={(e) => setFormData({ ...formData, dateAcquired: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Liên kết Google Meet</label>
                  <input
                    type="text"
                    value={formData.googleMeetLink}
                    onChange={(e) => setFormData({ ...formData, googleMeetLink: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditId(null);
                      setFormData({
                        userName: "",
                        password: "",
                        email: "",
                        fullName: "",
                        degree: "",
                        hourlyRate: "",
                        specialty: "",
                        experience: "",
                        certificateName: "",
                        dateAcquired: "",
                        googleMeetLink: "",
                      });
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-2xl font-bold text-purple-600">{consultants.length}</div>
            <div className="text-sm text-gray-600">Tổng Consultant</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-2xl font-bold text-green-600">
              {consultants.filter((c) => c.status === "Active").length}
            </div>
            <div className="text-sm text-gray-600">Đang hoạt động</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-2xl font-bold text-blue-600">
              {consultants.reduce((sum, consultant) => sum + (consultant.totalSessions || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Tổng buổi tư vấn</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-2xl font-bold text-orange-600">
              {(consultants.reduce((sum, consultant) => sum + (consultant.rating || 0), 0) / consultants.length).toFixed(1) ||
                "N/A"}
            </div>
            <div className="text-sm text-gray-600">Đánh giá trung bình</div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default ConsultantManagement;