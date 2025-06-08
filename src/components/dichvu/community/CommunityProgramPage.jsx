import React, { useState } from 'react';
import { ArrowLeft, Phone, Mail, Globe } from 'lucide-react';

import HeroSection from './HeroSection';
import StatisticsSection from './StatsSection';
import ProgramsSection from './ProgramSection';
import TestimonialsSection from './TestimonialsSection';
import CallToActionSection from './CallToActionSection';
import AnimatedBackground from './AnimatedBackground';


import { achievements } from './data/achievement';
import { currentPrograms } from './data/currentProgram';
import { upcomingPrograms } from './data/upcomingProgram';
import { testimonials } from './data/testimonials';


const CommunityProgramsPage = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [activeTab, setActiveTab] = useState('current');

  const handleJoinProgram = (programId) => {
    alert('Đăng ký tham gia chương trình thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <AnimatedBackground />

      {/* Go Home Button */}
      <button
        onClick={handleGoHome}
        className="fixed top-6 left-6 z-50 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-blue-600 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center space-x-2"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold text-sm">Về trang chủ</span>
      </button>


      {/* Hero Section */}
      <HeroSection />

      {/* Statistics Section */}
      <StatisticsSection achievements={achievements} />

      {/* Programs Section */}
      <ProgramsSection 
        currentPrograms={currentPrograms} 
        upcomingPrograms={upcomingPrograms} 
        onJoin={(programId) => console.log("Joining", programId)} 
      />

      {/* Testimonials Section */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Call to Action Section */}
      <CallToActionSection />

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Cộng đồng Yêu thương</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Kết nối trái tim - Chia sẻ yêu thương - Xây dựng tương lai tốt đẹp
            </p>
          </div>
          <div className="flex justify-center space-x-6 mb-8">
            <div className="flex items-center text-gray-400">
              <Phone className="w-4 h-4 mr-2" />
              0123 456 789
            </div>
            <div className="flex items-center text-gray-400">
              <Mail className="w-4 h-4 mr-2" />
              info@community.vn
            </div>
            <div className="flex items-center text-gray-400">
              <Globe className="w-4 h-4 mr-2" />
              community.vn
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400">&copy; 2024 Cộng đồng Yêu thương. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CommunityProgramsPage;