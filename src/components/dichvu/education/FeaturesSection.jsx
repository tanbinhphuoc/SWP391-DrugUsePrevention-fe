import { Brain, Shield, Heart } from 'lucide-react';

const FeaturesSection = () => (
  <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Tại sao chọn khóa học của chúng tôi?
        </h2>
        <p className="text-xl opacity-90 max-w-3xl mx-auto">
          Chúng tôi cam kết mang đến chất lượng giáo dục tốt nhất
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-3xl hover:bg-white/20 transition-all duration-300">
          <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-4">Chuyên gia hàng đầu</h3>
          <p className="opacity-90">
            Được giảng dạy bởi các chuyên gia có nhiều năm kinh nghiệm trong lĩnh vực phòng chống ma túy
          </p>
        </div>

        <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-3xl hover:bg-white/20 transition-all duration-300">
          <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-4">Nội dung cập nhật</h3>
          <p className="opacity-90">
            Chương trình học được cập nhật liên tục theo xu hướng và nghiên cứu mới nhất
          </p>
        </div>

        <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-3xl hover:bg-white/20 transition-all duration-300">
          <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-4">Hỗ trợ tận tình</h3>
          <p className="opacity-90">
            Đội ngũ hỗ trợ 24/7 sẵn sàng giải đáp mọi thắc mắc và hỗ trợ học viên
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default FeaturesSection;
