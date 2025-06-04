import { Clock, CheckCircle } from 'lucide-react';

const PackagesSection = ({ packages }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Gói dịch vụ đánh giá
      </h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        Chọn gói dịch vụ phù hợp với nhu cầu và ngân sách của bạn
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className={`relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden ${
            pkg.popular ? 'ring-4 ring-red-500 transform scale-105' : ''
          }`}
        >
          {pkg.popular && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold">
              Phổ biến nhất
            </div>
          )}

          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-red-600">{pkg.price.toLocaleString()}</span>
              <span className="text-gray-600 text-lg">đ</span>
            </div>
            <div className="flex items-center mb-6">
              <Clock className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-600">Hoàn thành trong {pkg.duration}</span>
            </div>

            <ul className="space-y-4 mb-8">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full font-bold py-4 px-6 rounded-full transition-all duration-300 ${
                pkg.popular
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white'
                  : 'border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
              }`}
            >
              Chọn gói này
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default PackagesSection;
