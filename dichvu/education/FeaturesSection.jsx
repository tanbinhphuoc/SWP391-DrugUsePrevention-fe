import { Brain, Shield, Heart } from 'lucide-react';

const FeaturesSection = () => (
  <div className="relative py-20 bg-white/10 backdrop-blur-sm">
    <div className="max-w-6xl mx-auto px-4 text-center text-white">
      <h2 className="text-4xl font-bold mb-12">Tại sao chọn chúng tôi?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-blue-300" />
          <h3 className="text-xl font-bold mb-2">An toàn & Tin cậy</h3>
          <p className="opacity-90">Nội dung được kiểm duyệt bởi chuyên gia</p>
        </div>
        <div className="text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 text-purple-300" />
          <h3 className="text-xl font-bold mb-2">Khoa học & Hiệu quả</h3>
          <p className="opacity-90">Phương pháp giảng dạy hiện đại</p>
        </div>
        <div className="text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-pink-300" />
          <h3 className="text-xl font-bold mb-2">Tận tâm & Hỗ trợ</h3>
          <p className="opacity-90">Đồng hành cùng học viên 24/7</p>
        </div>
      </div>
    </div>
  </div>
);

export default FeaturesSection;
