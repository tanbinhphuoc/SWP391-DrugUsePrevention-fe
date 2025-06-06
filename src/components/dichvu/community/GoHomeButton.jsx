import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GoHomeButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      className="fixed top-6 left-6 z-50 bg-white text-blue-600 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:bg-blue-50 border border-blue-200"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="font-semibold">Về trang chủ</span>
    </button>
  );
};

export default GoHomeButton;
