import React from 'react';
import { Heart, Book, Calendar, FileCheck } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-12 md:pt-24 md:pb-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Supporting Drug-Free Communities
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-blue-100">
              Empowering individuals with education, support, and resources to prevent substance abuse.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <button className="bg-white text-blue-700 hover:bg-blue-50 transition-colors px-6 py-3 rounded-md font-semibold text-lg">
                Find Courses
              </button>
              <button className="bg-transparent hover:bg-blue-700 border-2 border-white transition-colors px-6 py-3 rounded-md font-semibold text-lg">
                Take Assessment
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-12">
            {[
              { icon: <Book className="w-8 h-8 mb-3" />, title: 'Education', desc: 'Age-appropriate courses' },
              { icon: <FileCheck className="w-8 h-8 mb-3" />, title: 'Assessment', desc: 'Personalized risk evaluation' },
              { icon: <Calendar className="w-8 h-8 mb-3" />, title: 'Counseling', desc: 'Expert guidance' },
              { icon: <Heart className="w-8 h-8 mb-3" />, title: 'Community', desc: 'Support network' },
            ].map((item, index) => (
              <div key={index} className="bg-blue-800 bg-opacity-50 p-4 rounded-lg text-center transform transition-transform hover:scale-105">
                <div className="flex justify-center">{item.icon}</div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-blue-100 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;