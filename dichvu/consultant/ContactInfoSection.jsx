import { Phone, Mail, Heart } from 'lucide-react';

// Contact Info Section Component
const ContactInfoSection = () => {
  return (
    <div className="relative py-20 px-6">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Liên hệ với chúng tôi</h2>
          <p className="text-xl text-blue-100">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
            <Phone className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Điện thoại</h3>
            <p className="text-blue-100">+84 123 456 789</p>
            <p className="text-blue-100">+84 987 654 321</p>
          </div>
          
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
            <Mail className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Email</h3>
            <p className="text-blue-100">info@consultation.com</p>
            <p className="text-blue-100">support@consultation.com</p>
          </div>
          
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
            <Heart className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Hỗ trợ 24/7</h3>
            <p className="text-blue-100">Luôn sẵn sàng</p>
            <p className="text-blue-100">Chăm sóc tận tâm</p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ContactInfoSection;
