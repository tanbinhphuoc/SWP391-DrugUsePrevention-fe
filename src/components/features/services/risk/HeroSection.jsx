import { AlertTriangle } from 'lucide-react';

const HeroSection = () => (
  <div className="relative bg-gradient-to-r from-red-600 via-red-700 to-orange-600 text-white overflow-hidden">
    <div className="absolute inset-0 bg-black opacity-20"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">Đánh giá Rủi ro Chuyên nghiệp</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Đánh giá <span className="text-yellow-400">Rủi ro</span><br />
          Ma túy Chính xác
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
          Sử dụng công nghệ tiên tiến và phương pháp khoa học để đánh giá rủi ro ma túy một cách chính xác nhất
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
            Bắt đầu đánh giá
          </button>
          <button className="border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-red-600 transition-all duration-300">
            Tìm hiểu thêm
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default HeroSection;
