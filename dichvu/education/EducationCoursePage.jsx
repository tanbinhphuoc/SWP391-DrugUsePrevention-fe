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


const EducationCoursesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const handleSubmit = () => {
    alert('Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ với bạn trong 24h.');
  };

  const handleGoHome = () => {
    window.location.href = '/'
  }

  const courses = [
    {
      id: 1,
      title: "Hiểu biết về Ma túy và Tác hại",
      category: "basic",
      duration: "4 tuần",
      students: 1250,
      rating: 4.8,
      level: "Cơ bản",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      instructor: "TS. Nguyễn Văn A",
      price: "Miễn phí",
      description: "Khóa học cung cấp kiến thức cơ bản về các loại ma túy, tác hại và cách phòng tránh."
    },
    {
      id: 2,
      title: "Kỹ năng Từ chối Ma túy",
      category: "skills",
      duration: "3 tuần",
      students: 980,
      rating: 4.9,
      level: "Trung bình",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
      instructor: "ThS. Trần Thị B",
      price: "500.000 VNĐ",
      description: "Học cách nói không với ma túy một cách tự tin và hiệu quả trong các tình huống khác nhau."
    },
    {
      id: 3,
      title: "Tâm lý học Nghiện và Phục hồi",
      category: "advanced",
      duration: "6 tuần",
      students: 567,
      rating: 4.7,
      level: "Nâng cao",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      instructor: "PGS. Lê Văn C",
      price: "1.200.000 VNĐ",
      description: "Khóa học chuyên sâu về tâm lý nghiện và các phương pháp hỗ trợ phục hồi."
    },
    {
      id: 4,
      title: "Giáo dục Phòng chống cho Gia đình",
      category: "family",
      duration: "5 tuần",
      students: 2100,
      rating: 4.9,
      level: "Cơ bản",
      image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=250&fit=crop",
      instructor: "TS. Phạm Thị D",
      price: "Miễn phí",
      description: "Hướng dẫn cha mẹ cách giáo dục con em về tác hại của ma túy."
    }
  ];

  const categories = [
    { id: 'all', name: 'Tất cả', count: courses.length },
    { id: 'basic', name: 'Cơ bản', count: courses.filter(c => c.category === 'basic').length },
    { id: 'skills', name: 'Kỹ năng', count: courses.filter(c => c.category === 'skills').length },
    { id: 'advanced', name: 'Nâng cao', count: courses.filter(c => c.category === 'advanced').length },
    { id: 'family', name: 'Gia đình', count: courses.filter(c => c.category === 'family').length }
  ];

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const stats = [
    { icon: BookOpen, value: "50+", label: "Khóa học", color: "text-blue-300" },
    { icon: Users, value: "10,000+", label: "Học viên", color: "text-green-300" },
    { icon: Award, value: "98%", label: "Hài lòng", color: "text-purple-300" },
    { icon: Clock, value: "24/7", label: "Hỗ trợ", color: "text-orange-300" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div>
        
        {/* Animated shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {/* Large floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
          {/* Geometric patterns */}
          <div className="absolute top-20 right-20 w-32 h-32 border border-white/10 rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 border border-white/10 rotate-45 animate-spin-slow delay-1000"></div>
          
          {/* Floating particles */}
          <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-white/30 rounded-full animate-bounce delay-500"></div>
          <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-white/40 rounded-full animate-bounce delay-1500"></div>
          <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-white/20 rounded-full animate-bounce delay-2500"></div>
        </div>
        
        {/* Overlay gradients for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
      </div>

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

      {/* Custom Styles */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-delay {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 1s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
};

export default EducationCoursesPage;