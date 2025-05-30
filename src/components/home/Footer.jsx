import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Prevention Support</h3>
            <p className="mb-4 text-sm text-gray-400">
              Empowering communities through education, assessment, and support to prevent substance abuse.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors rounded-full p-2 bg-gray-800 hover:bg-gray-700">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors rounded-full p-2 bg-gray-800 hover:bg-gray-700">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors rounded-full p-2 bg-gray-800 hover:bg-gray-700">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors rounded-full p-2 bg-gray-800 hover:bg-gray-700">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Resources</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Educational Courses</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Risk Assessments</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Counseling Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Community Programs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Resources</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Newsletter</h3>
            <p className="mb-4 text-sm text-gray-400">
              Subscribe to our newsletter for the latest updates, resources, and prevention tips.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
              <button className="px-4 py-2 bg-emerald-500 text-white rounded-r-md hover:bg-emerald-600 transition-colors text-sm">
                Send
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© 2025 Prevention Support. All rights reserved.</p>
            <p className="mt-2 md:mt-0 flex items-center">
              Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> by volunteers dedicated to healthier communities
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;