import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

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
    <div id="contact" className="py-20 relative overflow-hidden" style={{backgroundColor: '#E3F2FD'}}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full mb-6 shadow-lg">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-6">
            Liên Hệ Với Chúng Tôi
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto mb-8 rounded-full"></div>
          <p className="max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
            Bạn có câu hỏi hoặc cần hỗ trợ? Đội ngũ của chúng tôi luôn sẵn sàng giúp đỡ bạn.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 hover:shadow-3xl transition-all duration-500">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Gửi Tin Nhắn</h3>
              </div>

              {formSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-emerald-600 mb-2">Cảm ơn bạn!</h4>
                  <p className="text-gray-600">Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Họ và Tên *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white/50 hover:bg-white group-hover:border-gray-300"
                        placeholder="Nhập họ và tên của bạn"
                      />
                    </div>
                    <div className="group">
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white/50 hover:bg-white group-hover:border-gray-300"
                        placeholder="Nhập địa chỉ email"
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Chủ đề
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white/50 hover:bg-white group-hover:border-gray-300"
                      placeholder="Nhập chủ đề"
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Tin nhắn *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white/50 hover:bg-white group-hover:border-gray-300 resize-none"
                      placeholder="Chúng tôi có thể giúp gì cho bạn?"
                    ></textarea>
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white py-4 px-6 rounded-xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center group"
                  >
                    <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Gửi Tin Nhắn
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 hover:shadow-3xl transition-all duration-500">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Thông Tin Liên Hệ</h3>
              <div className="space-y-4">
                <div className="flex items-start group hover:bg-blue-50/50 p-3 rounded-xl transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-gray-700">
                    <p className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Điện thoại</p>
                    <p className="font-medium text-lg">(123) 456-7890</p>
                  </div>
                </div>
                <div className="flex items-start group hover:bg-emerald-50/50 p-3 rounded-xl transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-gray-700">
                    <p className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Email</p>
                    <p className="font-medium text-lg">info@preventionsupport.org</p>
                  </div>
                </div>
                <div className="flex items-start group hover:bg-purple-50/50 p-3 rounded-xl transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-gray-700">
                    <p className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Địa chỉ</p>
                    <p className="font-medium">123 Prevention Street</p>
                    <p className="text-gray-600">City, State 12345</p>
                  </div>
                </div>
                <div className="flex items-start group hover:bg-orange-50/50 p-3 rounded-xl transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-gray-700">
                    <p className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Giờ làm việc</p>
                    <p className="font-medium">Thứ 2 - Thứ 6: 9:00 - 17:00</p>
                    <p className="text-gray-600">Thứ 7: 10:00 - 14:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Support */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl shadow-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Hỗ Trợ Khẩn Cấp</h3>
                </div>
                <p className="mb-4 text-red-100 text-sm">
                  Nếu bạn đang gặp tình huống khẩn cấp về lạm dụng chất gây nghiện, vui lòng liên hệ ngay:
                </p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center bg-white/10 rounded-lg p-3">
                    <span className="mr-2 font-bold text-yellow-300">•</span>
                    <div>
                      <p className="font-semibold">Đường dây nóng Quốc gia:</p>
                      <p className="text-lg font-bold">1-800-662-HELP (4357)</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-white/10 rounded-lg p-3">
                    <span className="mr-2 font-bold text-yellow-300">•</span>
                    <div>
                      <p className="font-semibold">Nhắn tin khẩn cấp:</p>
                      <p className="text-lg font-bold">HOME đến 741741</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-white/10 rounded-lg p-3">
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
    </div>
  );
};

export default Contact;