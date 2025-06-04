const CallToActionSection = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Sẵn sàng bắt đầu hành trình học tập?
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Đăng ký ngay hôm nay để nhận được giảm giá 30% cho khóa học đầu tiên
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-gray-900 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
            Đăng ký miễn phí
          </button>
          <button className="border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300">
            Tìm hiểu thêm
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default CallToActionSection;
