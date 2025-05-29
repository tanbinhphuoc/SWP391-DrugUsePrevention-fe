import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, User, Search } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a
              href="/"
              className={`font-bold text-2xl ${
                isScrolled ? 'text-blue-700' : 'text-white'
              }`}
            >
              PreventionSupport
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <NavLinks isScrolled={isScrolled} />

            <div className="flex items-center space-x-4">
              <a
                href="/login"
                className={`flex items-center ${
                  isScrolled ? 'text-gray-700 hover:text-blue-700' : 'text-white hover:text-blue-200'
                }`}
              >
                <User className="h-5 w-5 mr-1" />
                <span>Login</span>
              </a>
              <button
                className={`${
                  isScrolled
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-white hover:bg-blue-50 text-blue-700'
                } px-4 py-2 rounded-md transition-colors font-medium`}
              >
                Get Started
              </button>
            </div>
          </nav>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className={`${isScrolled ? 'text-gray-700' : 'text-white'}`}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white p-4 shadow-lg">
          <nav className="flex flex-col space-y-4">
            <MobileNavLinks />

            <div className="pt-4 border-t border-gray-200">
              <a href="/login" className="flex items-center text-gray-700 hover:text-blue-700 mb-4">
                <User className="h-5 w-5 mr-2" />
                <span>Login</span>
              </a>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors font-medium">
                Get Started
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

const NavLinks = ({ isScrolled }) => {
  const linkClass = isScrolled
    ? 'text-gray-700 hover:text-blue-700'
    : 'text-white hover:text-blue-200';

  return (
    <>
      <a href="#" className={linkClass}>Home</a>
      <a href="#" className={linkClass}>About</a>

      <div className="relative group">
        <button className={`flex items-center ${linkClass}`}>
          Services <ChevronDown className="h-4 w-4 ml-1" />
        </button>
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 hidden group-hover:block">
          <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-blue-50">Educational Courses</a>
          <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-blue-50">Risk Assessment</a>
          <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-blue-50">Counseling</a>
          <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-blue-50">Community Programs</a>
        </div>
      </div>

      <a href="#" className={linkClass}>Resources</a>
      <a href="#" className={linkClass}>Contact</a>
    </>
  );
};

const MobileNavLinks = () => {
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <>
      <a href="#" className="text-gray-700 hover:text-blue-700">Home</a>
      <a href="#" className="text-gray-700 hover:text-blue-700">About</a>

      <div>
        <button
          onClick={() => setServicesOpen(!servicesOpen)}
          className="flex items-center justify-between w-full text-gray-700 hover:text-blue-700"
        >
          <span>Services</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? 'transform rotate-180' : ''}`} />
        </button>

        {servicesOpen && (
          <div className="mt-2 ml-4 space-y-2">
            <a href="#" className="block text-gray-600 hover:text-blue-700">Educational Courses</a>
            <a href="#" className="block text-gray-600 hover:text-blue-700">Risk Assessment</a>
            <a href="#" className="block text-gray-600 hover:text-blue-700">Counseling</a>
            <a href="#" className="block text-gray-600 hover:text-blue-700">Community Programs</a>
          </div>
        )}
      </div>

      <a href="#" className="text-gray-700 hover:text-blue-700">Resources</a>
      <a href="#" className="text-gray-700 hover:text-blue-700">Contact</a>

      <div className="relative mt-2">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>
    </>
  );
};

export default Header;