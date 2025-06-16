const CallToActionSection = () => (
  <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white relative overflow-hidden">
    <div className="absolute inset-0 bg-black opacity-10" />
    <div className="relative z-10 max-w-6xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        Hãy cùng tạo ra sự khác biệt
      </h2>
      <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
        Tham gia ngay các chương trình cộng đồng để lan tỏa giá trị tích cực và giúp đỡ những người xung quanh bạn
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-white text-emerald-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
          Đăng ký tham gia
        </button>
        <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-emerald-600 transition-colors">
          Tìm hiểu thêm
        </button>
      </div>
    </div>
  </section>
);

export default CallToActionSection;
