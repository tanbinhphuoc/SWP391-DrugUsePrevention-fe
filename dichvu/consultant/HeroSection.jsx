// Hero Section Component
const HeroSection = () => {
  return (
    <div className="relative pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Tư vấn <span className="text-yellow-300">Chuyên nghiệp</span>
          <br />Hỗ trợ <span className="text-blue-200">Tận tâm</span>
        </h1>
        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
          Đội ngũ chuyên gia hàng đầu sẵn sàng hỗ trợ bạn với những giải pháp tư vấn 
          chất lượng cao và dịch vụ chăm sóc cá nhân hóa
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Đặt lịch ngay
          </button>
          <button className="bg-white/20 text-white border-2 border-white/30 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all duration-300 backdrop-blur-sm">
            Tìm hiểu thêm
          </button>
        </div>
      </div>
    </div>
  );
};


export default HeroSection;
