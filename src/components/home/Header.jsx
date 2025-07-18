"use client"

import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react"
import { Menu, X, ChevronDown, User, Search, Star } from "lucide-react"
import Logo from '../../assets/medical_logo.jpg'

// Loading overlay component for navigation transitions
const NavigationOverlay = ({ isNavigating, destination }) => {
  if (!isNavigating) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-700 z-[100] flex items-center justify-center backdrop-blur-sm">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
        <p className="text-white text-lg font-semibold">Đang chuyển đến {destination}...</p>
      </div>
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [destination, setDestination] = useState('')
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [activeSection, setActiveSection] = useState('home')
  const [userName, setUserName] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const token = localStorage.getItem("token");
    setUserName(name);
    setIsLoggedIn(!!(name && token));
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const name = localStorage.getItem("userName");
      const token = localStorage.getItem("token");
      setUserName(name);
      setIsLoggedIn(!!(name && token));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Hiệu ứng trong suốt khi scroll
      if (currentScrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      // Ẩn/hiện header khi scroll
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false)
      } else {
        setIsHeaderVisible(true)
      }
      
      setLastScrollY(currentScrollY)

      // Xác định section hiện tại
      const sections = ['home', 'about', 'contact']
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })

      if (currentSection) {
        setActiveSection(currentSection)
      } else if (currentScrollY < 100) {
        setActiveSection('home')
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Enhanced smooth scroll with loading state
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault()
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      const headerOffset = 80
      const elementPosition = targetElement.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
    setIsMenuOpen(false)
  }

  // Handle navigation with loading state
  const handleNavigation = (path, destinationName) => {
    setDestination(destinationName)
    setIsNavigating(true)
    setIsMenuOpen(false)
    
    setTimeout(() => {
      window.location.href = path
    }, 800)
  }

  const getRouteByRole = (roleId) => {
    const routes = {
      1: "/",
      2: "/member-dashboard",
      3: "/staff-dashboard",
      4: "/consultant-dashboard",
      5: "/manager-dashboard",
      6: "/dashboard",
    };
    return routes[roleId] || "/";
  };

  return (
    <>
      {/* Navigation Loading Overlay */}
      <NavigationOverlay isNavigating={isNavigating} destination={destination} />
      
      <header
        className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-white/20' 
            : 'bg-white'
        }`}
        style={{
          background: isScrolled 
            ? 'rgba(255, 255, 255, 0.95)' 
            : 'rgba(255, 255, 255, 1)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="flex items-center group">
                <div className="relative">
                  <img
                    src={Logo}
                    alt="Medical Logo"
                    className="h-10 w-auto rounded-lg shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-emerald-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="ml-3 font-bold text-xl text-sky-700 group-hover:text-sky-600 transition-colors duration-300">
                  PreventionSupport
                </span>
              </a>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <NavLinks 
                handleSmoothScroll={handleSmoothScroll} 
                handleNavigation={handleNavigation}
                activeSection={activeSection}
              />

             <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => {
                        const roleId = Number(localStorage.getItem("roleId"));
                        const dashboardPath = getRouteByRole(roleId);
                        handleNavigation(dashboardPath, "Dashboard của bạn");
                      }}
                      className="flex items-center space-x-2 text-sky-700 font-medium hover:underline"
                      title="Vào trang của bạn"
                    >
                      <User className="w-5 h-5" />
                      <span>Chào, {userName}</span>
                    </button>

                    <button
                      onClick={() => {
                        localStorage.clear();
                        setUserName(null);
                        setIsLoggedIn(false);
                        handleNavigation("/", "Trang chủ");
                      }}
                      className="text-sm text-red-500 hover:underline ml-4"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleNavigation('/login', 'Đăng nhập')}
                      className="flex items-center text-sky-700 hover:text-orange-500 transition-all duration-300 group"
                    >
                      <User className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">Đăng nhập</span>
                    </button>
                    <button
                      onClick={() => handleNavigation('/register', 'Đăng ký')}
                      className="bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white px-6 py-2 rounded-full transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      Bắt đầu
                    </button>
                  </>
                )}
              </div>
            </nav>

            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-sky-700 hover:text-sky-600 transition-colors duration-200 p-2"
                aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-screen opacity-100 bg-white/95 backdrop-blur-md' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-4 pb-4 space-y-2">
            <MobileNavLinks 
              handleSmoothScroll={handleSmoothScroll} 
              handleNavigation={handleNavigation}
              activeSection={activeSection}
            />
            <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center space-x-2 text-sky-700 font-medium">
                    <User className="w-5 h-5" />
                    <span>Chào, {userName}</span>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      setUserName(null);
                      setIsLoggedIn(false);
                      handleNavigation("/", "Trang chủ");
                    }}
                    className="text-sm text-red-500 hover:underline ml-4"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigation('/login', 'Đăng nhập')}
                    className="flex items-center text-sky-700 hover:text-orange-500 transition-all duration-300 group"
                  >
                    <User className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Đăng nhập</span>
                  </button>
                  <button
                    onClick={() => handleNavigation('/register', 'Đăng ký')}
                    className="bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white px-6 py-2 rounded-full transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Bắt đầu
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

const NavLinks = ({ handleSmoothScroll, handleNavigation, activeSection }) => {
  const [servicesOpen, setServicesOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleServices = () => {
    setServicesOpen(!servicesOpen)
  }

  const closeDropdown = () => {
    setServicesOpen(false)
  }

  const navLinkClass = (section) => `
    relative text-sm font-medium transition-all duration-300 group px-3 py-2 rounded-lg
    ${activeSection === section 
      ? 'text-orange-500 bg-orange-50' 
      : 'text-sky-700 hover:text-orange-500 hover:bg-sky-50'
    }
  `

  return (
    <>
      <a 
        href="/" 
        className={navLinkClass('home')}
      >
        Trang chủ
        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transform transition-transform duration-300 ${
          activeSection === 'home' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}></span>
      </a>
      
      <a 
        href="#about" 
        onClick={(e) => handleSmoothScroll(e, 'about')}
        className={navLinkClass('about')}
      >
        Giới thiệu
        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transform transition-transform duration-300 ${
          activeSection === 'about' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}></span>
      </a>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleServices}
          className="flex items-center text-sky-700 hover:text-orange-500 transition-all duration-300 focus:outline-none text-sm font-medium px-3 py-2 rounded-lg hover:bg-sky-50 group"
          aria-expanded={servicesOpen}
          aria-controls="services-dropdown"
          aria-label="Dịch vụ"
        >
          Dịch vụ
          <ChevronDown
            className={`h-4 w-4 ml-1 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
          />
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
        </button>
        
        <div
          id="services-dropdown"
          className={`absolute left-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 py-2 z-50 transition-all duration-300 ease-in-out ${
            servicesOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"
          }`}
        >
          <button
            onClick={() => {
              closeDropdown();
              handleNavigation('/UserCourses', 'Khóa học giáo dục');
            }}
            className="block w-full text-left px-4 py-3 text-sky-800 hover:bg-gradient-to-r hover:from-sky-50 hover:to-emerald-50 hover:text-orange-500 transition-all duration-200 text-sm font-medium"
          >
            📚 Khóa học giáo dục
          </button>
          <button
            onClick={() => {
              closeDropdown();
              handleNavigation('/UserSurveys', 'Đánh giá rủi ro');
            }}
            className="block w-full text-left px-4 py-3 text-sky-800 hover:bg-gradient-to-r hover:from-sky-50 hover:to-emerald-50 hover:text-orange-500 transition-all duration-200 text-sm font-medium"
          >
            🔍 Đánh giá rủi ro
          </button>
          <button
            onClick={() => {
              closeDropdown();
              handleNavigation('/UserAppointments', 'Tư vấn');
            }}
            className="block w-full text-left px-4 py-3 text-sky-800 hover:bg-gradient-to-r hover:from-sky-50 hover:to-emerald-50 hover:text-orange-500 transition-all duration-200 text-sm font-medium"
          >
            💬 Tư vấn
          </button>
          <button
            onClick={() => {
              closeDropdown();
              handleNavigation('/UserAppointments', 'Chương trình cộng đồng');
            }}
            className="block w-full text-left px-4 py-3 text-sky-800 hover:bg-gradient-to-r hover:from-sky-50 hover:to-emerald-50 hover:text-orange-500 transition-all duration-200 text-sm font-medium"
          >
            🤝 Chương trình cộng đồng
          </button>
        </div>
      </div>

      <button 
        onClick={() => handleNavigation('/resources', 'Tài nguyên')}
        className="text-sky-700 hover:text-orange-500 transition-all duration-300 text-sm font-medium px-3 py-2 rounded-lg hover:bg-sky-50 group relative"
      >
        Tài nguyên
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
      </button>
      
      <a 
        href="#contact" 
        onClick={(e) => handleSmoothScroll(e, 'contact')}
        className={navLinkClass('contact')}
      >
        Liên hệ
        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transform transition-transform duration-300 ${
          activeSection === 'contact' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}></span>
      </a>
    </>
  )
}

const MobileNavLinks = ({ handleSmoothScroll, handleNavigation, activeSection }) => {
  const [servicesOpen, setServicesOpen] = useState(false)

  const mobileNavLinkClass = (section) => `
    block w-full text-left px-4 py-3 rounded-lg transition-all duration-300 font-medium
    ${activeSection === section 
      ? 'text-orange-500 bg-orange-50' 
      : 'text-sky-700 hover:text-orange-500 hover:bg-sky-50'
    }
  `

  return (
    <>
      <a href="/" className={mobileNavLinkClass('home')}>
        🏠 Trang chủ
      </a>
      <a 
        href="#about" 
        onClick={(e) => handleSmoothScroll(e, 'about')}
        className={mobileNavLinkClass('about')}
      >
        ℹ️ Giới thiệu
      </a>

      <div>
        <button
          onClick={() => setServicesOpen(!servicesOpen)}
          className="flex items-center justify-between w-full px-4 py-3 text-sky-700 hover:text-orange-500 hover:bg-sky-50 rounded-lg transition-all duration-300 focus:outline-none font-medium"
          aria-expanded={servicesOpen}
          aria-controls="mobile-services-dropdown"
          aria-label="Dịch vụ"
        >
          <span>🛠️ Dịch vụ</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${servicesOpen ? "transform rotate-180" : ""}`}
          />
        </button>

        <div
          id="mobile-services-dropdown"
          className={`ml-4 mt-2 space-y-1 transition-all duration-300 ease-in-out ${
            servicesOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <button 
            onClick={() => handleNavigation('/education-courses', 'Khóa học giáo dục')}
            className="block w-full text-left px-4 py-2 text-sky-600 hover:text-orange-500 hover:bg-sky-50 rounded-lg transition-all duration-200 text-sm"
          >
            📚 Khóa học giáo dục
          </button>
          <button 
            onClick={() => handleNavigation('/risk-assessment', 'Đánh giá rủi ro')}
            className="block w-full text-left px-4 py-2 text-sky-600 hover:text-orange-500 hover:bg-sky-50 rounded-lg transition-all duration-200 text-sm"
          >
            🔍 Đánh giá rủi ro
          </button>
          <button 
            onClick={() => handleNavigation('/consultation', 'Tư vấn')}
            className="block w-full text-left px-4 py-2 text-sky-600 hover:text-orange-500 hover:bg-sky-50 rounded-lg transition-all duration-200 text-sm"
          >
            💬 Tư vấn
          </button>
          <button 
            onClick={() => handleNavigation('/community-programs', 'Chương trình cộng đồng')}
            className="block w-full text-left px-4 py-2 text-sky-600 hover:text-orange-500 hover:bg-sky-50 rounded-lg transition-all duration-200 text-sm"
          >
            🤝 Chương trình cộng đồng
          </button>
        </div>
      </div>

      <button 
        onClick={() => handleNavigation('/resources', 'Tài nguyên')}
        className="block w-full text-left px-4 py-3 text-sky-700 hover:text-orange-500 hover:bg-sky-50 rounded-lg transition-all duration-300 font-medium"
      >
        📖 Tài nguyên
      </button>
      
      <a
        href="#contact" 
        onClick={(e) => handleSmoothScroll(e, 'contact')}
        className={mobileNavLinkClass('contact')}
      >
        📞 Liên hệ
      </a>

      <div className="relative mt-2">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>
    </>
  )
}

export default Header