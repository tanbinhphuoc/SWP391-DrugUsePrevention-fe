import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div 
      ref={sectionRef}
      id="contact" 
      className="py-20 relative overflow-hidden min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)'
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-pink-300/20 rounded-lg rotate-45 animate-bounce"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 bg-teal-300/20 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 right-10 w-24 h-24 bg-cyan-300/15 rounded-full animate-pulse"></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-orange-500/30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-teal-400/30 to-cyan-500/30 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2 animate-bounce"></div>
        
        {/* Moving particles */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section with Animation */}
        <div className="text-center mb-16">
          <div 
            className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-full mb-6 shadow-lg border border-white/20 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <Mail className="w-10 h-10 text-white" />
          </div>
          
          <h2 
            className={`text-4xl md:text-6xl font-bold text-white mb-6 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Liên Hệ Với Chúng Tôi
          </h2>
          
          <div 
            className={`w-32 h-1 bg-gradient-to-r from-white to-blue-200 mx-auto mb-8 rounded-full transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}
          ></div>
          
          <p 
            className={`max-w-3xl mx-auto text-xl text-white/90 leading-relaxed transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
          >
            Bạn có câu hỏi hoặc cần hỗ trợ? Đội ngũ của chúng tôi luôn sẵn sàng giúp đỡ bạn.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div 
            className={`lg:col-span-2 transition-all duration-1000 delay-800 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20 hover:shadow-3xl transition-all duration-500 hover:bg-white/15">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm border border-white/20">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Gửi Tin Nhắn</h3>
              </div>

              {formSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-emerald-400 mb-2">Cảm ơn bạn!</h4>
                  <p className="text-white/80">Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                      <label htmlFor="name" className="block text-sm font-semibold text-white/90 mb-2">
                        Họ và Tên *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-white/20 rounded-xl focus:ring-4 focus:ring-white/20 focus:border-white/40 transition-all duration-300 bg-white/10 backdrop-blur-sm hover:bg-white/15 text-white placeholder-white/60"
                        placeholder="Nhập họ và tên của bạn"
                      />
                    </div>
                    <div className="group">
                      <label htmlFor="email" className="block text-sm font-semibold text-white/90 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-white/20 rounded-xl focus:ring-4 focus:ring-white/20 focus:border-white/40 transition-all duration-300 bg-white/10 backdrop-blur-sm hover:bg-white/15 text-white placeholder-white/60"
                        placeholder="Nhập địa chỉ email"
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label htmlFor="subject" className="block text-sm font-semibold text-white/90 mb-2">
                      Chủ đề
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-white/20 rounded-xl focus:ring-4 focus:ring-white/20 focus:border-white/40 transition-all duration-300 bg-white/10 backdrop-blur-sm hover:bg-white/15 text-white placeholder-white/60"
                      placeholder="Nhập chủ đề"
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="message" className="block text-sm font-semibold text-white/90 mb-2">
                      Tin nhắn *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-white/20 rounded-xl focus:ring-4 focus:ring-white/20 focus:border-white/40 transition-all duration-300 bg-white/10 backdrop-blur-sm hover:bg-white/15 resize-none text-white placeholder-white/60"
                      placeholder="Chúng tôi có thể giúp gì cho bạn?"
                    ></textarea>
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white py-4 px-6 rounded-xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center group backdrop-blur-sm border border-white/20"
                  >
                    <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Gửi Tin Nhắn
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div 
            className={`space-y-6 transition-all duration-1000 delay-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            {/* Contact Details */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-white/20 hover:shadow-3xl transition-all duration-500 hover:bg-white/15">
              <h3 className="text-xl font-bold mb-6 text-white">Thông Tin Liên Hệ</h3>
              <div className="space-y-4">
                <div className="flex items-start group hover:bg-white/10 p-3 rounded-xl transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400/50 to-blue-500/50 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 border border-white/20">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-white">
                    <p className="font-semibold text-sm text-white/70 uppercase tracking-wide">Điện thoại</p>
                    <p className="font-medium text-lg">(123) 456-7890</p>
                  </div>
                </div>
                <div className="flex items-start group hover:bg-white/10 p-3 rounded-xl transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400/50 to-emerald-500/50 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 border border-white/20">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-white">
                    <p className="font-semibold text-sm text-white/70 uppercase tracking-wide">Email</p>
                    <p className="font-medium text-lg">info@preventionsupport.org</p>
                  </div>
                </div>
                <div className="flex items-start group hover:bg-white/10 p-3 rounded-xl transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400/50 to-purple-500/50 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 border border-white/20">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-white">
                    <p className="font-semibold text-sm text-white/70 uppercase tracking-wide">Địa chỉ</p>
                    <p className="font-medium">123 Prevention Street</p>
                    <p className="text-white/80">City, State 12345</p>
                  </div>
                </div>
                <div className="flex items-start group hover:bg-white/10 p-3 rounded-xl transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400/50 to-orange-500/50 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 border border-white/20">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-white">
                    <p className="font-semibold text-sm text-white/70 uppercase tracking-wide">Giờ làm việc</p>
                    <p className="font-medium">Thứ 2 - Thứ 6: 9:00 - 17:00</p>
                    <p className="text-white/80">Thứ 7: 10:00 - 14:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Support */}
            <div className="bg-gradient-to-br from-red-500/80 to-red-600/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 text-white relative overflow-hidden border border-red-400/30">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3 border border-white/30">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Hỗ Trợ Khẩn Cấp</h3>
                </div>
                <p className="mb-4 text-red-100 text-sm">
                  Nếu bạn đang gặp tình huống khẩn cấp về lạm dụng chất gây nghiện, vui lòng liên hệ ngay:
                </p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <span className="mr-2 font-bold text-yellow-300">•</span>
                    <div>
                      <p className="font-semibold">Đường dây nóng Quốc gia:</p>
                      <p className="text-lg font-bold">1-800-662-HELP (4357)</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <span className="mr-2 font-bold text-yellow-300">•</span>
                    <div>
                      <p className="font-semibold">Nhắn tin khẩn cấp:</p>
                      <p className="text-lg font-bold">HOME đến 741741</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <span className="mr-2 font-bold text-yellow-300">•</span>
                    <div>
                      <p className="font-semibold">Dịch vụ khẩn cấp:</p>
                      <p className="text-lg font-bold">911</p>
                    </div>
                  </div>
                </div>
                <p className="text-red-100 text-sm">
                  Các dịch vụ này hoạt động 24/7 và cung cấp hỗ trợ tức thì cho những người cần giúp đỡ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Contact;