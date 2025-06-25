import React, { useState } from 'react';
import { ArrowLeft, Shield, Star, X, Check, Users, Heart, BookOpen, Clock, MapPin, Calendar } from 'lucide-react';

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