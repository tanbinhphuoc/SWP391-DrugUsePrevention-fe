import React from 'react';
import { Shield, Users, Calendar, Star } from 'lucide-react';

const stats = [
  { icon: Shield, value: "5,000+", label: "Đánh giá hoàn thành", color: "text-red-600" },
  { icon: Users, value: "98%", label: "Độ chính xác", color: "text-orange-600" },
  { icon: Calendar, value: "24h", label: "Thời gian xử lý", color: "text-yellow-600" },
  { icon: Star, value: "4.9/5", label: "Đánh giá khách hàng", color: "text-red-500" }
];

const StatsSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${stat.color.includes('red') ? 'from-red-100 to-red-200' : stat.color.includes('orange') ? 'from-orange-100 to-orange-200' : stat.color.includes('yellow') ? 'from-yellow-100 to-yellow-200' : 'from-red-100 to-red-200'} mb-4`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
