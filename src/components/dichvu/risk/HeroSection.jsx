import React from 'react';
import { Shield, Calendar, FileText } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center px-4 py-2 bg-red-100/80 backdrop-blur-sm rounded-full text-red-700 font-medium mb-6 border border-red-200/50">
          <Shield className="w-4 h-4 mr-2" />
          Đánh giá Rủi ro Chuyên nghiệp
        </div>
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-6">
          Dịch vụ Đánh giá Rủi ro
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          Chúng tôi cung cấp các giải pháp đánh giá rủi ro toàn diện, chính xác và khoa học 
          để bảo vệ cá nhân, gia đình và cộng đồng khỏi các nguy cơ tiềm ẩn.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
            <Calendar className="w-5 h-5 mr-2" />
            Đặt lịch tư vấn
          </button>
          <button className="bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-200/50 flex items-center justify-center">
            <FileText className="w-5 h-5 mr-2" />
            Tải brochure
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
