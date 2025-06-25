import React from 'react';
import { Shield } from 'lucide-react';

const HeroSection = ({ onBookNow }) => (
  <div className="text-center mb-12">
    <div className="flex justify-center mb-4">
      <div className="bg-white/20 backdrop-blur-lg rounded-full p-6">
        <Shield size={60} className="text-white" />
      </div>
    </div>
    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
      Tư vấn <span className="text-green-300">Phòng chống</span><br />
      Ngăn ngừa <span className="text-yellow-300">Ma túy</span>
    </h1>
    <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
      Đội ngũ chuyên gia giàu kinh nghiệm sẵn sàng tư vấn trực tuyến về phòng chống ma túy, cai nghiện và hỗ trợ gia đình
    </p>
    <div className="flex items-center justify-center space-x-6 mb-8 flex-wrap gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-white">80k - 200k đ</div>
        <div className="text-white/70 text-sm">/ 1 giờ tư vấn</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-white">7h - 19h</div>
        <div className="text-white/70 text-sm">Giờ làm việc</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-white">Online</div>
        <div className="text-white/70 text-sm">Tư vấn trực tuyến</div>
      </div>
    </div>
    <button
      onClick={onBookNow}
      className="bg-green-400 hover:bg-green-500 text-black font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
    >
      Đặt lịch tư vấn ngay
    </button>
  </div>
);

export default HeroSection;