import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

const UserAppointments = () => {
  // State quản lý ngày, giờ, và trạng thái đặt lịch
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [consultant, setConsultant] = useState("Nguyễn Văn A");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // THAY ĐỔI: Thêm state cho danh sách yêu thích
  const [favoriteConsultants, setFavoriteConsultants] = useState(["Nguyễn Văn A"]);

  // THAY ĐỔI: Danh sách tư vấn viên với thông tin chi tiết
  const consultants = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      specialty: "Tư vấn tâm lý học đường",
      avatar: "https://via.placeholder.com/50", // Thay bằng URL ảnh thật
    },
    {
      id: 2,
      name: "Trần Thị B",
      specialty: "Tư vấn kỹ năng sống",
      avatar: "https://via.placeholder.com/50",
    },
    {
      id: 3,
      name: "Lê Văn C",
      specialty: "Tư vấn phòng chống ma túy",
      avatar: "https://via.placeholder.com/50",
    },
  ];

  // THAY ĐỔI: Sắp xếp tư vấn viên, ưu tiên yêu thích
  const sortedConsultants = [
    ...consultants.filter((c) => favoriteConsultants.includes(c.name)),
    ...consultants.filter((c) => !favoriteConsultants.includes(c.name)),
  ];

  // Giờ khả dụng (8:00 - 17:00, mỗi slot 1 tiếng)
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  // Giả lập API lấy danh sách slot đã đặt
  useEffect(() => {
    const fetchBookedSlots = async () => {
      // Thay bằng API thực tế: fetch("/api/booked-slots?date=" + selectedDate)
      const mockData = [
        { date: "2025-06-10", time: "09:00", consultant: "Nguyễn Văn A" },
        { date: "2025-06-10", time: "14:00", consultant: "Trần Thị B" },
        { date: "2025-06-15", time: "10:00", consultant: "Lê Văn C" },
      ];
      setBookedSlots(mockData);
    };
    fetchBookedSlots();
  }, [selectedDate]);

  // Hàm kiểm tra slot đã đặt
  const isSlotBooked = (time) => {
    return bookedSlots.some(
      (slot) =>
        slot.date === selectedDate &&
        slot.time === time &&
        slot.consultant === consultant
    );
  };

  // THAY ĐỔI: Hàm toggle tư vấn viên yêu thích
  const toggleFavorite = (consultantName) => {
    if (favoriteConsultants.includes(consultantName)) {
      setFavoriteConsultants(favoriteConsultants.filter((c) => c !== consultantName));
      toast.info(`${consultantName} đã bị xóa khỏi danh sách yêu thích!`);
    } else {
      setFavoriteConsultants([...favoriteConsultants, consultantName]);
      toast.success(`${consultantName} đã được thêm vào danh sách yêu thích!`);
    }
  };

  // Hàm xử lý đặt lịch
  const handleBookAppointment = async () => {
    if (!selectedTime) {
      toast.error("Vui lòng chọn giờ hẹn!");
      return;
    }

    setIsLoading(true);
    try {
      // Giả lập API đặt lịch
      const response = await mockBookAppointment({
        date: selectedDate,
        time: selectedTime,
        consultant,
      });

      // Tạo URL thanh toán VNPay
      const paymentUrl = await createVNPayPayment({
        amount: 100000,
        orderId: response.orderId,
        date: selectedDate,
        time: selectedTime,
      });

      // Chuyển hướng đến VNPay
      window.location.href = paymentUrl;

      toast.success("Đặt lịch thành công, đang chuyển hướng đến thanh toán!");
    } catch (error) {
      toast.error("Đặt lịch thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  // Giả lập API đặt lịch
  const mockBookAppointment = async (data) => {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ orderId: "ORDER_" + Date.now() }), 1000)
    );
  };

  // Giả lập tạo URL thanh toán VNPay
  const createVNPayPayment = async ({ amount, orderId, date, time }) => {
    const mockUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?amount=${amount}&orderId=${orderId}&date=${date}&time=${time}`;
    return mockUrl;
  };

  // THAY ĐỔI: Lấy thông tin tư vấn viên đang chọn
  const selectedConsultant = consultants.find((c) => c.name === consultant);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">📅 Đặt lịch hẹn tư vấn</h2>

      {/* Chọn ngày và tư vấn viên */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Chọn ngày</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tư vấn viên</label>
          <select
            value={consultant}
            onChange={(e) => setConsultant(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {sortedConsultants.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} {favoriteConsultants.includes(c.name) ? "(Yêu thích)" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* THAY ĐỔI: Hiển thị thông tin tư vấn viên */}
      {selectedConsultant && (
        <div className="mb-4 p-4 bg-white rounded shadow-sm flex items-center gap-4">
          <img
            src={selectedConsultant.avatar}
            alt={selectedConsultant.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-semibold">{selectedConsultant.name}</p>
            <p className="text-sm text-gray-600">{selectedConsultant.specialty}</p>
          </div>
          <button
            onClick={() => toggleFavorite(selectedConsultant.name)}
            className={`ml-auto px-3 py-1 rounded text-sm ${
              favoriteConsultants.includes(selectedConsultant.name)
                ? "bg-red-500 text-white"
                : "bg-yellow-500 text-white"
            }`}
          >
            {favoriteConsultants.includes(selectedConsultant.name)
              ? "Bỏ yêu thích"
              : "Thêm yêu thích"}
          </button>
        </div>
      )}

      {/* Chọn giờ */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Chọn giờ hẹn</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => !isSlotBooked(time) && setSelectedTime(time)}
              disabled={isSlotBooked(time)}
              className={`p-2 rounded text-center ${
                isSlotBooked(time)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : selectedTime === time
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Thông tin hẹn và thanh toán */}
      {selectedTime && (
        <div className="p-4 bg-white rounded shadow-sm mb-4">
          <p>
            <strong>Lịch hẹn:</strong> {selectedDate} lúc {selectedTime}
          </p>
          <p>
            <strong>Tư vấn viên:</strong> {consultant}
          </p>
          <p>
            <strong>Phí:</strong> 100,000 VND
          </p>
          <button
            onClick={handleBookAppointment}
            disabled={isLoading}
            className={`mt-4 px-4 py-2 rounded text-white ${
              isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isLoading ? "Đang xử lý..." : "Thanh toán bằng VNPay"}
          </button>
        </div>
      )}

      {/* Toast thông báo */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserAppointments;
