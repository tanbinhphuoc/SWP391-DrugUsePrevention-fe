import React from 'react';
import { Facebook, Youtube, MessageCircle, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo + mô tả */}
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">GN</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">Góc Nhận Thức</h3>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Nền tảng chia sẻ kiến thức và kinh nghiệm về công tác phòng chống ma túy trong cộng đồng.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Trang chủ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Giới thiệu</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Bài viết</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sự kiện</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Liên hệ</a></li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li><a href="/consultation" className="text-gray-400 hover:text-white transition-colors">Tư vấn miễn phí</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Đăng ký tình nguyện</a></li>
              <li><a href="/resources" className="text-gray-400 hover:text-white transition-colors">Tài liệu tham khảo</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          {/* Liên hệ + nhận bản tin */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3" />
                Hotline: 1900-xxxx
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3" />
                info@gocnhanthuc.vn
              </div>
            </div>

            <div className="mt-6">
              <h5 className="font-semibold mb-2">Nhận bản tin</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Góc Nhận Thức. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
