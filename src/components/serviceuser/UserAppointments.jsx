import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ArrowLeft, Shield, Users, Star, Clock, Check, Heart,
  BookOpen, Calendar, MapPin, CreditCard, FileText, XCircle, CheckCircle, X,
} from 'lucide-react';

const formatPrice = (price) => {
  return price?.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
};

const UserAppointments = ({ appointmentId }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Added for query parameter parsing
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [consultantId, setConsultantId] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [consultants, setConsultants] = useState([]);
  const [favoriteConsultants, setFavoriteConsultants] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const token = localStorage.getItem("token") || sessionStorage.getItem("tempToken");

  // VNPay response code mapping
  const vnPayErrorMessages = {
    "24": "Bạn đã hủy thanh toán lịch hẹn.",
    // Add more VNPay error codes here if available, e.g.:
    // "09": "Thẻ không hợp lệ.",
    // "07": "Giao dịch bị nghi ngờ gian lận.",
  };

  // Parse query parameters and show notifications
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    const code = params.get("code");

    if (status === "success") {
      toast.success("Thanh toán lịch hẹn thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
      // Refresh booked slots to reflect the new appointment
      if (consultantId && token) {
        fetchBookedSlots();
      }
    } else if (status === "error") {
      if (code === "24") {
        toast.warning(vnPayErrorMessages["24"], {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(`Thanh toán lịch hẹn thất bại! Mã lỗi: ${code || "Không xác định"}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }

    // Clear query parameters to prevent repeated toasts
    if (status) {
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, consultantId, token]);

  const toggleTimeSelection = (time) => {
    setSelectedTimes(prev => {
      if (prev.includes(time)) {
        return prev.filter(t => t !== time);
      } else {
        return [...prev, time].sort();
      }
    });
  };

  const getSortedConsultants = (consultantList) => {
    return [...consultantList].sort((a, b) => {
      const aIsFavorite = favoriteConsultants.includes(a.id);
      const bIsFavorite = favoriteConsultants.includes(b.id);
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      return a.name.localeCompare(b.name);
    });
  };

  const calculateTotalCost = () => {
    if (!selectedConsultant || selectedTimes.length === 0) return 0;
    return selectedConsultant.hourlyRate * selectedTimes.length;
  };

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
        bio: c.bio || "Chuyên gia tư vấn với nhiều năm kinh nghiệm",
        rating: c.rating || 4.5,
      }));
      setConsultants(fetchedConsultants);
      if (fetchedConsultants.length > 0 && !consultantId) {
        setConsultantId(fetchedConsultants[0].id);
      }
    } catch (error) {
      console.error("Error fetching consultants:", error.message);
      toast.error("Không thể tải danh sách tư vấn viên.");
    }
  };

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

  useEffect(() => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để đặt lịch hẹn!");
      navigate("/login", { replace: true });
      return;
    }
    fetchConsultants();
  }, [token, navigate]);

  useEffect(() => {
    if (consultantId && token) {
      fetchBookedSlots();
    }
  }, [selectedDate, consultantId, token]);

  const isSlotBooked = (time) => {
    return bookedSlots.some((slot) => slot.time === time && (slot.isBooked || slot.isPendingPayment));
  };

  const toggleFavorite = (consultantId) => {
    if (favoriteConsultants.includes(consultantId)) {
      setFavoriteConsultants(favoriteConsultants.filter((c) => c !== consultantId));
      toast.info(`${consultants.find((c) => c.id === consultantId)?.name} đã được xóa khỏi danh sách yêu thích!`);
    } else {
      setFavoriteConsultants([...favoriteConsultants, consultantId]);
      toast.success(`${consultants.find((c) => c.id === consultantId)?.name} đã được thêm vào danh sách yêu thích!`);
    }
  };

  const handleBookFreeAppointment = async () => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để đặt lịch!");
      navigate("/login", { replace: true });
      return;
    }
    if (selectedTimes.length === 0) {
      toast.error("Vui lòng chọn ít nhất một giờ hẹn!");
      return;
    }

    setIsLoading(true);
    try {
      const now = new Date();
      const isSameDay = selectedDate === now.toISOString().split("T")[0];

      for (const time of selectedTimes) {
        const startDateTime = new Date(`${selectedDate}T${time}`);
        if (isSameDay && startDateTime <= now) {
          toast.error(`Không thể chọn giờ ${time} đã qua!`);
          setIsLoading(false);
          return;
        }
      }

      const scheduleIds = [];
      for (const time of selectedTimes) {
        const bookedSlot = bookedSlots.find((slot) => slot.time === time && slot.isAvailable);
        if (!bookedSlot) {
          toast.error(`Lịch hẹn ${time} đã được đặt hoặc không hợp lệ!`);
          setIsLoading(false);
          return;
        }
        scheduleIds.push(bookedSlot.scheduleId);
      }

      const bookDto = { consultantId, scheduleIds, note: "string" };

      const response = await fetch("http://localhost:7092/api/Appointments/BookFreeAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookDto),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Đặt lịch miễn phí thất bại!");
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("Đặt lịch miễn phí thành công, đang chờ xác nhận!");
      setShowBookingForm(false);
      setSelectedTimes([]);
      fetchBookedSlots(); // Refresh booked slots
    } catch (error) {
      console.error("Error booking free appointment:", error.message);
      toast.error("Đặt lịch miễn phí thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookAppointmentMultiple = async () => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để đặt lịch!");
      navigate("/login", { replace: true });
      return;
    }
    if (selectedTimes.length === 0) {
      toast.error("Vui lòng chọn ít nhất một giờ hẹn!");
      return;
    }

    setIsLoading(true);
    try {
      const now = new Date();
      const isSameDay = selectedDate === now.toISOString().split("T")[0];

      for (const time of selectedTimes) {
        const startDateTime = new Date(`${selectedDate}T${time}`);
        if (isSameDay && startDateTime <= now) {
          toast.error(`Không thể chọn giờ ${time} đã qua!`);
          setIsLoading(false);
          return;
        }
      }

      const scheduleIds = [];
      for (const time of selectedTimes) {
        const bookedSlot = bookedSlots.find((slot) => slot.time === time && slot.isAvailable);
        if (!bookedSlot) {
          toast.error(`Lịch hẹn ${time} đã được đặt hoặc không hợp lệ!`);
          setIsLoading(false);
          return;
        }
        scheduleIds.push(bookedSlot.scheduleId);
      }

      const bookDto = { consultantId, scheduleIds, note: "string" };

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
        window.location.href = data.data.paymentUrl;
        return;
      }

      toast.success("Đặt lịch thành công!");
      fetchBookedSlots(); // Refresh booked slots
    } catch (error) {
      console.error("Error booking appointment:", error.message);
      toast.error("Đặt lịch thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  const services = [
    {
      id: 1,
      name: 'Tư vấn Phòng chống Ma túy',
      description: 'Tư vấn về tác hại của ma túy, cách phòng chống và nhận biết',
      icon: '🛡️',
      category: 'prevention'
    },
    {
      id: 2,
      name: 'Tư vấn Cai nghiện',
      description: 'Hỗ trợ cai nghiện ma túy, lập kế hoạch điều trị',
      icon: '💪',
      category: 'treatment'
    },
    {
      id: 3,
      name: 'Tư vấn Gia đình',
      description: 'Hỗ trợ gia đình có người thân nghiện ma túy',
      icon: '👨‍👩‍👧‍👦',
      category: 'family'
    },
    {
      id: 4,
      name: 'Tư vấn Giáo dục',
      description: 'Giáo dục về tác hại ma túy cho học sinh, sinh viên',
      icon: '📚',
      category: 'education'
    }
  ];

  const selectedConsultant = consultants.find((c) => c.id === consultantId);
  const isFreeConsultant = selectedConsultant?.hourlyRate === 0;

  const timeSlots = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

  const BookingModalEnhanced = () => {
    if (!showBookingForm) return null;

    const freeConsultants = consultants.filter((c) => c.hourlyRate === 0);
    const paidConsultants = consultants.filter((c) => c.hourlyRate > 0);
    const sortedFreeConsultants = getSortedConsultants(freeConsultants);
    const sortedPaidConsultants = getSortedConsultants(paidConsultants);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6 rounded-t-3xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3 text-white">
                <Calendar className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Đặt lịch tư vấn</h2>
              </div>
              <button
                onClick={() => setShowBookingForm(false)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <span>Chọn ngày tư vấn</span>
                </label>
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
                    setSelectedTimes([]);
                  }}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Users className="w-4 h-4 text-emerald-500" />
                  <span>Chọn tư vấn viên</span>
                </label>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Tư vấn viên miễn phí</label>
                    <select
                      value={consultantId && freeConsultants.some((c) => c.id === consultantId) ? consultantId : ""}
                      onChange={(e) => {
                        const newConsultantId = Number(e.target.value);
                        setConsultantId(newConsultantId);
                        setSelectedTimes([]);
                      }}
                      className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      disabled={!freeConsultants.length}
                    >
                      <option value="" disabled>
                        Chọn tư vấn viên miễn phí
                      </option>
                      {sortedFreeConsultants.map((c) => (
                        <option key={c.id} value={c.id}>
                          {favoriteConsultants.includes(c.id) ? "⭐ " : ""}{c.name} (Miễn phí)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Tư vấn viên có phí</label>
                    <select
                      value={consultantId && paidConsultants.some((c) => c.id === consultantId) ? consultantId : ""}
                      onChange={(e) => {
                        const newConsultantId = Number(e.target.value);
                        setConsultantId(newConsultantId);
                        setSelectedTimes([]);
                      }}
                      className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      disabled={!paidConsultants.length}
                    >
                      <option value="" disabled>
                        Chọn tư vấn viên có phí
                      </option>
                      {sortedPaidConsultants.map((c) => (
                        <option key={c.id} value={c.id}>
                          {favoriteConsultants.includes(c.id) ? "⭐ " : ""}{c.name} ({formatPrice(c.hourlyRate)}/h)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {selectedConsultant && (
              <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl shadow-lg border border-emerald-100">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    {favoriteConsultants.includes(selectedConsultant.id) && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-800">{selectedConsultant.name}</h3>
                    <p className="text-emerald-600 font-medium">{selectedConsultant.specialty}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedConsultant.bio}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(selectedConsultant.id)}
                    className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      favoriteConsultants.includes(selectedConsultant.id)
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl"
                        : "bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {favoriteConsultants.includes(selectedConsultant.id) ? "Bỏ yêu thích" : "Thêm yêu thích"}
                  </button>
                </div>
              </div>
            )}

            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-xl font-bold text-gray-800">Chọn giờ tư vấn</h3>
                </div>
                {selectedTimes.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-emerald-600">
                      Đã chọn {selectedTimes.length} khung giờ
                    </span>
                    <button
                      onClick={() => setSelectedTimes([])}
                      className="text-sm text-red-500 hover:text-red-700 underline"
                    >
                      Xóa tất cả
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {timeSlots.map((time) => {
                  const isToday = selectedDate === new Date().toLocaleDateString("en-CA");
                  const [slotHour, slotMinute] = time.split(":").map(Number);
                  const slotMinutes = slotHour * 60 + slotMinute;
                  const now = new Date();
                  const nowMinutes = now.getHours() * 60 + now.getMinutes();
                  const isPastTime = isToday && slotMinutes <= nowMinutes;

                  const slot = bookedSlots.find((s) => s.time === time);
                  const isAvailable = slot && slot.isAvailable;
                  const isSelected = selectedTimes.includes(time);

                  return (
                    <button
                      key={time}
                      onClick={() => isAvailable && !isPastTime && toggleTimeSelection(time)}
                      disabled={!isAvailable || isPastTime}
                      className={`relative p-4 rounded-2xl text-center font-semibold transition-all duration-300 transform hover:scale-105 ${
                        !isAvailable || isPastTime
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : isSelected
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg ring-2 ring-emerald-300"
                          : "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 hover:from-emerald-200 hover:to-teal-200 shadow-md hover:shadow-lg"
                      }`}
                    >
                      <span className="text-lg">{time}</span>
                      {!isAvailable || isPastTime ? (
                        <XCircle className="w-4 h-4 mx-auto mt-1 opacity-50" />
                      ) : isSelected ? (
                        <div className="flex items-center justify-center mt-1">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 mx-auto mt-1 border-2 border-emerald-500 rounded-full" />
                      )}
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {selectedTimes.indexOf(time) + 1}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedTimes.length > 0 && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <h4 className="font-semibold text-emerald-800 mb-2">Các khung giờ đã chọn:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTimes.map((time, index) => (
                      <span
                        key={time}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500 text-white text-sm font-medium"
                      >
                        {index + 1}. {time}
                        <button
                          onClick={() => toggleTimeSelection(time)}
                          className="ml-2 hover:bg-emerald-600 rounded-full p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selectedTimes.length > 0 && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-8 rounded-3xl shadow-lg border border-emerald-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Thông tin đặt lịch</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Ngày tư vấn</p>
                        <p className="text-lg font-bold text-gray-800">{selectedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Giờ tư vấn ({selectedTimes.length} khung giờ)</p>
                        <p className="text-lg font-bold text-gray-800">{selectedTimes.join(", ")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Tư vấn viên</p>
                        <p className="text-lg font-bold text-gray-800">{selectedConsultant?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Chuyên môn</p>
                        <p className="text-lg font-bold text-gray-800">{selectedConsultant?.specialty}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {!isFreeConsultant && (
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-emerald-200 mb-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-gray-600">
                        <span>Phí tư vấn mỗi khung giờ:</span>
                        <span className="font-semibold">{formatPrice(selectedConsultant?.hourlyRate)}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-600">
                        <span>Số khung giờ đã chọn:</span>
                        <span className="font-semibold">{selectedTimes.length}</span>
                      </div>
                      <hr className="border-emerald-200" />
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-700">Tổng chi phí:</span>
                        <span className="text-2xl font-bold text-emerald-600">{formatPrice(calculateTotalCost())}</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={isFreeConsultant ? handleBookFreeAppointment : handleBookAppointmentMultiple}
                  disabled={isLoading}
                  className={`w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang xử lý...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>
                        {isFreeConsultant
                          ? "Đặt lịch tư vấn miễn phí"
                          : `Thanh toán ${formatPrice(calculateTotalCost())} bằng VNPay`}
                      </span>
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-600 relative overflow-hidden">
      <ToastContainer />
      <button onClick={() => navigate('/')} className="fixed top-6 left-6 z-50 bg-white/20 text-white px-6 py-3 rounded-full shadow-xl hover:bg-white/30 border border-white/30 flex items-center space-x-2">
        <ArrowLeft className="w-5 h-5" />
        <span className="font-semibold">Về trang chủ</span>
      </button>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-pulse" />
        <div className="absolute top-40 -left-40 w-60 h-60 bg-white/5 rounded-full animate-bounce" />
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-white/10 rounded-full animate-ping" />
      </div>

      <div className="relative z-10 container mx-auto px-6 pb-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-lg rounded-full p-6">
              <Shield size={60} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tư vấn <span className="text-green-300">Phòng chống</span><br />
            Ngăn ngừa <span className="text-yellow-300">Ma túy</span>
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Đội ngũ chuyên gia giàu kinh nghiệm sẵn sàng tư vấn trực tuyến về phòng chống ma túy, cai nghiện và hỗ trợ gia đình
          </p>
          <div className="flex items-center justify-center space-x-6 mb-8 flex-wrap gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">Miễn phí</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">7h - 19h</div>
              <div className="text-white/70 text-sm">Giờ làm việc</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">Online</div>
              <div className="text-white/70 text-sm">Tư vấn trực tuyến</div>
            </div>
          </div>
          <button
            onClick={() => setShowBookingForm(!showBookingForm)}
            className="bg-green-400 hover:bg-green-500 text-black font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Đặt lịch tư vấn ngay
          </button>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Lĩnh vực tư vấn</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl mb-4 text-center">{service.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{service.name}</h3>
                <p className="text-white/70 text-sm mb-4">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Tại sao chọn chúng tôi?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <Users className="text-green-300 w-12 h-12 mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Đội ngũ chuyên gia</h3>
              <p className="text-white/70 text-sm">Các chuyên gia có nhiều năm kinh nghiệm trong lĩnh vực phòng chống ma túy</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <Heart className="text-red-300 w-12 h-12 mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Tư vấn tận tâm</h3>
              <p className="text-white/70 text-sm">Luôn lắng nghe và đồng hành cùng bạn trong hành trình phục hồi</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <BookOpen className="text-blue-300 w-12 h-12 mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Phương pháp khoa học</h3>
              <p className="text-white/70 text-sm">Áp dụng các phương pháp điều trị và tư vấn được chứng minh hiệu quả</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Đội ngũ chuyên gia hàng đầu</h2>
            <p className="text-white/80 text-lg">Được đào tạo bài bản, kinh nghiệm thực tế phong phú</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultants.map((expert) => (
              <div key={expert.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                    {expert.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{expert.name}</h3>
                    <p className="text-emerald-300 text-sm">{expert.specialty}</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm mb-4">{expert.bio}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="text-white text-sm">{expert.rating}</span>
                  </div>
                  <span className="text-emerald-300 font-semibold">
                    {expert.hourlyRate === 0 ? "Miễn phí" : formatPrice(expert.hourlyRate) + "/h"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-20">
          <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Liên hệ ngay hôm nay</h2>
              <p className="text-white/80 text-lg">Đừng để vấn đề kéo dài, hãy bắt đầu hành trình thay đổi tích cực</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <MapPin className="text-white" size={24} />
                </div>
                <h3 className="text-white font-semibold mb-2">Địa chỉ</h3>
                <p className="text-white/80">123 Nguyễn Văn Cừ, Q.1, TP.HCM</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <Clock className="text-white" size={24} />
                </div>
                <h3 className="text-white font-semibold mb-2">Giờ làm việc</h3>
                <p className="text-white/80">7h - 19h (Thứ 2 - Chủ nhật)</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center">
                  <Calendar className="text-white" size={24} />
                </div>
                <h3 className="text-white font-semibold mb-2">Đặt lịch</h3>
                <p className="text-white/80">Tư vấn trực tuyến 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModalEnhanced />
    </div>
  );
};

export default UserAppointments;