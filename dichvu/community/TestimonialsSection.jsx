const TestimonialsSection = ({ testimonials }) => (
  <section className="py-16 px-4 bg-white">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Chia Sẻ Từ Cộng Đồng
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Lắng nghe cảm nhận từ những người đã tham gia chương trình
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="mb-4 text-sm text-gray-600 italic">
              "{t.feedback}"
            </div>
            <div className="flex items-center mt-6">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <div className="text-sm font-semibold text-gray-800">
                  {t.name}
                </div>
                <div className="text-xs text-gray-500">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
