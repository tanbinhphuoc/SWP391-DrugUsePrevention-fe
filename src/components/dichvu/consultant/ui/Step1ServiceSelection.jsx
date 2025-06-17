import React from 'react';

const Step1ServiceSelection = ({ services, selectedService, setSelectedService }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Chọn dịch vụ tư vấn</h3>
      <div className="space-y-3">
        {services.map((service) => (
          <div
            key={service.id}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedService?.id === service.id
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedService(service)}
          >
            <div className="flex items-start space-x-4">
              <div className="text-3xl">{service.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{service.name}</h4>
                <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                <p className="text-emerald-600 font-medium text-sm mt-2">
                  100.000đ/giờ - Tư vấn trực tuyến
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step1ServiceSelection;
