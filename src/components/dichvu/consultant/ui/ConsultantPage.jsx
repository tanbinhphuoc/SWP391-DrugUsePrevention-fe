import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

import { services } from './data/service'; // Giả lập dữ liệu dịch vụ
import { experts } from './data/experts'; // Giả lập dữ liệu chuyên gia

import HeroSection from './HeroSection';
import ServicesSection from './ServiceSection';
import WhyChooseUsSection from './WhyChooseUsSection';
import BookingModal from './BookingModal';
import AnimatedBackground from './AnimatedBackground';

const ConsultationPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Giờ làm việc từ 7h sáng đến 7h tối
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 19; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const isTimeSlotAvailable = (date, time) => {
    const dateString = date.toISOString().split('T')[0];
    return !bookedSlots[dateString]?.includes(time);
  };

  const handleBookNow = () => {
    setShowBookingModal(true);
    setCurrentStep(1);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTimeSlotToggle = (time) => {
    setSelectedTimeSlots(prev => {
      if (prev.includes(time)) {
        return prev.filter(t => t !== time);
      } else {
        return [...prev, time].sort();
      }
    });
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
    return selectedTimeSlots.length * 100000;
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

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-600 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <div className="relative z-10 p-6">
        <button 
          onClick={() => window.history.back()}
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

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
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