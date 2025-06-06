import React from 'react';
import { Calendar, Download } from 'lucide-react';

const CTASection = ({ onSubmit }) => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-6">
            Sẵn sàng bắt đầu Đánh giá Rủi ro?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí và lập kế hoạch đánh giá phù hợp
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-white text-red-600 px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
              onClick={onSubmit}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Đặt lịch tư vấn miễn phí
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-red-600 transition-all duration-300 flex items-center justify-center">
              <Download className="w-5 h-5 mr-2" />
              Tải brochure
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
