import React, { useState } from 'react';
import { ArrowLeft, Shield, Star, X, Check, Users, Heart, BookOpen, Clock, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { experts } from './data/experts';
import { services } from './data/services';

import AnimatedBackground from './AnimatedBackground';
import HeroSection from './HeroSection';
import ServicesSection from './ServicesSection';
import WhyChooseUsSection from './WhyChooseUsSection';
import BookingModal from './BookingModal';


// Main Component
const ConsultationPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleBookNow = () => {
    setShowBookingModal(true);
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateTotalPrice = () => {
    if (selectedExpert && selectedTimeSlots.length > 0) {
      return selectedTimeSlots.length * selectedExpert.hourlyRate;
    }
    return 0;
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const handleBookingComplete = () => {
    alert('🎉 Đặt lịch tư vấn thành công! Chuyên viên sẽ liên hệ xác nhận trong 30 phút.');
    setShowBookingModal(false);
    setCurrentStep(1);
    // Reset form
    setSelectedService(null);
    setSelectedExpert(null);
    setSelectedDate(null);
    setSelectedTimeSlots([]);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-600 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <div className="relative z-10 p-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Về trang chủ</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 pb-12">
        {/* Hero Section */}
        <HeroSection onBookNow={handleBookNow} />

        {/* Services Preview */}
        <ServicesSection services={services} />

        {/* Why Choose Us */}
        <WhyChooseUsSection />
      </div>

      {/* Expert Profiles */}
        <div className="max-w-6xl mx-auto mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Đội ngũ chuyên gia hàng đầu</h2>
            <p className="text-white/80 text-lg">Được đào tạo bài bản, kinh nghiệm thực tế phong phú</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.slice(0, 6).map((expert, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                    {expert.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{expert.name}</h3>
                    <p className="text-emerald-300 text-sm">{expert.title}</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm mb-4">{expert.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="text-white text-sm">{expert.rating}</span>
                  </div>
                  <span className="text-emerald-300 font-semibold">{formatPrice(expert.hourlyRate)}/h</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      {/* Success Stories */}
        <div className="max-w-6xl mx-auto mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Câu chuyện thành công</h2>
            <p className="text-white/80 text-lg">Những phản hồi tích cực từ khách hàng đã sử dụng dịch vụ</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Anh Minh",
                service: "Phòng chống Ma túy",
                story: "Sau 3 tháng tư vấn, tôi đã hoàn toàn cai được chất kích thích. Cuộc sống gia đình hạnh phúc trở lại.",
                rating: 5
              },
              {
                name: "Chị Lan",
                service: "Tư vấn Cai nghiện",
                story: "Đội ngũ chuyên gia rất tận tâm, phương pháp khoa học. Con trai tôi đã trở lại trường học bình thường.",
                rating: 5
              },
              {
                name: "Anh Tuấn",
                service: "Tư vấn Gia đình",
                story: "Vợ chồng tôi đã tìm lại được sự hiểu biết. Cảm ơn các chuyên gia đã cứu vãn hôn nhân của chúng tôi.",
                rating: 5
              },
              {
                name: "Chị Hương",
                service: "Tư vấn Giáo dục",
                story: "Con tôi từ nghiện game đã trở thành học sinh giỏi. Phương pháp giáo dục thật hiệu quả!",
                rating: 5
              },
              {
                name: "Anh Nam",
                service: "Phòng chống Ma túy",
                story: "Tôi đã thoát khỏi vòng xoáy tệ nạn xã hội. Giờ đây có công việc ổn định và gia đình hạnh phúc.",
                rating: 5
              },
              {
                name: "Chị Mai",
                service: "Tư vấn Gia đình",
                story: "Dịch vụ tư vấn trực tuyến rất tiện lợi. Tôi có thể nhận được sự hỗ trợ ngay tại nhà.",
                rating: 5
              }
            ].map((story, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={16} />
                  ))}
                </div>
                <p className="text-white/90 mb-4 italic">"{story.story}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{story.name}</p>
                    <p className="text-emerald-300 text-sm">{story.service}</p>
                  </div>
                  <Heart className="text-red-400" size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>

      {/* Statistics */}
        <div className="max-w-6xl mx-auto mt-20">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Thành tích đạt được</h2>
              <p className="text-white/80 text-lg">Những con số ấn tượng trong hành trình phục vụ cộng đồng</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "5,000+", label: "Khách hàng đã tư vấn", icon: Users },
                { number: "98%", label: "Tỷ lệ thành công", icon: Check },
                { number: "24/7", label: "Hỗ trợ liên tục", icon: Clock },
                { number: "50+", label: "Chuyên gia kinh nghiệm", icon: Star }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                    <stat.icon className="text-white" size={24} />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Câu hỏi thường gặp</h2>
            <p className="text-white/80 text-lg">Những thắc mắc phổ biến về dịch vụ tư vấn</p>
          </div>
          
          <div className="space-y-4">
            {[
              {
                question: "Dịch vụ tư vấn có hiệu quả không?",
                answer: "Với đội ngũ chuyên gia được đào tạo bài bản và phương pháp khoa học, tỷ lệ thành công của chúng tôi lên đến 98%. Mỗi trường hợp đều được tư vấn cá nhân hóa phù hợp."
              },
              {
                question: "Chi phí tư vấn như thế nào?",
                answer: "Chi phí dao động từ 80k-200k/giờ tùy theo chuyên gia và loại hình tư vấn. Chúng tôi cam kết minh bạch giá cả, không phát sinh chi phí ẩn."
              },
              {
                question: "Có tư vấn trực tuyến không?",
                answer: "Có, chúng tôi cung cấp dịch vụ tư vấn trực tuyến 24/7 qua video call, chat, hoặc điện thoại. Đặc biệt phù hợp cho những ai khó sắp xếp thời gian."
              },
              {
                question: "Thông tin cá nhân có được bảo mật?",
                answer: "Chúng tôi cam kết bảo mật tuyệt đối thông tin khách hàng. Mọi thông tin tư vấn đều được mã hóa và chỉ chuyên gia phụ trách mới có quyền truy cập."
              },
              {
                question: "Bao lâu thì thấy hiệu quả?",
                answer: "Tùy theo từng trường hợp, thông thường sau 2-4 buổi tư vấn đầu tiên, khách hàng đã thấy sự thay đổi tích cực. Quá trình hoàn toàn phục hồi thường mất 3-6 tháng."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-white font-semibold text-lg mb-3">{faq.question}</h3>
                <p className="text-white/80">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

      {/* Contact Section */}
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
            
            <div className="text-center">
              <button 
                onClick={handleBookNow}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Đặt lịch tư vấn ngay
              </button>
            </div>
          </div>
        </div>          

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          currentStep={currentStep}
          onClose={() => setShowBookingModal(false)}
          services={services}
          experts={experts}
          selectedService={selectedService}
          selectedExpert={selectedExpert}
          selectedDate={selectedDate}
          selectedTimeSlots={selectedTimeSlots}
          setSelectedService={setSelectedService}
          setSelectedExpert={setSelectedExpert}
          setSelectedDate={setSelectedDate}
          setSelectedTimeSlots={setSelectedTimeSlots}
          formData={formData}
          setFormData={setFormData}
          handleNextStep={handleNextStep}
          handlePrevStep={handlePrevStep}
          calculateTotalPrice={calculateTotalPrice}
          formatPrice={formatPrice}
          handleBookingComplete={handleBookingComplete}
        />
      )}
    </div>
  );
};

export default ConsultationPage;