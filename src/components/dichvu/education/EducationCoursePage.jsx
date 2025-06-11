import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Award, 
  PlayCircle, 
  CheckCircle, 
  Star,
  Calendar,
  User,
  ArrowRight,
  Download,
  Heart,
  Shield,
  Brain,
  ArrowLeft
} from 'lucide-react';

import HeaderSection from './HeaderSection';
import StatsSection from './StatsSection';
import FilterSection from './FilterSection';
import FeaturesSection from './FeaturesSection';
import CoursesGrid from './CoursesGrid';
import CallToActionSection from './CallToSection';
import AnimatedBackground from './AnimatedBackground';

import { courses, categories } from './CourseData';
import { stats } from './StatsData';

const EducationCoursesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const handleSubmit = () => {
    alert('Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ với bạn trong 24h.');
  };

  const handleGoHome = () => {
    window.location.href = '/'
  }

  const filteredCourses = selectedCategory === 'all'
    ? courses
    : courses.filter(course => course.category === selectedCategory);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Home Button - Fixed Position */}
      <button
        onClick={handleGoHome}
        className="fixed top-6 left-6 z-50 bg-white/90 backdrop-blur-sm text-blue-600 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:bg-white border border-white/20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-semibold">Về trang chủ</span>
      </button>
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <HeaderSection />

        {/* Stats Section */}
        <StatsSection stats={stats} />

        {/* Main Content Area */}
        <div className="relative bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Chọn khóa học phù hợp
              </h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Từ cơ bản đến nâng cao, chúng tôi có đầy đủ các khóa học cho mọi đối tượng
              </p>
            </div>

            <FilterSection 
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            {/* Courses Grid */}
            <CoursesGrid courses={filteredCourses} />
          </div>
        </div>

        {/* Features Section */}
        <FeaturesSection />
      
        {/* CTA Section */}
        <CallToActionSection />
      </div>
    </div>
  );
};

export default EducationCoursesPage;