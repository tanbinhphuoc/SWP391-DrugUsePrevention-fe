import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import HeroSection from './HeroSection';
import StatsSection from './StatsSection';
import AssessmentTypesSection from './AssessmentTypeSection';
import ProcessStepsSection from './ProcessStepSection';
import PackagesSection from './PackagesSection';
import FeaturesSection from './FeaturesSection';
import CTASection from './CallToSection';


const RiskAssessmentPage = () => {
  const [selectedPackage, setSelectedPackage] = useState('basic');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const handleSubmit = () => {
    alert('Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ với bạn trong 24h.');
  };

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-l from-orange-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-gradient-to-t from-red-500/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-gradient-to-bl from-orange-500/20 to-red-400/20 rounded-full blur-3xl animate-pulse delay-3000"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-1/3 left-1/2 w-32 h-32 border border-red-200/30 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-orange-200/30 rotate-12 animate-bounce" style={{animationDuration: '3s'}}></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-red-400/30 to-orange-400/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <button
          onClick={handleGoHome}
          className="fixed top-6 left-6 z-50 bg-white/80 backdrop-blur-md text-red-600 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:bg-red-50 border border-red-200/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-semibold">Về trang chủ</span>
        </button>

        {/* Hero Section */}
        <HeroSection />

        {/* Stats Section */}
        <StatsSection />

        {/* Assessment Types Section */}
        <AssessmentTypesSection />

        {/* Process Steps */}
        <ProcessStepsSection />

        {/* Pricing Packages */}
        <PackagesSection onSubmit={handleSubmit} />

        {/* Features Section */}
        <FeaturesSection />

        {/* CTA Section */}
        <CTASection onSubmit={handleSubmit} />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default RiskAssessmentPage;