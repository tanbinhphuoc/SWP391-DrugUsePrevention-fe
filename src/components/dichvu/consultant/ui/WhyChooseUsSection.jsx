// components/consultation/WhyChooseUsSection.jsx
import React from 'react';
import { Shield, MessageCircle, Heart } from 'lucide-react';

const WhyChooseUsSection = () => (
  <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-12">
    <h2 className="text-2xl font-bold text-white text-center mb-8">Tại sao chọn chúng tôi?</h2>
    <div className="grid md:grid-cols-3 gap-6">
      <div className="text-center">
        <div className="bg-green-400/20 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Shield size={32} className="text-green-300" />
        </div>
        <h3 className="text-white font-semibold mb-2">Chuyên gia giàu kinh nghiệm</h3>
        <p className="text-white/70 text-sm">
          Đội ngũ chuyên gia có 10+ năm kinh nghiệm trong lĩnh vực phòng chống ma túy
        </p>
      </div>

      <div className="text-center">
        <div className="bg-blue-400/20 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <MessageCircle size={32} className="text-blue-300" />
        </div>
        <h3 className="text-white font-semibold mb-2">Tư vấn trực tuyến 24/7</h3>
        <p className="text-white/70 text-sm">
          Hỗ trợ tư vấn trực tuyến mọi lúc mọi nơi, bảo mật và an toàn
        </p>
      </div>

      <div className="text-center">
        <div className="bg-purple-400/20 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Heart size={32} className="text-purple-300" />
        </div>
        <h3 className="text-white font-semibold mb-2">Tận tình chu đáo</h3>
        <p className="text-white/70 text-sm">
          Lắng nghe, thấu hiểu và đồng hành cùng bạn trong hành trình vượt qua khó khăn
        </p>
      </div>
    </div>
  </div>
);

export default WhyChooseUsSection;
