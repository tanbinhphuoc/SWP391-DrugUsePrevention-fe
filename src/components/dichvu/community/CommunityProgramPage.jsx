import React, { useState } from 'react';
import { Users, Calendar, MapPin, Clock, Heart, Target, Award, Handshake, BookOpen, Shield, ArrowRight, Star, CheckCircle, ArrowLeft } from 'lucide-react';
import {
  currentPrograms,
  upcomingPrograms,
  achievements,
  testimonials
} from '../community/CommunityProgram';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../community/HeroSection'
import StatisticsSection from '../community/StatisticsSection'
import ProgramTabsSection from '../community/ProgramTabsSection'
import TestimonialsSection from '../community/TestimonialsSection'
import CallToActionSection from '../community/CallToActionSection'
import GoHomeButton from './GoHomeButton';

const CommunityProgramsPage = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [activeTab, setActiveTab] = useState('current');

  const handleJoinProgram = (programId) => {
    alert('Đăng ký tham gia chương trình thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
  };

  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <GoHomeButton />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Statistics Section */}
      <StatisticsSection achievements={achievements} />

      {/* Programs Section */}
      <ProgramTabsSection
        currentPrograms={currentPrograms}
        upcomingPrograms={upcomingPrograms}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleJoinProgram={handleJoinProgram}
      />

      {/* Testimonials Section */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Call to Action Section */}
      <CallToActionSection />
    </div>
  );
};

export default CommunityProgramsPage;