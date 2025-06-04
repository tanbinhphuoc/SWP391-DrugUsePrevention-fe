import { Phone, Mail, Heart } from 'lucide-react';

const ContactInfoSection = () => (
  <section className="py-16 px-4 bg-gray-800 text-white">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Liên Hệ Khẩn Cấp
        </h2>
        <p className="text-lg text-gray-300">
          Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-center">
        <div className="bg-gray-700 rounded-xl p-6">
          <Phone className="w-8 h-8 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Hotline</h3>
          <p className="text-blue-400 font-semibold">1900 1234</p>
          <p className="text-gray-300 text-sm">24/7 - Miễn phí</p>
        </div>

        <div className="bg-gray-700 rounded-xl p-6">
          <Mail className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Email</h3>
          <p className="text-emerald-400 font-semibold">support@preventionsupport.vn</p>
          <p className="text-gray-300 text-sm">Phản hồi trong 2h</p>
        </div>

        <div className="bg-gray-700 rounded-xl p-6">
          <Heart className="w-8 h-8 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Khẩn cấp</h3>
          <p className="text-red-400 font-semibold">113</p>
          <p className="text-gray-300 text-sm">Cứu hộ khẩn cấp</p>
        </div>
      </div>
    </div>
  </section>
);

export default ContactInfoSection;
