import React from 'react';
import Hero from '../../common/Hero';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="group relative bg-gradient-to-br from-sky-700 to-sky-800 rounded-lg p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:from-sky-600 hover:to-sky-700 shadow-lg hover:shadow-xl border border-sky-600/30 hover:border-emerald-400/50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:via-emerald-500/5 group-hover:to-emerald-500/10 transition-all duration-500"></div>
      <div className="relative">
        <div className="w-8 h-8 mx-auto mb-3 text-emerald-300 group-hover:text-emerald-200 transform transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        <h3 className="font-semibold text-lg text-white mb-2 transform transition-all duration-300 group-hover:text-emerald-100">
          {title}
        </h3>
        <p className="text-sky-100 text-sm transform transition-all duration-300 group-hover:text-sky-50">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;