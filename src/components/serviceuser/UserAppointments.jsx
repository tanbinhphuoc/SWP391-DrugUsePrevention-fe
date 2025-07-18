import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const UserAppointments = ({ appointmentId }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [consultantId, setConsultantId] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [consultants, setConsultants] = useState([]);
  const [favoriteConsultants, setFavoriteConsultants] = useState([]);

  const token = localStorage.getItem("token") || sessionStorage.getItem("tempToken");

  // Kiểm tra đăng nhập khi component mount
  useEffect(() => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để đặt lịch hẹn!");
      navigate("/login", { replace: true });
      return;
    }

    const fetchConsultants = async () => {
      try {
        const response = await fetch("http://localhost:7092/api/Appointments/GetAllConsultant", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const fetchedConsultants = data.data.map((c) => ({
          id: c.consultantID,
          name: c.fullName,
          specialty: c.specialty || "N/A",
          hourlyRate: c.hourlyRate || 0,
          googleMeetLink: c.googleMeetLink || null,
        }));
        setConsultants(fetchedConsultants);
        if (fetchedConsultants.length > 0) setConsultantId(fetchedConsultants[0].id);
      } catch (error) {
        console.error("Error fetching consultants:", error.message);
        toast.error("Không thể tải danh sách tư vấn viên.");
      }
    };
    fetchConsultants();
  }, [token, navigate]);

  // Fetch booked slots
  useEffect(() => {
    if (consultantId && token) {
      const fetchBookedSlots = async () => {
        try {
          const response = await fetch(
            `http://localhost:7092/api/Appointments/${consultantId}/ConsultantSchedules?startDate=${selectedDate}&endDate=${selectedDate}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setBookedSlots(
            data.data.map((slot) => ({
              date: slot.schedule.date.split("T")[0],
              time: slot.schedule.startTime.slice(0, 5),
              scheduleId: slot.schedule.scheduleID,
              isAvailable: slot.appointmentStatus === null && slot.paymentStatus === null,
              isPendingPayment: slot.paymentStatus === "PENDING",
              isBooked: slot.paymentStatus === "SUCCESS" || slot.appointmentStatus === "PENDING_PAYMENT",
            }))
          );
        } catch (error) {
          console.error("Error fetching booked slots:", error.message);
          setBookedSlots([]);
        }
      };
      fetchBookedSlots();
    }
  }, [selectedDate, consultantId, token]);

  const isSlotBooked = (time) => {
    return bookedSlots.some((slot) => slot.time === time && (slot.isBooked || slot.isPendingPayment));
  };

  const toggleFavorite = (consultantId) => {
    if (favoriteConsultants.includes(consultantId)) {
      setFavoriteConsultants(favoriteConsultants.filter((c) => c !== consultantId));
      toast.info(`${consultants.find((c) => c.id === consultantId)?.name} removed from favorites!`);
    } else {
      setFavoriteConsultants([...favoriteConsultants, consultantId]);
      toast.success(`${consultants.find((c) => c.id === consultantId)?.name} added to favorites!`);
    }
  };

  const handleBookAppointment = async () => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để đặt lịch!");
      navigate("/login", { replace: true });
      return;
    }
    if (!selectedTime) {
      toast.error("Vui lòng chọn giờ hẹn!");
      return;
    }
    setIsLoading(true);
    try {
      const startDateTime = new Date(`${selectedDate}T${selectedTime}`);
      const now = new Date();
      const isSameDay = selectedDate === now.toISOString().split("T")[0];
      if (isSameDay && startDateTime <= now) {
        toast.error("Không thể chọn giờ đã qua!");
        return;
      }

      const bookedSlot = bookedSlots.find((slot) => slot.time === selectedTime && slot.isAvailable);
      if (!bookedSlot) {
        toast.error("Lịch hẹn đã được đặt hoặc không hợp lệ!");
        return;
      }

      const bookDto = { consultantId, scheduleIds: [bookedSlot.scheduleId], note: "string" };

      const response = await fetch("http://localhost:7092/api/Appointments/BookAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookDto),
      });
      const data = await response.json();

      if (!response.ok || (data.success === false && !data.data?.paymentUrl)) {
        toast.error(data.message || "Đặt lịch thất bại!");
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (data.data?.paymentUrl) {
        window.location.href = data.data.paymentUrl; // Chuyển hướng tới VNPay
        return;
      }

      toast.success("Đặt lịch thành công!");
    } catch (error) {
      console.error("Error booking appointment:", error.message);
      toast.error("Đặt lịch thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedConsultant = consultants.find((c) => c.id === consultantId);

  const timeSlots = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

  const BackToHomeButton = () => (
    <button
      onClick={() => navigate("/")}
      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-lg hover:from-gray-700 hover:to-gray-900 transition-all duration-300 shadow-md hover:shadow-lg mb-6"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Quay lại trang chủ</span>
    </button>
  );

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-3xl mx-auto">
        <BackToHomeButton />
        <section className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <span role="img" aria-label="calendar">📅</span>
            <span>Đặt lịch hẹn tư vấn</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chọn ngày</label>
              <input
                type="date"
                value={selectedDate}
                min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0]}
                onChange={(e) => {
                  const value = e.target.value;
                  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
                  if (value < today) {
                    toast.error("Không thể chọn ngày trong quá khứ!");
                    return;
                  }
                  setSelectedDate(value);
                }}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tư vấn viên</label>
              <select
                value={consultantId || ""}
                onChange={(e) => setConsultantId(Number(e.target.value))}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                disabled={!consultants.length}
              >
                <option value="" disabled>
                  Chọn tư vấn viên
                </option>
                {consultants.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {favoriteConsultants.includes(c.id) ? "(Yêu thích)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {selectedConsultant && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm flex items-center gap-4 border border-gray-200">
              <img
                src="https://via.placeholder.com/50"
                alt={selectedConsultant.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{selectedConsultant.name}</p>
                <p className="text-sm text-gray-600">{selectedConsultant.specialty}</p>
              </div>
              <button
                onClick={() => toggleFavorite(selectedConsultant.id)}
                className={`px-3 py-1 rounded text-sm ${
                  favoriteConsultants.includes(selectedConsultant.id)
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                } transition-all duration-300`}
              >
                {favoriteConsultants.includes(selectedConsultant.id) ? "Bỏ yêu thích" : "Thêm yêu thích"}
              </button>
            </div>
          )}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Chọn giờ hẹn</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {timeSlots.map((time) => {
                const isToday = selectedDate === new Date().toLocaleDateString("en-CA");
                const [slotHour, slotMinute] = time.split(":").map(Number);
                const slotMinutes = slotHour * 60 + slotMinute;
                const now = new Date();
                const nowMinutes = now.getHours() * 60 + now.getMinutes();
                const isPastTime = isToday && slotMinutes <= nowMinutes;

                const slot = bookedSlots.find((s) => s.time === time);
                const isAvailable = slot && slot.isAvailable;

                return (
                  <button
                    key={time}
                    onClick={() => isAvailable && !isPastTime && setSelectedTime(time)}
                    disabled={!isAvailable || isPastTime}
                    className={`p-3 rounded-lg text-center font-medium ${
                      !isAvailable || isPastTime
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : selectedTime === time
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    } transition-all duration-300 shadow-sm`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
          {selectedTime && (
            <div className="p-5 bg-gray-50 rounded-lg shadow-md border border-gray-200">
              <p className="text-gray-800">
                <strong>Lịch hẹn:</strong> {selectedDate} lúc {selectedTime}
              </p>
              <p className="text-gray-800">
                <strong>Tư vấn viên:</strong> {selectedConsultant?.name}
              </p>
              <p className="text-gray-800">
                <strong>Chuyên môn:</strong> {selectedConsultant?.specialty}
              </p>
              <p className="text-gray-800">
                <strong>Phí:</strong> {selectedConsultant?.hourlyRate} VND
              </p>
              <button
                onClick={handleBookAppointment}
                disabled={isLoading}
                className={`mt-4 px-6 py-2 rounded-lg text-white ${
                  isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                } transition-all duration-300 shadow-md hover:shadow-lg`}
              >
                {isLoading ? "Đang xử lý..." : "Thanh toán bằng VNPay"}
              </button>
            </div>
          )}
        </section>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserAppointments;