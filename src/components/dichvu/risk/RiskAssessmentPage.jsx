import React, { useState } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  FileText,
  Users,
  Calendar,
  Clock,
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  Brain,
  Home,
  School,
  Building,
  ArrowRight,
  Download,
  Star,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../risk/HeroSection'
import StatsSection from '../risk/StatsSection'
import AssessmentTypesSection from '../risk/AssessmentTypeSection'
import ProcessStepsSection from '../risk/ProcessStepSection'
import PackagesSection from '../risk/PackagesSection'
import FeaturesSection from '../risk/FeaturesSection'
import CallToActionSection from '../risk/CallToSection'

const RiskAssessmentPage = () => {
  const [selectedPackage, setSelectedPackage] = useState('basic');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const handleSubmit = () => {
    alert('Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ với bạn trong 24h.');
  };

  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/')
  }

  const assessmentTypes = [
    {
      id: 'individual',
      title: 'Đánh giá Cá nhân',
      icon: Users,
      description: 'Đánh giá rủi ro cho từng cá nhân cụ thể',
      color: 'from-blue-500 to-blue-600',
      features: ['Khảo sát tâm lý', 'Phân tích hành vi', 'Báo cáo chi tiết', 'Tư vấn cá nhân hóa']
    },
    {
      id: 'family',
      title: 'Đánh giá Gia đình',
      icon: Home,
      description: 'Đánh giá môi trường và yếu tố nguy cơ trong gia đình',
      color: 'from-green-500 to-green-600',
      features: ['Môi trường gia đình', 'Quan hệ gia đình', 'Yếu tố bảo vệ', 'Kế hoạch phòng ngừa']
    },
    {
      id: 'community',
      title: 'Đánh giá Cộng đồng',
      icon: Building,
      description: 'Đánh giá rủi ro cho trường học, doanh nghiệp',
      color: 'from-purple-500 to-purple-600',
      features: ['Khảo sát môi trường', 'Phân tích dữ liệu', 'Báo cáo tổng hợp', 'Đề xuất giải pháp']
    }
  ];

  const packages = [
    {
      id: 'basic',
      name: 'Gói Cơ bản',
      price: '500.000',
      duration: '1-2 ngày',
      features: [
        'Khảo sát trực tuyến',
        'Báo cáo tự động',
        'Tư vấn qua email',
        'Hỗ trợ 8/5'
      ],
      popular: false
    },
    {
      id: 'standard',
      name: 'Gói Tiêu chuẩn',
      price: '1.200.000',
      duration: '3-5 ngày',
      features: [
        'Khảo sát chi tiết',
        'Phỏng vấn trực tiếp',
        'Báo cáo chuyên sâu',
        'Tư vấn 1-1',
        'Hỗ trợ 24/7'
      ],
      popular: true
    },
    {
      id: 'premium',
      name: 'Gói Cao cấp',
      price: '2.500.000',
      duration: '7-10 ngày',
      features: [
        'Đánh giá toàn diện',
        'Thử nghiệm tâm lý',
        'Báo cáo đa chiều',
        'Kế hoạch can thiệp',
        'Theo dõi dài hạn',
        'Hỗ trợ ưu tiên'
      ],
      popular: false
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Đăng ký & Tư vấn',
      description: 'Liên hệ với chuyên gia để được tư vấn phương pháp phù hợp'
    },
    {
      number: 2,
      title: 'Thu thập Thông tin',
      description: 'Thực hiện khảo sát và thu thập dữ liệu cần thiết'
    },
    {
      number: 3,
      title: 'Phân tích & Đánh giá',
      description: 'Chuyên gia phân tích dữ liệu và đưa ra đánh giá chính xác'
    },
    {
      number: 4,
      title: 'Báo cáo & Tư vấn',
      description: 'Nhận báo cáo chi tiết và kế hoạch phòng ngừa cụ thể'
    }
  ];

  const stats = [
    { icon: Shield, value: "5,000+", label: "Đánh giá hoàn thành", color: "text-blue-600" },
    { icon: Users, value: "98%", label: "Độ chính xác", color: "text-green-600" },
    { icon: Calendar, value: "24h", label: "Thời gian xử lý", color: "text-purple-600" },
    { icon: Star, value: "4.9/5", label: "Đánh giá khách hàng", color: "text-yellow-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <button
        onClick={handleGoHome}
        className="fixed top-6 left-6 z-50 bg-white text-blue-600 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:bg-blue-50 border border-blue-200"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-semibold">Về trang chủ</span>
      </button>

      {/* Hero Section */}
      <HeroSection />


      {/* Stats Section */}
      <StatsSection stats={stats} />

      {/* Assessment Types Section */}
     <AssessmentTypesSection assessmentTypes={assessmentTypes} />

      {/* Process Steps */}
      <ProcessStepsSection steps={steps} />

      {/* Pricing Packages */}
      <PackagesSection packages={packages} />

      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <CallToActionSection />
    </div>
  );
};

export default RiskAssessmentPage;