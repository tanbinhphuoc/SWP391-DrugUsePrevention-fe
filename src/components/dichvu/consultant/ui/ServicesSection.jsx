import React from 'react';

const ServicesSection = ({ services }) => (
  <div className="mb-12">
    <h2 className="text-3xl font-bold text-white text-center mb-8">Dịch vụ tư vấn</h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {services.map((service) => (
        <div key={service.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
          <div className="text-4xl mb-4 text-center">{service.icon}</div>
          <h3 className="text-white font-semibold text-lg mb-2">{service.name}</h3>
          <p className="text-white/70 text-sm mb-4">{service.description}</p>
          <button className="text-green-300 text-sm font-medium hover:text-green-200 transition-colors">
            Tìm hiểu thêm →
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default ServicesSection;
