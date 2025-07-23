import { useState, useEffect } from "react";
import { Search, Calendar, Clock, User, MapPin } from "lucide-react";

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, successful: 0, failed: 0, canceled: 0 });

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Vui lòng đăng nhập để tiếp tục.");
        }

        const response = await fetch("http://localhost:7092/api/Admin/GetAllAppointments", {
          method: "GET",
          headers: {
            "Accept": "*/*",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Lấy danh sách lịch hẹn thất bại: ${errorText}`);
        }

        const data = await response.json();
        if (!data.success || !Array.isArray(data.data)) {
          throw new Error("Dữ liệu không hợp lệ.");
        }

        const mappedAppointments = data.data
            .map((apt) => {
              if (!apt.appointmentID || !apt.startDateTime || !apt.endDateTime) {
                console.warn("Dữ liệu thiếu cho appointment:", apt);
                return null;
              }
              return {
                id: apt.appointmentID,
                patientName: apt.userName || "Chưa có tên",
                expertName: apt.consultantName || "Chưa có chuyên gia",
                date: new Date(apt.startDateTime).toLocaleDateString("vi-VN"),
                timeRange: `${new Date(apt.startDateTime).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })} - ${new Date(apt.endDateTime).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`, // Hiển thị khoảng thời gian
                type: "Tư vấn online",
                status: mapStatus(apt.status, apt.paymentStatus),
                location: "Google Meet",
                rawStatus: apt.status,
                rawPaymentStatus: apt.paymentStatus,
                rawDateTime: new Date(apt.startDateTime), // Store raw date for sorting
              };
            })
            .filter((apt) => apt !== null)
            .sort((a, b) => b.rawDateTime - a.rawDateTime); // Sắp xếp theo thời gian giảm dần

        setAppointments(mappedAppointments);
        setFilteredAppointments(mappedAppointments);

        // Calculate statistics
        const total = mappedAppointments.length;
        const pending = mappedAppointments.filter((apt) => apt.status === "Chờ xác nhận").length;
        const successful = mappedAppointments.filter((apt) => apt.status === "Đã xác nhận").length;
        const failed = mappedAppointments.filter((apt) => apt.status === "Thất bại").length;
        const canceled = mappedAppointments.filter((apt) => apt.status === "Đã hủy").length;
        setStats({ total, pending, successful, failed, canceled });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const mapStatus = (status, paymentStatus) => {
    if (status === "CANCELED") return "Đã hủy";
    if (status === "PENDING_PAYMENT") {
      if (paymentStatus === "PENDING") return "Chờ xác nhận";
      if (paymentStatus === "SUCCESS") return "Đã xác nhận";
      if (paymentStatus === "FAILED") return "Thất bại";
    }
    return "Không xác định";
  };

  useEffect(() => {
    let filtered = appointments;

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
          (apt) =>
              apt.patientName.toLowerCase().includes(lowerSearch) ||
              apt.expertName.toLowerCase().includes(lowerSearch) ||
              apt.date.includes(lowerSearch) ||
              apt.timeRange.toLowerCase().includes(lowerSearch) // Cập nhật để tìm kiếm trong timeRange
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    // Sort appointments by date descending (newest first)
    filtered = filtered.sort((a, b) => b.rawDateTime - a.rawDateTime);

    setFilteredAppointments(filtered);
  }, [searchTerm, statusFilter, appointments]);

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>;
  }

  return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Quản lý lịch hẹn</h2>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold">Tổng lịch hẹn</h3>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold">Chờ xác nhận</h3>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold">Thành công</h3>
            <p className="text-2xl font-bold">{stats.successful}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold">Thất bại</h3>
            <p className="text-2xl font-bold">{stats.failed}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold">Đã hủy</h3>
            <p className="text-2xl font-bold">{stats.canceled}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                type="text"
                placeholder="Tìm kiếm lịch hẹn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Chờ xác nhận">Chờ xác nhận</option>
            <option value="Đã xác nhận">Đã xác nhận</option>
            <option value="Thất bại">Thất bại</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
              <div
                  key={appointment.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{appointment.patientName}</h3>
                      <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              appointment.status === "Chờ xác nhận"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : appointment.status === "Đã xác nhận"
                                      ? "bg-green-100 text-green-800"
                                      : appointment.status === "Thất bại"
                                          ? "bg-orange-100 text-orange-800"
                                          : "bg-red-100 text-red-800"
                          }`}
                      >
                    {appointment.status}
                  </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span className="text-sm">Chuyên gia: {appointment.expertName}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Ngày: {appointment.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Thời gian: {appointment.timeRange}</span> {/* Hiển thị khoảng thời gian */}
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">Địa điểm: {appointment.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};

export default AppointmentManagement;