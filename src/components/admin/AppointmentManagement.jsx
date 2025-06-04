import { useState } from "react";
import { Search, Calendar, Clock, User, MapPin, Check, X } from "lucide-react";

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: "Nguyễn Văn A",
      expertName: "Dr. Trần B",
      date: "2025-02-15",
      time: "09:00",
      type: "Tư vấn trực tiếp",
      status: "Chờ xác nhận",
      location: "Phòng 301, Tòa nhà A",
    },
    {
      id: 2,
      patientName: "Lê Thị C",
      expertName: "Dr. Phạm D",
      date: "2025-02-16",
      time: "14:30",
      type: "Tư vấn online",
      status: "Đã xác nhận",
      location: "Google Meet",
    },
    {
      id: 3,
      patientName: "Trần Văn E",
      expertName: "Dr. Hoàng F",
      date: "2025-02-17",
      time: "10:00",
      type: "Tư vấn trực tiếp",
      status: "Đã hủy",
      location: "Phòng 205, Tòa nhà B",
    },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý lịch hẹn</h2>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm lịch hẹn..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="">Tất cả hình thức</option>
          <option value="direct">Trực tiếp</option>
          <option value="online">Online</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.map((appointment) => (
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
                    <span className="text-sm">Thời gian: {appointment.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Địa điểm: {appointment.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                {appointment.status === "Chờ xác nhận" && (
                  <>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors">
                      <Check className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentManagement;