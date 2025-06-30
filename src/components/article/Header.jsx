import React from 'react';
import { Edit3 } from 'lucide-react';

const Header = ({ onCreatePost, showMobileMenu, toggleMobileMenu }) => {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo & Title */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">GN</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Góc Nhận Thức</h1>
              <p className="text-sm text-gray-600">Blog Cộng Đồng Phòng Chống Ma Túy</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Trang chủ</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Giới thiệu</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Liên hệ</a>
            <button 
              onClick={onCreatePost}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center space-x-2"
            >
              <Edit3 className="w-5 h-5" />
              <span>Đăng bài</span>
            </button>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={toggleMobileMenu}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className="w-full h-0.5 bg-gray-600 mb-1"></span>
              <span className="w-full h-0.5 bg-gray-600 mb-1"></span>
              <span className="w-full h-0.5 bg-gray-600"></span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
