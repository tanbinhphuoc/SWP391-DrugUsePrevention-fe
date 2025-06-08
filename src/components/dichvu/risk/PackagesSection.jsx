import React from 'react';
import { Clock, CheckCircle, Star } from 'lucide-react';

const packages = [
  {
    id: 'basic',
    name: 'Gói Cơ bản',
    price: '500.000',
    duration: '1-2 ngày',
    features: [
      'Khảo sát trực tuyến',
      'Báo cáo tự động',
      'Tư vấn qua email',
      'Hỗ trợ 8/5'
    ],
    popular: false
  },
  {
    id: 'standard',
    name: 'Gói Tiêu chuẩn',
    price: '1.200.000',
    duration: '3-5 ngày',
    features: [
      'Khảo sát chi tiết',
      'Phỏng vấn trực tiếp',
      'Báo cáo chuyên sâu',
      'Tư vấn 1-1',
      'Hỗ trợ 24/7'
    ],
    popular: true
  },
  {
    id: 'premium',
    name: 'Gói Cao cấp',
    price: '2.500.000',
    duration: '7-10 ngày',
    features: [
      'Đánh giá toàn diện',
      'Thử nghiệm tâm lý',
      'Báo cáo đa chiều',
      'Kế hoạch can thiệp',
      'Theo dõi dài hạn',
      'Hỗ trợ ưu tiên'
    ],
    popular: false
  }
];

const PackagesSection = ({ onSubmit }) => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Gói Dịch vụ</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Lựa chọn gói dịch vụ phù hợp với nhu cầu và ngân sách của bạn
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`relative bg-white/60 backdrop-blur-md rounded-2xl p-8 shadow-lg border transition-all duration-300 transform hover:scale-105 ${
              pkg.popular
                ? 'border-red-300 shadow-red-200/50 hover:shadow-2xl'
                : 'border-white/50 hover:shadow-xl'
            }`}>
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Phổ biến nhất
                  </div>
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  {pkg.price}<span className="text-lg font-normal text-gray-600">đ</span>
                </div>
                <div className="text-gray-600 flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {pkg.duration}
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  pkg.popular
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-lg'
                    : 'bg-gradient-to-r from-red-500 to-yellow-500 text-white hover:shadow-lg'
                }`}
                onClick={onSubmit}
              >
                Chọn gói này
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
