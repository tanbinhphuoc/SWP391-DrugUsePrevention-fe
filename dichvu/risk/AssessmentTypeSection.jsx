import React from 'react';
import { Users, Home, Building, CheckCircle } from 'lucide-react';

const assessmentTypes = [
  {
    id: 'individual',
    title: 'Đánh giá Cá nhân',
    icon: Users,
    description: 'Đánh giá rủi ro cho từng cá nhân cụ thể',
    color: 'from-red-500 to-red-600',
    features: ['Khảo sát tâm lý', 'Phân tích hành vi', 'Báo cáo chi tiết', 'Tư vấn cá nhân hóa']
  },
  {
    id: 'family',
    title: 'Đánh giá Gia đình',
    icon: Home,
    description: 'Đánh giá môi trường và yếu tố nguy cơ trong gia đình',
    color: 'from-orange-500 to-orange-600',
    features: ['Môi trường gia đình', 'Quan hệ gia đình', 'Yếu tố bảo vệ', 'Kế hoạch phòng ngừa']
  },
  {
    id: 'community',
    title: 'Đánh giá Cộng đồng',
    icon: Building,
    description: 'Đánh giá rủi ro cho trường học, doanh nghiệp',
    color: 'from-yellow-500 to-yellow-600',
    features: ['Khảo sát môi trường', 'Phân tích dữ liệu', 'Báo cáo tổng hợp', 'Đề xuất giải pháp']
  }
];

const AssessmentTypesSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Các loại Đánh giá</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chúng tôi cung cấp nhiều hình thức đánh giá rủi ro phù hợp với nhu cầu khác nhau
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {assessmentTypes.map((type) => (
            <div key={type.id} className="group relative bg-white/60 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              <div className={`absolute inset-0 bg-gradient-to-r ${type.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${type.color} text-white mb-6`}>
                <type.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{type.title}</h3>
              <p className="text-gray-600 mb-6">{type.description}</p>
              <ul className="space-y-2">
                {type.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`mt-6 w-full bg-gradient-to-r ${type.color} text-white py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300`}>
                Tìm hiểu thêm
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AssessmentTypesSection;
