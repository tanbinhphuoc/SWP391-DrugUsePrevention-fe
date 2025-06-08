import React from 'react';
import { Brain, Shield, Zap, Award, Target, Heart } from 'lucide-react';

const features = [
  { icon: Brain, title: "AI-Powered Analysis", desc: "Sử dụng trí tuệ nhân tạo để phân tích chính xác" },
  { icon: Shield, title: "Bảo mật Tuyệt đối", desc: "Dữ liệu được mã hóa và bảo mật theo chuẩn quốc tế" },
  { icon: Zap, title: "Xử lý Nhanh chóng", desc: "Kết quả được trả về trong thời gian ngắn nhất" },
  { icon: Award, title: "Chuyên gia Hàng đầu", desc: "Đội ngũ chuyên gia giàu kinh nghiệm" },
  { icon: Target, title: "Độ chính xác Cao", desc: "Tỷ lệ chính xác lên đến 98%" },
  { icon: Heart, title: "Hỗ trợ 24/7", desc: "Luôn sẵn sàng hỗ trợ bạn mọi lúc" }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Tính năng Nổi bật</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Những tính năng giúp chúng tôi trở thành lựa chọn hàng đầu
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-100 to-orange-100 text-red-600 mb-4">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
