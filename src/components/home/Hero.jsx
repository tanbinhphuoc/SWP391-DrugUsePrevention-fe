import React from 'react';
import { Heart, Book, Calendar, FileCheck } from 'lucide-react';
import FeatureCard from './FeatureCard';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-b from-sky-500 to-sky-400 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
        {/* Left content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            <span className="text-white">Chung tay </span>
            <span className="text-emerald-400">vì </span>
            <span className="text-white">cộng </span>
            <span className="text-emerald-400">đồng</span>
          </h1>
          <p className="text-lg md:text-xl text-sky-50 mb-8 max-w-lg">
            Phần mềm hỗ trợ phòng chống ma túy trong cộng đồng thông qua giáo dục, đánh giá rủi ro và tư vấn chuyên nghiệp.
          </p>

          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-6">
            <button className="bg-white text-sky-700 font-semibold px-7 py-3 rounded-full hover:bg-emerald-500 hover:border-emerald-500  hover:text-white transition duration-300">
              Khám phá khóa học
            </button>
            <button className="border-2 border-white text-white font-semibold px-7 py-3 rounded-full hover:bg-emerald-500 hover:border-emerald-500 transition duration-300">
              Đánh giá rủi ro
            </button>
          </div>
        </div>

        {/* Right image */}
        <div className="md:w-1/2 rounded-xl overflow-hidden shadow-lg">
          <img
            src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Community volunteers working together"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Bottom features */}
      <div className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <FeatureCard 
          icon={<Book />} 
          title="Giáo dục" 
          description="Khóa học phù hợp lứa tuổi" 
        />
        <FeatureCard 
          icon={<FileCheck />} 
          title="Đánh giá" 
          description="Đánh giá rủi ro cá nhân hóa" 
        />
        <FeatureCard 
          icon={<Calendar />} 
          title="Tư vấn" 
          description="Hướng dẫn chuyên môn" 
        />
        <FeatureCard 
          icon={<Heart />} 
          title="Cộng đồng" 
          description="Mạng lưới hỗ trợ" 
        />
      </div>
    </div>
  );
};

export default Hero;