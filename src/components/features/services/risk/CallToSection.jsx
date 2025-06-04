const CallToActionSection = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div className="bg-gradient-to-r from-red-600 via-red-700 to-orange-600 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Bắt đầu đánh giá rủi ro ngay hôm nay
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Đừng để rủi ro ma túy ảnh hưởng đến cuộc sống. Hãy đánh giá và phòng ngừa kịp thời
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-red-600 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
            Đăng ký ngay
          </button>
          <button className="border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-red-600 transition-all duration-300">
            Liên hệ tư vấn
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default CallToActionSection;
