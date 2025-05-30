"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, X, ChevronDown, User, Search } from "lucide-react"
import Logo from '../../assets/medical_logo.jpg' // Đã thay đổi đường dẫn logo

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header
      className={`fixed w-full z-50 bg-white transition-all duration-300 ${isScrolled ? "shadow-md py-1" : "py-3"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img
                src={Logo}
                alt="Medical Logo" // Cập nhật alt text cho phù hợp với logo y tế
                className="h-14 sm:h-16 md:h-18 w-auto rounded-md shadow-sm transition-transform duration-300 hover:scale-105"
              />
              <span className="font-bold text-xl sm:text-2xl text-sky-700">
                PreventionSupport
              </span>
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <NavLinks />

            <div className="flex items-center space-x-3">
              <a
                href="/login"
                className="flex items-center text-sky-700 hover:text-orange-500 transition-colors duration-200"
              >
                <User className="h-5 w-5 mr-1" />
                <span className="text-sm sm:text-base">Đăng nhập</span>
              </a>
              <button className="bg-sky-600 hover:bg-emerald-500 text-white border-2 border-sky-600 hover:border-emerald-500 px-5 sm:px-7 py-1.5 sm:py-2 rounded-full transition-colors duration-300 font-semibold text-sm sm:text-base">
                Bắt đầu
              </button>
            </div>
          </nav>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-sky-700 transition-colors duration-200"
              aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white p-4 shadow-lg transition-all duration-300 ease-in-out">
          <nav className="flex flex-col space-y-4">
            <MobileNavLinks />
            <div className="pt-4 border-t border-gray-200">
              <a
                href="/login"
                className="flex items-center text-sky-700 hover:text-orange-500 mb-4 transition-colors duration-200"
              >
                <User className="h-5 w-5 mr-2" />
                <span>Đăng nhập</span>
              </a>
              <button className="w-full bg-sky-600 hover:bg-emerald-500 text-white px-7 py-2 rounded-full transition-colors duration-300 font-semibold">
                Bắt đầu
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

const NavLinks = () => {
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

  return (
    <>
      <a href="#" className="text-sky-700 hover:text-orange-500 transition-colors duration-200 text-sm sm:text-base">
        Trang chủ
      </a>
      <a href="#" className="text-sky-700 hover:text-orange-500 transition-colors duration-200 text-sm sm:text-base">
        Giới thiệu
      </a>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleServices}
          className="flex items-center text-sky-700 hover:text-orange-500 transition-colors duration-200 focus:outline-none text-sm sm:text-base"
          aria-expanded={servicesOpen}
          aria-controls="services-dropdown"
          aria-label="Dịch vụ"
        >
          Dịch vụ{" "}
          <ChevronDown
            className={`h-4 w-4 ml-1 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
          />
        </button>
        <div
          id="services-dropdown"
          className={`absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 transition-all duration-300 ease-in-out ${
            servicesOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <a
            href="#"
            className="block px-4 py-2 text-sky-800 hover:bg-sky-50 hover:text-orange-500 transition-colors duration-200 text-sm"
          >
            Khóa học giáo dục
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-sky-800 hover:bg-sky-50 hover:text-orange-500 transition-colors duration-200 text-sm"
          >
            Đánh giá rủi ro
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-sky-800 hover:bg-sky-50 hover:text-orange-500 transition-colors duration-200 text-sm"
          >
            Tư vấn
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-sky-800 hover:bg-sky-50 hover:text-orange-500 transition-colors duration-200 text-sm"
          >
            Chương trình cộng đồng
          </a>
        </div>
      </div>

      <a href="#" className="text-sky-700 hover:text-orange-500 transition-colors duration-200 text-sm sm:text-base">
        Tài nguyên
      </a>
      <a href="#" className="text-sky-700 hover:text-orange-500 transition-colors duration-200 text-sm sm:text-base">
        Liên hệ
      </a>
    </>
  )
}

const MobileNavLinks = () => {
  const [servicesOpen, setServicesOpen] = useState(false)

  return (
    <>
      <a href="#" className="text-sky-700 hover:text-orange-500 transition-colors duration-200">
        Trang chủ
      </a>
      <a href="#" className="text-sky-700 hover:text-orange-500 transition-colors duration-200">
        Giới thiệu
      </a>

      <div>
        <button
          onClick={() => setServicesOpen(!servicesOpen)}
          className="flex items-center justify-between w-full text-sky-700 hover:text-orange-500 transition-colors duration-200 focus:outline-none"
          aria-expanded={servicesOpen}
          aria-controls="mobile-services-dropdown"
          aria-label="Dịch vụ"
        >
          <span>Dịch vụ</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${servicesOpen ? "transform rotate-180" : ""}`}
          />
        </button>

        <div
          id="mobile-services-dropdown"
          className={`mt-2 ml-4 space-y-2 transition-all duration-300 ease-in-out ${
            servicesOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <a href="#" className="block text-sky-600 hover:text-orange-500 transition-colors duration-200">
            Khóa học giáo dục
          </a>
          <a href="#" className="block text-sky-600 hover:text-orange-500 transition-colors duration-200">
            Đánh giá rủi ro
          </a>
          <a href="#" className="block text-sky-600 hover:text-orange-500 transition-colors duration-200">
            Tư vấn
          </a>
          <a href="#" className="block text-sky-600 hover:text-orange-500 transition-colors duration-200">
            Chương trình cộng đồng
          </a>
        </div>
      </div>

      <a href="#" className="text-sky-700 hover:text-orange-500 transition-colors duration-200">
        Tài nguyên
      </a>
      <a href="#" className="text-sky-700 hover:text-orange-500 transition-colors duration-200">
        Liên hệ
      </a>

      <div className="relative mt-2">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>
    </>
  )
}

export default Header