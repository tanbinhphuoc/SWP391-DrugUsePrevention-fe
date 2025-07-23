import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Calendar, Clock, Shield, XCircle, CheckCircle } from "lucide-react";

const formatPrice = (price) => {
  return price?.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
};

const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const UserAppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token") || sessionStorage.getItem("tempToken");

  useEffect(() => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để xem lịch sử!");
      return;
    }

    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:7092/api/Appointments/GetAppointmentAboutMember", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          // Sort appointments by startDateTime in descending order (newest first)
          const sortedAppointments = [...data.data].sort((a, b) => new Date(b.startDateTime) - new Date(a.startDateTime));
          setAppointments(sortedAppointments);
        } else {
          toast.error("Không thể tải lịch sử cuộc hẹn!");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error.message);
        toast.error("Lỗi khi tải lịch sử cuộc hẹn!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  const handleCancelAppointment = async (appointmentId) => {
    const appointment = appointments.find((a) => a.appointmentID === appointmentId);
    if (!appointment) return;

    const now = new Date();
    const appointmentStart = new Date(appointment.startDateTime);
    const timeDiff = (appointmentStart - now) / (1000 * 60); // Difference in minutes

    if (appointment.price > 0) {
      toast.error("Chỉ có thể hủy các cuộc hẹn miễn phí!");
      return;
    }
    if (timeDiff <= 60) {
      toast.error("Chỉ có thể hủy cuộc hẹn trước 1 giờ!");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:7092/api/Appointments/${appointmentId}/CancelAppointment`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        setAppointments(appointments.filter((a) => a.appointmentID !== appointmentId));
        toast.success("Hủy cuộc hẹn thành công!");
      } else {
        toast.error(data.message || "Hủy cuộc hẹn thất bại!");
      }
    } catch (error) {
      console.error("Error canceling appointment:", error.message);
      toast.error("Lỗi khi hủy cuộc hẹn!");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600">
        <Shield className="w-16 h-16 mx-auto mb-4 text-emerald-500" />
        <p>Chưa có lịch sử cuộc hẹn nào.</p>
      </div>
    );
  }

  // Group appointments by date
  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const date = new Date(appointment.startDateTime).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(appointment);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Calendar className="w-6 h-6 mr-2 text-emerald-500" />
        Lịch sử cuộc hẹn
      </h2>
      <div className="space-y-6">
        {Object.entries(groupedAppointments).map(([date, appointments]) => (
          <div key={date} className="bg-white/70 backdrop-blur-sm rounded-xl shadow-md p-4 border border-emerald-200/50">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">{date}</h3>
            <div className="space-y-3">
              {appointments.map((appointment) => {
                const now = new Date();
                const appointmentStart = new Date(appointment.startDateTime);
                const isCancellable =
                  appointment.price === 0 &&
                  (appointmentStart - now) / (1000 * 60) > 60 &&
                  ["PENDING", "PENDING_PAYMENT"].includes(appointment.status);

                return (
                  <div
                    key={appointment.appointmentID}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-emerald-500" />
                        <div>
                          <p className="font-medium text-gray-800">
                            {appointment.consultantName} - {appointment.status === "CONFIRMED" ? "Đã xác nhận" : appointment.status === "CANCELED" ? "Đã hủy" : "Chờ thanh toán"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDateTime(appointment.startDateTime)} - {formatDateTime(appointment.endDateTime)}
                          </p>
                          <p className="text-sm text-gray-600">Ghi chú: {appointment.note || "Không có"}</p>
                          {appointment.price > 0 && (
                            <p className="text-sm text-emerald-600">Phí: {formatPrice(appointment.price)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    {isCancellable && (
                      <button
                        onClick={() => handleCancelAppointment(appointment.appointmentID)}
                        className="ml-4 px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        disabled={isLoading}
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                    {appointment.status === "CONFIRMED" && (
                      <div className="ml-4 text-green-500">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserAppointmentHistory;