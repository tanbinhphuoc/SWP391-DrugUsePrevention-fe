import React from 'react';
import { stats } from './data/stats';

const StatsSection = () => (
  <section className="relative py-12 bg-white/5 backdrop-blur-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center group">
            <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <div className="text-white">{stat.icon}</div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
            <div className="text-white/80">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
