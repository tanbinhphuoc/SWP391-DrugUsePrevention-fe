import React from 'react';
import { ArrowLeft } from 'lucide-react';

const GoHomeButton = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <button
      onClick={handleGoHome}
      className="fixed top-6 left-6 z-50 bg-white/20 backdrop-blur-lg text-white px-6 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2 hover:bg-white/30 border border-white/30 group"
    >
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
      <span className="font-semibold">Về trang chủ</span>
    </button>
  );
};

export default GoHomeButton;
