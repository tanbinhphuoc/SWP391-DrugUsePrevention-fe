// components/consultation/ServicesSection.jsx
import React from 'react';

const ServicesSection = ({ services }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
    {services.map((service) => (
      <div
        key={service.id}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
      >
        <div className="text-4xl mb-4">{service.icon}</div>
        <h3 className="text-white font-semibold text-lg mb-2">{service.name}</h3>
        <p className="text-white/70 text-sm mb-4">{service.description}</p>
        <div className="text-green-300 font-bold text-sm">{service.duration}</div>
      </div>
    ))}
  </div>
);

export default ServicesSection;
