import { Clock, CheckCircle } from 'lucide-react';

const ServicesSection = ({ consultationServices, selectedService, setSelectedService }) => (
  <section className="py-16 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Các Dịch Vụ Tư Vấn
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Chọn phương thức tư vấn phù hợp với nhu cầu và hoàn cảnh của bạn
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {consultationServices.map((service) => (
          <div
            key={service.id}
            className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 ${
              selectedService === service.id ? 'ring-4 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedService(service.id)}
          >
            <div className="p-8">
              <div className="text-blue-600 mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-blue-600">{service.price}</span>
                <span className="text-sm text-gray-500 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {service.duration}
                </span>
              </div>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Chọn dịch vụ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
