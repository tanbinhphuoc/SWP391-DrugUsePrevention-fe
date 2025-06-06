import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Video, Calendar, Clock, Star, Phone, Mail, CheckCircle, ArrowRight, Users } from 'lucide-react';
import HeroSection from './HeroSection';
import ServicesSection from './ServiceSection';
import ExpertsSection from './ExpertSection';
import ContactInfoSection from './ContactInfoSection';
import BookingFormSection from './BookingFormSection';
import AnimatedBackground from './AnimatedBackground';
import GoHomeButton from './GoHomeButton';
import consultationServices  from './ConsultationServices';
import { experts } from './Experts';

const ConsultationPage = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleSubmit = () => {
    alert('Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ với bạn trong 24h.');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Go Home Button */}
        <GoHomeButton />

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
    </div>
  );
};

export default ConsultationPage;