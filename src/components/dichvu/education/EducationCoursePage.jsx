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
import { useNavigate } from 'react-router-dom';

import HeaderSection from '../education/HeaderSection'
import StatsSection from '../education/StatsSection'
import FilterSection from '../education/FilterSection'
import CoursesGrid from '../education/CoursesGrid'
import FeaturesSection from '../education/FeaturesSection'
import CallToActionSection from '../education/CallToSection'

const EducationCoursesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const handleSubmit = () => {
    alert('Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ với bạn trong 24h.');
  };

  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/')
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
    { icon: BookOpen, value: "50+", label: "Khóa học", color: "text-blue-600" },
    { icon: Users, value: "10,000+", label: "Học viên", color: "text-green-600" },
    { icon: Award, value: "98%", label: "Hài lòng", color: "text-purple-600" },
    { icon: Clock, value: "24/7", label: "Hỗ trợ", color: "text-orange-600" }
  ];

  

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Home Button - Fixed Position */}
      <button
        onClick={handleGoHome}
        className="fixed top-6 left-6 z-50 bg-white text-blue-600 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:bg-blue-50 border border-blue-200"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-semibold">Về trang chủ</span>
      </button>
      
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header Section */}
      <HeaderSection />

      {/* Stats Section */}
      <StatsSection stats={stats} />

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Chọn khóa học phù hợp
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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

      {/* Features Section */}
      <FeaturesSection />
    
      {/* CTA Section */}
      <CallToActionSection />
    </div>
    </div>
  );
};

export default EducationCoursesPage;