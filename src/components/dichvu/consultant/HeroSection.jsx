const HeroSection = () => (
  <section className="relative bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-20 px-4">
    <div className="absolute inset-0 bg-black opacity-10"></div>
    <div className="relative max-w-6xl mx-auto text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Tư Vấn Chuyên Nghiệp
      </h1>
      <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
        Nhận được sự hỗ trợ và hướng dẫn từ đội ngũ chuyên gia hàng đầu về phòng chống tệ nạn xã hội
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
          Đặt lịch tư vấn ngay
        </button>
        <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors">
          Tìm hiểu thêm
        </button>
      </div>
    </div>
  </section>
);

export default HeroSection;
