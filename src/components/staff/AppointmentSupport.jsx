import { useState } from "react";
import { Search, Calendar, Clock, User, MapPin, Check, X, Phone, Mail } from "lucide-react";

const AppointmentSupport = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: "Nguyễn Văn A",
      patientEmail: "nguyenvana@example.com",
      patientPhone: "0901234567",
      expertName: "Dr. Trần B",
      expertId: 1,
      date: "2025-02-15",
      time: "09:00",
      type: "Tư vấn trực tiếp",
      status: "Chờ xác nhận",
      location: "Phòng 301, Tòa nhà A",
      notes: "Bệnh nhân cần tư vấn về vấn đề nghiện game",
      createdAt: "2025-02-10"
    },
    {
      id: 2,
      patientName: "Lê Thị C",
      patientEmail: "lethic@example.com",
      patientPhone: "0987654321",
      expertName: "Dr. Phạm D",
      expertId: 2,
      date: "2025-02-16",
      time: "14:30",
      type: "Tư vấn online",
      status: "Đã xác nhận",
      location: "Google Meet",
      notes: "Tư vấn cho phụ huynh về cách giáo dục con",
      createdAt: "2025-02-08"
    },
    {
      id: 3,
      patientName: "Trần Văn E",
      patientEmail: "tranvane@example.com",
      patientPhone: "0912345678",
      expertName: "Dr. Hoàng F",
      expertId: 3,
      date: "2025-02-17",
      time: "10:00",
      type: "Tư vấn trực tiếp",
      status: "Đã hủy",
      location: "Phòng 205, Tòa nhà B",
      notes: "Bệnh nhân hủy do bận việc đột xuất",
      createdAt: "2025-02-05"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.expertName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "" || appointment.status === filterStatus;
    const matchesType = filterType === "" || appointment.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleConfirm = (id) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: "Đã xác nhận" } : apt
    ));
  };

  const handleCancel = (id) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: "Đã hủy" } : apt
    ));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Hỗ trợ quản lý lịch hẹn</h2>
        <div className="text-sm text-gray-600">
          Hỗ trợ chuyên viên tư vấn quản lý lịch hẹn với bệnh nhân
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên bệnh nhân hoặc chuyên gia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tất cả hình thức</option>
          <option value="Tư vấn trực tiếp">Trực tiếp</option>
          <option value="Tư vấn online">Online</option>
        </select>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Chờ xác nhận">Chờ xác nhận</option>
          <option value="Đã xác nhận">Đã xác nhận</option>
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
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      appointment.status === "Chờ xác nhận"
                        ? "bg-yellow-100 text-yellow-800"
                        : appointment.status === "Đã xác nhận"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {appointment.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    appointment.type === "Tư vấn trực tiếp" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-purple-100 text-purple-800"
                  }`}>
                    {appointment.type}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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
                    <span className="text-sm">Thời gian: {appointment.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Địa điểm: {appointment.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{appointment.patientPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{appointment.patientEmail}</span>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Ghi chú:</span> {appointment.notes}
                    </p>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Đăng ký lúc: {appointment.createdAt}
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                {appointment.status === "Chờ xác nhận" && (
                  <>
                    <button 
                      onClick={() => handleConfirm(appointment.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                      title="Xác nhận lịch hẹn"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleCancel(appointment.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Hủy lịch hẹn"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{appointments.length}</div>
          <div className="text-sm text-gray-600">Tổng lịch hẹn</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">
            {appointments.filter(a => a.status === "Chờ xác nhận").length}
          </div>
          <div className="text-sm text-gray-600">Chờ xác nhận</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {appointments.filter(a => a.status === "Đã xác nhận").length}
          </div>
          <div className="text-sm text-gray-600">Đã xác nhận</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">
            {appointments.filter(a => a.status === "Đã hủy").length}
          </div>
          <div className="text-sm text-gray-600">Đã hủy</div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSupport;