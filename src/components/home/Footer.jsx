import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Youtube, Heart, Send } from 'lucide-react';

// Loading overlay component for navigation transitions
const NavigationOverlay = ({ isNavigating, destination }) => {
  if (!isNavigating) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-emerald-600 to-blue-700 z-[100] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
        <p className="text-white text-lg font-semibold">Đang chuyển đến {destination}...</p>
      </div>
    </div>
  );
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [destination, setDestination] = useState('');

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Handle navigation with loading state
  const handleNavigation = (path, destinationName) => {
    setDestination(destinationName);
    setIsNavigating(true);
    
    setTimeout(() => {
      window.location.href = path;
    }, 800);
  };

  return (
    <>
      {/* Navigation Loading Overlay */}
      <NavigationOverlay isNavigating={isNavigating} destination={destination} />
      
      <footer className="bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-sm text-slate-300 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Brand Section */}
            <div className="space-y-4 transform hover:scale-105 transition-all duration-500 ease-out">
              <h3 className="text-white text-xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Prevention Support
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed transform transition-all duration-300 hover:text-slate-300">
                Empowering communities through education, assessment, and support to prevent substance abuse.
              </p>
              <div className="flex space-x-3 pt-4">
                {[
                  { Icon: Facebook, color: 'hover:text-blue-400', bg: 'hover:bg-blue-400/10' },
                  { Icon: Twitter, color: 'hover:text-sky-400', bg: 'hover:bg-sky-400/10' },
                  { Icon: Instagram, color: 'hover:text-pink-400', bg: 'hover:bg-pink-400/10' },
                  { Icon: Youtube, color: 'hover:text-red-400', bg: 'hover:bg-red-400/10' }
                ].map(({ Icon, color, bg }, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className={`text-slate-400 ${color} transition-all duration-300 rounded-full p-2.5 bg-slate-800/50 ${bg} hover:scale-110 hover:rotate-6 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="transform hover:scale-105 transition-all duration-500 ease-out">
              <h3 className="text-white text-lg font-semibold mb-6 relative">
                Liên kết nhanh
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-transparent rounded-full"></div>
              </h3>
              <ul className="space-y-3">
                {/* Home - Navigate to homepage */}
                <li className="transform transition-all duration-300 hover:translate-x-2">
                  <button 
                    onClick={() => handleNavigation('/', 'Trang chủ')}
                    className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm relative group"
                    onMouseEnter={() => setIsHovered('quick-home')}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <span className="relative z-10">Trang chủ</span>
                    <div className={`absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-transparent rounded px-2 py-1 -mx-2 -my-1 transform transition-all duration-300 ${isHovered === 'quick-home' ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}></div>
                  </button>
                </li>
                
                {/* About Us - Smooth scroll */}
                <li className="transform transition-all duration-300 hover:translate-x-2">
                  <a 
                    href="#about"
                    onClick={(e) => handleSmoothScroll(e, '#about')}
                    className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm relative group"
                    onMouseEnter={() => setIsHovered('quick-about')}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <span className="relative z-10">Giới thiệu</span>
                    <div className={`absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-transparent rounded px-2 py-1 -mx-2 -my-1 transform transition-all duration-300 ${isHovered === 'quick-about' ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}></div>
                  </a>
                </li>
                
                {/* Services - Smooth scroll */}
                <li className="transform transition-all duration-300 hover:translate-x-2">
                  <a 
                    href="#services"
                    onClick={(e) => handleSmoothScroll(e, '#services')}
                    className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm relative group"
                    onMouseEnter={() => setIsHovered('quick-services')}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <span className="relative z-10">Dịch vụ</span>
                    <div className={`absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-transparent rounded px-2 py-1 -mx-2 -my-1 transform transition-all duration-300 ${isHovered === 'quick-services' ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}></div>
                  </a>
                </li>
                
                {/* Resources - Navigate to resources page */}
                <li className="transform transition-all duration-300 hover:translate-x-2">
                  <button 
                    onClick={() => handleNavigation('/resources', 'Tài nguyên')}
                    className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm relative group"
                    onMouseEnter={() => setIsHovered('quick-resources')}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <span className="relative z-10">Tài nguyên</span>
                    <div className={`absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-transparent rounded px-2 py-1 -mx-2 -my-1 transform transition-all duration-300 ${isHovered === 'quick-resources' ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}></div>
                  </button>
                </li>
                
                {/* Contact - Smooth scroll */}
                <li className="transform transition-all duration-300 hover:translate-x-2">
                  <a 
                    href="#contact"
                    onClick={(e) => handleSmoothScroll(e, '#contact')}
                    className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm relative group"
                    onMouseEnter={() => setIsHovered('quick-contact')}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <span className="relative z-10">Liên hệ</span>
                    <div className={`absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-transparent rounded px-2 py-1 -mx-2 -my-1 transform transition-all duration-300 ${isHovered === 'quick-contact' ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}></div>
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="transform hover:scale-105 transition-all duration-500 ease-out">
              <h3 className="text-white text-lg font-semibold mb-6 relative">
                Dịch vụ
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-transparent rounded-full"></div>
              </h3>
              <ul className="space-y-3">
                {[
                  { href: '/education-courses', text: 'Khóa học giáo dục', name: 'Khóa học giáo dục' },
                  { href: '/risk-assessment', text: 'Đánh giá rủi ro', name: 'Đánh giá rủi ro' },
                  { href: '/consultation', text: 'Tư vấn', name: 'Tư vấn' },
                  { href: '/community-programs', text: 'Chương trình cộng đồng', name: 'Chương trình cộng đồng' },
                  { href: '/resources', text: 'Tài nguyên', name: 'Tài nguyên' }
                ].map((service, index) => (
                  <li key={index} className="transform transition-all duration-300 hover:translate-x-2">
                    <button 
                      onClick={() => handleNavigation(service.href, service.name)}
                      className="text-slate-400 hover:text-blue-400 transition-all duration-300 text-sm relative group"
                      onMouseEnter={() => setIsHovered(`service-${index}`)}
                      onMouseLeave={() => setIsHovered(null)}
                    >
                      <span className="relative z-10">{service.text}</span>
                      <div className={`absolute inset-0 bg-gradient-to-r from-blue-400/10 to-transparent rounded px-2 py-1 -mx-2 -my-1 transform transition-all duration-300 ${isHovered === `service-${index}` ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}></div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="transform hover:scale-105 transition-all duration-500 ease-out">
              <h3 className="text-white text-lg font-semibold mb-6 relative">
                Bản tin
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-400 to-transparent rounded-full"></div>
              </h3>
              <p className="mb-6 text-sm text-slate-400 leading-relaxed transition-all duration-300 hover:text-slate-300">
                Đăng ký nhận bản tin để cập nhật thông tin mới nhất, tài nguyên và mẹo phòng ngừa.
              </p>
              <div className="relative group">
                <div className="flex rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 backdrop-blur-sm bg-slate-800/30 transition-all duration-300 hover:border-slate-600 hover:shadow-emerald-500/10">
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-sm text-white placeholder-slate-400 transition-all duration-300 focus:placeholder-slate-500"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 text-sm font-medium relative overflow-hidden group">
                    <span className="relative z-10 flex items-center space-x-2">
                      <span>Gửi</span>
                      <Send className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-700/50 pt-8 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm">
              <p className="text-slate-400 transition-all duration-300 hover:text-slate-300">
                © 2025 Prevention Support. Tất cả quyền được bảo lưu.
              </p>
              <p className="mt-4 md:mt-0 flex items-center text-slate-400 transition-all duration-300 hover:text-slate-300">
                Được tạo với 
                <Heart className="h-4 w-4 mx-2 text-red-500 animate-pulse hover:scale-110 transition-transform duration-300" /> 
                bởi các tình nguyện viên tận tâm vì cộng đồng khỏe mạnh
              </p>
            </div>
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/30 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </footer>
    </>
  );
};

export default Footer;