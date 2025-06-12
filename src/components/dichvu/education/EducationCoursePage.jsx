import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import AnimatedBackground from './AnimatedBackground';
import PageTransitionOverlay from './PageTransitionOverlay';
import HeaderSection from './HeaderSection';
import StatsSection from './StatsSection';
import CoursesSection from './CourseSection';
import FeaturesSection from './FeaturesSection';
import CTASection from './CallToSection';


const EducationCoursesPage = () => {
  const [pageTransition, setPageTransition] = useState({
    isTransitioning: false,
    direction: '',
    targetRoute: ''
  });

  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();

  const handlePageTransition = (targetRoute) => {
    setPageTransition({ isTransitioning: true, direction: 'out', targetRoute });

    setTimeout(() => {
      setPageTransition({ isTransitioning: true, direction: 'in', targetRoute });

      setTimeout(() => {
        setPageTransition({ isTransitioning: false, direction: '', targetRoute: '' });
        navigate(targetRoute); // ✅ Thay vì chỉ console.log
      }, 800);
    }, 800);
  };

  const handleGoHome = () => {
    handlePageTransition('/');
  };

  const handleSubmit = () => {
    alert('Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ với bạn trong 24h.');
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <div
        className={`min-h-screen relative overflow-hidden transition-all duration-800 ${
          pageTransition.isTransitioning && pageTransition.direction === 'out'
            ? 'scale-95 blur-sm'
            : 'scale-100 blur-0'
        }`}
      >
        <AnimatedBackground />

        {/* Home Button */}
        <button
          onClick={handleGoHome}
          disabled={pageTransition.isTransitioning}
          className={`fixed top-6 left-6 z-40 bg-white/90 backdrop-blur-sm text-blue-600 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:bg-white border border-white/20 ${
            pageTransition.isTransitioning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-semibold">Về trang chủ</span>
        </button>

        {/* Content */}
        <div
          className={`relative z-10 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <HeaderSection onNavigate={handlePageTransition} isTransitioning={pageTransition.isTransitioning} />
          <StatsSection />
          <CoursesSection onNavigate={handlePageTransition} isTransitioning={pageTransition.isTransitioning} />
          <FeaturesSection />
          <CTASection onSubmit={handleSubmit} />
        </div>
      </div>

      <PageTransitionOverlay pageTransition={pageTransition} />
    </>
  );
};

export default EducationCoursesPage;
