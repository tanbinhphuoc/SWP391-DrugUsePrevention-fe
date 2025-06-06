import React from 'react';
import { ArrowRight } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Đăng ký & Tư vấn',
    description: 'Liên hệ với chuyên gia để được tư vấn phương pháp phù hợp'
  },
  {
    number: 2,
    title: 'Thu thập Thông tin',
    description: 'Thực hiện khảo sát và thu thập dữ liệu cần thiết'
  },
  {
    number: 3,
    title: 'Phân tích & Đánh giá',
    description: 'Chuyên gia phân tích dữ liệu và đưa ra đánh giá chính xác'
  },
  {
    number: 4,
    title: 'Báo cáo & Tư vấn',
    description: 'Nhận báo cáo chi tiết và kế hoạch phòng ngừa cụ thể'
  }
];

const ProcessStepsSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Quy trình Đánh giá</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Quy trình đánh giá rủi ro được thực hiện theo 4 bước chuẩn quốc tế
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative text-center group">
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-2xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessStepsSection;
