import React from 'react';
import { Play, ArrowRight, Clock, Target, Award, BarChart3 } from 'lucide-react';
import Breadcrumb from './Breadcrumb';

const SurveyStart = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
      <Breadcrumb currentStep="survey-start" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Chào mừng đến với <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">Khóa Học Giáo Dục</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Bắt đầu hành trình học tập của bạn với khảo sát đánh giá để chúng tôi có thể đề xuất khóa học phù hợp nhất
            </p>
          </div>

          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Khảo sát đánh giá</h2>
              <p className="text-lg text-gray-600 mb-8">
                Trả lời một số câu hỏi ngắn để chúng tôi hiểu rõ hơn về bạn và đề xuất nội dung học tập phù hợp
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="text-center p-6 bg-blue-50 rounded-2xl">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">5-10 phút</h3>
                <p className="text-sm text-gray-600">Thời gian hoàn thành</p>
              </div>
              <div className="text-center p-6 bg-emerald-50 rounded-2xl">
                <Target className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Cá nhân hóa</h3>
                <p className="text-sm text-gray-600">Nội dung phù hợp với bạn</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-2xl">
                <Award className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Chứng chỉ</h3>
                <p className="text-sm text-gray-600">Nhận chứng chỉ khi hoàn thành</p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={onStart}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Play className="h-5 w-5 mr-2" />
                Bắt đầu khảo sát
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyStart;
