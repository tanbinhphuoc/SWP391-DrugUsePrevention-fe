import React from 'react';
import { Users, Heart, BookOpen } from 'lucide-react';

const WhyChooseUsSection = () => (
  <div className="text-center">
    <h2 className="text-3xl font-bold text-white mb-8">Tại sao chọn chúng tôi?</h2>
    <div className="grid md:grid-cols-3 gap-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <Users className="text-green-300 w-12 h-12 mx-auto mb-4" />
        <h3 className="text-white font-semibold text-lg mb-2">Đội ngũ chuyên gia</h3>
        <p className="text-white/70 text-sm">Các chuyên gia có nhiều năm kinh nghiệm trong lĩnh vực phòng chống ma túy</p>
      </div>
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <Heart className="text-red-300 w-12 h-12 mx-auto mb-4" />
        <h3 className="text-white font-semibold text-lg mb-2">Tư vấn tận tâm</h3>
        <p className="text-white/70 text-sm">Luôn lắng nghe và đồng hành cùng bạn trong hành trình phục hồi</p>
      </div>
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <BookOpen className="text-blue-300 w-12 h-12 mx-auto mb-4" />
        <h3 className="text-white font-semibold text-lg mb-2">Phương pháp khoa học</h3>
        <p className="text-white/70 text-sm">Áp dụng các phương pháp điều trị và tư vấn được chứng minh hiệu quả</p>
      </div>
    </div>
  </div>
);

export default WhyChooseUsSection;
