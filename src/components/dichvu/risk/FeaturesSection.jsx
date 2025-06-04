import { Brain, BarChart3, Shield, Users } from 'lucide-react';

const FeaturesSection = () => (
  <div className="bg-gradient-to-r from-red-50 to-orange-50 py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Tại sao chọn dịch vụ của chúng tôi?
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Chúng tôi sử dụng công nghệ và phương pháp tiên tiến nhất
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">AI & Machine Learning</h3>
          <p className="text-gray-600 text-sm">Sử dụng trí tuệ nhân tạo để phân tích chính xác</p>
        </div>

        <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Báo cáo Chi tiết</h3>
          <p className="text-gray-600 text-sm">Báo cáo đa chiều với biểu đồ trực quan</p>
        </div>

        <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Bảo mật Tuyệt đối</h3>
          <p className="text-gray-600 text-sm">Thông tin được bảo mật và mã hóa cao cấp</p>
        </div>

        <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Chuyên gia Giàu kinh nghiệm</h3>
          <p className="text-gray-600 text-sm">Đội ngũ chuyên gia có nhiều năm kinh nghiệm</p>
        </div>
      </div>
    </div>
  </div>
);

export default FeaturesSection;
