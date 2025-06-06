const HeroSection = () => (
  <section className="relative bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-20 px-4">
    <div className="absolute inset-0 bg-black opacity-10"></div>
    <div className="relative max-w-6xl mx-auto text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Chương Trình Cộng Đồng
      </h1>
      <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
        Cùng nhau xây dựng một cộng đồng khỏe mạnh, an toàn và tích cực
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-white text-emerald-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
          Tham gia ngay
        </button>
        <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-emerald-600 transition-colors">
          Trở thành tình nguyện viên
        </button>
      </div>
    </div>
  </section>
);

export default HeroSection;
