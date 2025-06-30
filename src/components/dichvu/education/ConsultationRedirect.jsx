import React from 'react';
import { AlertCircle, User, Calendar } from 'lucide-react';
import Breadcrumb from './Breadcrumb';

const ConsultationRedirect = ({ onContinue, currentStep }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <Breadcrumb currentStep={currentStep} />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertCircle className="h-16 w-16 text-white" />
            </div>

            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Cần Tư Vấn Chuyên Sâu
            </h2>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Dựa trên kết quả khảo sát của bạn, chúng tôi khuyến nghị bạn nên trao đổi trực tiếp với chuyên gia tư vấn
              để được hỗ trợ phù hợp và hiệu quả nhất.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="bg-red-50 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <User className="h-8 w-8 text-red-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-800">Tư Vấn Cá Nhân</h3>
                </div>
                <p className="text-gray-600">Gặp gỡ trực tiếp với chuyên gia để được tư vấn riêng biệt</p>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <Calendar className="h-8 w-8 text-orange-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-800">Đặt Lịch Ngay</h3>
                </div>
                <p className="text-gray-600">Chọn thời gian phù hợp để được tư vấn chuyên nghiệp</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => window.open('/consultation', '_blank')}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Đặt Lịch Tư Vấn Ngay
              </button>

              <button
                onClick={onContinue}
                className="bg-gray-100 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-200 transition-all duration-300"
              >
                Tôi Đã Tư Vấn, Tiếp Tục Học
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationRedirect;