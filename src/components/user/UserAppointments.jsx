import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

const UserAppointments = ({ appointmentId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [consultantId, setConsultantId] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [consultants, setConsultants] = useState([]);
  const [favoriteConsultants, setFavoriteConsultants] = useState([]);

  // Fetch consultants from API
  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const response = await fetch("http://localhost:7092/api/Appointments/GetAllConsultant", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token") || "no-token"}` },
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
  }, []);

  // Fetch booked slots
  useEffect(() => {
    if (consultantId) {
      const fetchBookedSlots = async () => {
        try {
          const response = await fetch(
            `http://localhost:7092/api/Appointments/${consultantId}/ConsultantSchedules?startDate=${selectedDate}&endDate=${selectedDate}`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token") || "no-token"}` },
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
  }, [selectedDate, consultantId]);

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
          Authorization: `Bearer ${localStorage.getItem("token") || "no-token"}`,
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

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">📅 Đặt lịch hẹn tư vấn</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Chọn ngày</label>
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
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tư vấn viên</label>
          <select
            value={consultantId || ""}
            onChange={(e) => setConsultantId(Number(e.target.value))}
            className="w-full p-2 border rounded"
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
        <div className="mb-4 p-4 bg-white rounded shadow-sm flex items-center gap-4">
          <img src="https://via.placeholder.com/50" alt={selectedConsultant.name} className="w-12 h-12 rounded-full" />
          <div>
            <p className="font-semibold">{selectedConsultant.name}</p>
            <p className="text-sm text-gray-600">{selectedConsultant.specialty}</p>
          </div>
          <button
            onClick={() => toggleFavorite(selectedConsultant.id)}
            className={`ml-auto px-3 py-1 rounded text-sm ${
              favoriteConsultants.includes(selectedConsultant.id) ? "bg-red-500 text-white" : "bg-yellow-500 text-white"
            }`}
          >
            {favoriteConsultants.includes(selectedConsultant.id) ? "Bỏ yêu thích" : "Thêm yêu thích"}
          </button>
        </div>
      )}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Chọn giờ hẹn</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
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
                className={`p-2 rounded text-center ${
                  !isAvailable || isPastTime
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : selectedTime === time
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>
      {selectedTime && (
        <div className="p-4 bg-white rounded shadow-sm mb-4">
          <p>
            <strong>Lịch hẹn:</strong> {selectedDate} lúc {selectedTime}
          </p>
          <p>
            <strong>Tư vấn viên:</strong> {selectedConsultant?.name}
          </p>
          <p>
            <strong>Chuyên môn:</strong> {selectedConsultant?.specialty}
          </p>
          <p>
            <strong>Phí:</strong> {selectedConsultant?.hourlyRate} VND
          </p>
          <button
            onClick={handleBookAppointment}
            disabled={isLoading}
            className={`mt-4 px-4 py-2 rounded text-white ${isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
          >
            {isLoading ? "Đang xử lý..." : "Thanh toán bằng VNPay"}
          </button>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserAppointments;