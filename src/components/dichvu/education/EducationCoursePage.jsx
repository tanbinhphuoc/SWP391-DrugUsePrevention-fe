import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, Users, Star, CheckCircle, X } from 'lucide-react';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'4\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>
    </div>
  );
};

const BookingModal = ({ isOpen, onClose, course, onBookingConfirm }) => {
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const timeSlots = [
    '08:00 - 10:00',
    '10:00 - 12:00',
    '14:00 - 16:00',
    '16:00 - 18:00',
    '19:00 - 21:00'
  ];

  const availableDates = [
    '2025-06-20',
    '2025-06-21',
    '2025-06-22',
    '2025-06-27',
    '2025-06-28',
    '2025-06-29'
  ];

  const handleBooking = () => {
    if (!selectedSlot || !selectedDate || !studentInfo.name || !studentInfo.phone) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    onBookingConfirm({
      course,
      slot: selectedSlot,
      date: selectedDate,
      student: studentInfo
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Đặt lịch học - {course?.title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Course Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">{course?.icon}</span>
              </div>
              <div>
                <h4 className="font-semibold text-lg">{course?.title}</h4>
                <p className="text-gray-600">{course?.duration} • {course?.price}</p>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Chọn ngày học:</h4>
            <div className="grid grid-cols-3 gap-3">
              {availableDates.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedDate === date
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {new Date(date).toLocaleDateString('vi-VN', {
                    weekday: 'short',
                    day: '2-digit',
                    month: '2-digit'
                  })}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Selection */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Chọn giờ học:</h4>
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedSlot === slot
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Clock className="w-4 h-4 inline mr-2" />
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Student Information */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Thông tin học viên:</h4>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Họ và tên *"
                value={studentInfo.name}
                onChange={(e) => setStudentInfo({...studentInfo, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Số điện thoại *"
                value={studentInfo.phone}
                onChange={(e) => setStudentInfo({...studentInfo, phone: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={studentInfo.email}
                onChange={(e) => setStudentInfo({...studentInfo, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Booking Summary */}
          {selectedSlot && selectedDate && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h5 className="font-semibold text-blue-800 mb-2">Thông tin đặt lịch:</h5>
              <div className="text-sm text-blue-700 space-y-1">
                <p>📚 Khóa học: {course?.title}</p>
                <p>📅 Ngày: {new Date(selectedDate).toLocaleDateString('vi-VN')}</p>
                <p>⏰ Giờ: {selectedSlot}</p>
                <p>💰 Học phí: {course?.price}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleBooking}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Xác nhận đặt lịch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EducationCoursesPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [bookingModal, setBookingModal] = useState({
    isOpen: false,
    course: null
  });

  const courses = [
    {
      id: 1,
      title: "Khóa học Cơ bản",
      description: "Nền tảng kiến thức cơ bản, phù hợp cho người mới bắt đầu",
      duration: "8 tuần",
      price: "2.500.000 VNĐ",
      rating: 4.8,
      students: 1250,
      icon: "📚",
      features: [
        "Kiến thức nền tảng vững chắc",
        "Phương pháp học tập hiệu quả",
        "Hỗ trợ cá nhân từ giảng viên",
        "Tài liệu học tập đầy đủ"
      ],
      level: "Cơ bản",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "Khóa học Nâng cao",
      description: "Chuyên sâu và thực hành, dành cho người có kinh nghiệm",
      duration: "12 tuần",
      price: "4.500.000 VNĐ",
      rating: 4.9,
      students: 850,
      icon: "🚀",
      features: [
        "Kiến thức chuyên sâu và thực tiễn",
        "Dự án thực tế từ doanh nghiệp",
        "Mentor 1-1 hướng dẫn",
        "Chứng chỉ quốc tế"
      ],
      level: "Nâng cao",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const handleGoHome = () => {
    window.history.back();
  };

  const handleBookCourse = (course) => {
    setBookingModal({
      isOpen: true,
      course
    });
  };

  const handleBookingConfirm = (bookingData) => {
    alert(`Đặt lịch thành công!\n\nKhóa học: ${bookingData.course.title}\nNgày: ${new Date(bookingData.date).toLocaleDateString('vi-VN')}\nGiờ: ${bookingData.slot}\nHọc viên: ${bookingData.student.name}\n\nChúng tôi sẽ liên hệ xác nhận trong 24h!`);
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <div className="min-h-screen relative overflow-hidden">
        <AnimatedBackground />

        {/* Home Button */}
        <button
          onClick={handleGoHome}
          className="fixed top-6 left-6 z-40 bg-white/90 backdrop-blur-sm text-blue-600 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:bg-white border border-white/20 hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-semibold">Về trang chủ</span>
        </button>

        {/* Content */}
        <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Header Section */}
          <div className="pt-20 pb-16 text-center">
            <div className="max-w-4xl mx-auto px-6">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Khóa Học
                <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent"> Giáo Dục </span>
                Chất Lượng Cao
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Đặt lịch học dễ dàng như đặt vé xem phim - Chọn thời gian phù hợp với bạn!
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-white/70">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Đặt lịch linh hoạt</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>2000+ học viên</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>4.8/5 đánh giá</span>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Section */}
          <div className="py-16">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Chọn Khóa Học Phù Hợp</h2>
                <p className="text-xl text-white/70">Chỉ có 2 khóa học được thiết kế chuyên biệt cho từng trình độ</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {courses.map((course) => (
                  <div key={course.id} className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    
                    {/* Course Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${course.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                          {course.icon}
                        </div>
                        <div>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${
                            course.level === 'Cơ bản' 
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}>
                            {course.level}
                          </span>
                          <h3 className="text-2xl font-bold text-white">{course.title}</h3>
                        </div>
                      </div>
                    </div>

                    {/* Course Info */}
                    <p className="text-white/80 mb-6 leading-relaxed">{course.description}</p>

                    {/* Course Stats */}
                    <div className="flex items-center space-x-6 mb-6 text-white/70">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{course.students} học viên</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="text-white font-semibold mb-3">Điểm nổi bật:</h4>
                      <div className="space-y-2">
                        {course.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-3 text-white/80">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price and Book Button */}
                    <div className="flex items-center justify-between pt-6 border-t border-white/20">
                      <div>
                        <span className="text-2xl font-bold text-white">{course.price}</span>
                        <span className="text-white/60 text-sm block">Học phí toàn khóa</span>
                      </div>
                      <button
                        onClick={() => handleBookCourse(course)}
                        className={`px-6 py-3 bg-gradient-to-r ${course.color} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2`}
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Đặt lịch học</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="mt-12 text-center">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-4">🎯 Cam kết chất lượng</h3>
                  <div className="grid md:grid-cols-3 gap-6 text-white/80">
                    <div className="text-center">
                      <div className="text-3xl mb-2">📅</div>
                      <h4 className="font-semibold mb-1">Lịch học linh hoạt</h4>
                      <p className="text-sm">Chọn thời gian phù hợp với lịch trình của bạn</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl mb-2">👨‍🏫</div>
                      <h4 className="font-semibold mb-1">Giảng viên chuyên nghiệp</h4>
                      <p className="text-sm">Đội ngũ giảng viên giàu kinh nghiệm</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl mb-2">🏆</div>
                      <h4 className="font-semibold mb-1">Chứng chỉ uy tín</h4>
                      <p className="text-sm">Cấp chứng chỉ hoàn thành có giá trị</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModal.isOpen}
        onClose={() => setBookingModal({ isOpen: false, course: null })}
        course={bookingModal.course}
        onBookingConfirm={handleBookingConfirm}
      />
    </>
  );
};

export default EducationCoursesPage;