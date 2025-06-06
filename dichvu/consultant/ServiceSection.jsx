import { Clock, CheckCircle } from 'lucide-react';

// Services Section Component
const ServicesSection = ({ consultationServices, selectedService, setSelectedService }) => {
  return (
    <div className="relative py-20 px-6">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Dịch vụ Tư vấn</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Lựa chọn dịch vụ phù hợp với nhu cầu của bạn
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {consultationServices.map((service) => (
            <div 
              key={service.id}
              className={`bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl ${
                selectedService === service.id ? 'ring-2 ring-yellow-400 bg-white/25' : ''
              }`}
              onClick={() => setSelectedService(service.id)}
            >
              <div className="text-yellow-400 mb-4">{service.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-blue-100 mb-4">{service.description}</p>
              <div className="text-yellow-300 font-bold text-xl mb-2">{service.price}</div>
              <div className="text-blue-200 mb-4 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {service.duration}
              </div>
              <ul className="space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="text-blue-100 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default ServicesSection;
