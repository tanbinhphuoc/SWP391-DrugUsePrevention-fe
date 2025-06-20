import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
              🌟 Cộng đồng yêu thương
            </span>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Chương trình Cộng đồng
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Cùng nhau xây dựng một cộng đồng tốt đẹp hơn thông qua những hoạt động ý nghĩa, 
              mang lại giá trị tích cực cho xã hội và cuộc sống của mọi người.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center group">
              Tham gia ngay
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl font-semibold hover:bg-white transition-all duration-300 flex items-center group">
              <BookOpen className="w-5 h-5 mr-2" />
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </section>
  );
};

export default HeroSection;
