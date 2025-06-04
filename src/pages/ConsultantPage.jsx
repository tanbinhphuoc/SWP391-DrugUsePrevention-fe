import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MessageCircle, Video, Calendar, Clock, Star, Phone, Mail, CheckCircle, ArrowRight, Users, Award, Heart } from 'lucide-react';
import HeroSection from '../components/features/services/consultant/HeroSection';
import ServicesSection from '../components/features/services/consultant/ServiceSection';
import ExpertsSection from '../components/features/services/consultant/ExpertSection';
import BookingFormSection from '../components/features/services/consultant/BookingFormSecttion';
import ContactInfoSection from '../components/features/services/consultant/ContactInfoSection';


const ConsultationPage = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  
  const consultationServices = [
    {
      id: 1,
      title: "Tư vấn cá nhân",
      description: "Hỗ trợ tư vấn riêng tư với chuyên gia y tế",
      icon: <MessageCircle className="w-8 h-8" />,
      price: "500,000 VNĐ",
      duration: "60 phút",
      features: ["Tư vấn riêng tư", "Kế hoạch cá nhân hóa", "Theo dõi tiến độ", "Hỗ trợ 24/7"]
    },
    {
      id: 2,
      title: "Tư vấn trực tuyến",
      description: "Gặp gỡ chuyên gia qua video call từ xa",
      icon: <Video className="w-8 h-8" />,
      price: "300,000 VNĐ",
      duration: "45 phút",
      features: ["Video call HD", "Ghi lại buổi tư vấn", "Tài liệu hỗ trợ", "Linh hoạt thời gian"]
    },
    {
      id: 3,
      title: "Tư vấn nhóm",
      description: "Tham gia nhóm tư vấn với những người có cùng quan tâm",
      icon: <Users className="w-8 h-8" />,
      price: "200,000 VNĐ",
      duration: "90 phút",
      features: ["Nhóm 6-8 người", "Chia sẻ kinh nghiệm", "Chi phí thấp", "Hỗ trợ lâu dài"]
    }
  ];

  const experts = [
    {
      name: "TS. Nguyễn Minh Anh",
      specialty: "Chuyên gia Phòng chống Ma túy",
      experience: "15 năm kinh nghiệm",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
      achievements: ["Bác sĩ của năm 2023", "500+ ca tư vấn thành công"]
    },
    {
      name: "ThS. Trần Hương Ly", 
      specialty: "Tâm lý học lâm sàng",
      experience: "12 năm kinh nghiệm",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1594824388863-c28f4da4e299?w=300&h=300&fit=crop&crop=face",
      achievements: ["Chứng chỉ quốc tế", "300+ ca tư vấn thành công"]
    },
    {
      name: "BS. Lê Văn Đức",
      specialty: "Y học cộng đồng",
      experience: "10 năm kinh nghiệm", 
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
      achievements: ["Giải thưởng xuất sắc", "250+ ca tư vấn thành công"]
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const navigate = useNavigate();
  
    const handleGoHome = () => {
      navigate('/')
    }

  const handleSubmit = () => {
    alert('Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ với bạn trong 24h.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <button
        onClick={handleGoHome}
        className="fixed top-6 left-6 z-50 bg-white text-blue-600 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:bg-blue-50 border border-blue-200"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-semibold">Về trang chủ</span>
      </button>

      {/* Hero Section */}
      <HeroSection />

      {/* Services Section */}
      <ServicesSection
        consultationServices={consultationServices}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
      />  

      {/* Experts Section */}
      <ExpertsSection experts={experts} />

      {/* Booking Form Section */}
      <BookingFormSection
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />

      {/* Contact Info Section */}
      <ContactInfoSection />
    </div>
  );
};

export default ConsultationPage;