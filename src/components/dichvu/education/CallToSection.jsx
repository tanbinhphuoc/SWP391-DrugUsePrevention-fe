import React from 'react';

const CTASection = ({ handleSubmit }) => (
  <section className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-700">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
        Sẵn sàng bắt đầu hành trình học tập?
      </h2>
      <p className="text-xl text-white/90 mb-8">
        Đăng ký ngay để nhận tư vấn miễn phí và ưu đãi đặc biệt
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
        <input
          type="email"
          placeholder="Nhập email của bạn"
          className="flex-1 px-6 py-4 rounded-full border-0 focus:ring-4 focus:ring-white/30 focus:outline-none"
        />
        <button
          onClick={handleSubmit}
          className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors duration-300 whitespace-nowrap"
        >
          Đăng ký ngay
        </button>
      </div>
    </div>
  </section>
);

export default CTASection;
