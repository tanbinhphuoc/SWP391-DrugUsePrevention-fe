import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import HeroSection from './HeroSection';
import StatsSection from './StatsSection';
import AssessmentTypesSection from './AssessmentTypeSection';
import ProcessStepsSection from './ProcessStepSection';
import PackagesSection from './PackagesSection';
import FeaturesSection from './FeaturesSection';
import CTASection from './CallToSection';
import AnimatedBackground from './AnimatedBackground';
import GoHomeButton from './GoHomeButton';

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
      <AnimatedBackground />

      {/* Main Content */}
      <div className="relative z-10">
        <GoHomeButton onClick={handleGoHome} />

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
    </div>
  );
};

export default RiskAssessmentPage;