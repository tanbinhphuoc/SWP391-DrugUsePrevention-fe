import React from 'react';
import { Phone, Mail } from 'lucide-react';

const CallToActionSection = () => {
  return (
    <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Hãy cùng chúng tôi tạo nên sự khác biệt!</h2>
              <p className="text-xl mb-8 opacity-90">
                Tham gia cộng đồng tình nguyện và góp phần xây dựng một xã hội tốt đẹp hơn
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group">
                  <Phone className="w-5 h-5 mr-2" />
                  Liên hệ ngay
                </button>
                <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center justify-center group">
                  <Mail className="w-5 h-5 mr-2" />
                  Đăng ký nhận tin
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default CallToActionSection;
