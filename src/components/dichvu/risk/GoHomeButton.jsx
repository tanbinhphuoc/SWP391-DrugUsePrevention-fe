import React from 'react';
import { ArrowLeft } from 'lucide-react';

const GoHomeButton = ({ onClick, color = 'text-red-600', bg = 'bg-white/80', border = 'border-red-200/50' }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed top-6 left-6 z-50 ${bg} backdrop-blur-md ${color} px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:bg-red-50 border ${border}`}
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="font-semibold">Về trang chủ</span>
    </button>
  );
};

export default GoHomeButton;
