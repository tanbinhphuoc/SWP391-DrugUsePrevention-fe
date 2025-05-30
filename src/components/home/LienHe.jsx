import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <div className="py-16 bg-gradient-to-b from-gray-50 to-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <div className="w-24 h-1 bg-emerald-400 mx-auto mb-8"></div>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Have questions or need support? Our team is here to help.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Get in Touch</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter subject"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-md transition-colors font-medium shadow-md hover:shadow-lg"
              >
                Send Message
              </button>
            </form>
          </div>
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Contact Information</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Phone className="h-5 w-5 text-emerald-600 mt-1" />
                  <div className="ml-3 text-gray-700">
                    <p className="font-medium">Phone</p>
                    <p>(123) 456-7890</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Mail className="h-5 w-5 text-emerald-600 mt-1" />
                  <div className="ml-3 text-gray-700">
                    <p className="font-medium">Email</p>
                    <p>info@preventionsupport.org</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-emerald-600 mt-1" />
                  <div className="ml-3 text-gray-700">
                    <p className="font-medium">Address</p>
                    <p>123 Prevention Street, City, State 12345</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="h-5 w-5 text-emerald-600 mt-1" />
                  <div className="ml-3 text-gray-700">
                    <p className="font-medium">Hours</p>
                    <p>Monday-Friday: 9AM-5PM</p>
                    <p>Saturday: 10AM-2PM</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-sky-700 rounded-lg shadow-md p-6 text-white">
              <h3 className="text-2xl font-bold mb-6">Emergency Support</h3>
              <p className="mb-4 text-sm">
                If you're experiencing a substance abuse emergency, please contact these resources immediately:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <span className="mr-2 font-bold text-emerald-400">•</span>
                  <span>National Helpline: <strong>1-800-662-HELP (4357)</strong></span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 font-bold text-emerald-400">•</span>
                  <span>Crisis Text Line: Text <strong>HOME to 741741</strong></span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 font-bold text-emerald-400">•</span>
                  <span>Emergency Services: <strong>911</strong></span>
                </li>
              </ul>
              <p className="text-sm">
                These services are available 24/7 and provide immediate support for those in need.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;