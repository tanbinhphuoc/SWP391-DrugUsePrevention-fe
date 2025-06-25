// File: components/EducationCourses/Results.jsx
import React from 'react';
import { Trophy, BarChart3, TrendingUp, Target, RotateCcw, Award } from 'lucide-react';
import Breadcrumb from './Breadcrumb';

const Results = ({
  currentStep,
  preSurveyScore,
  postSurveyScore,
  selectedCourse,
  courseProgress,
  onRestart
}) => {
  const improvement = preSurveyScore - postSurveyScore;
  const completedLessons = Object.keys(courseProgress).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Breadcrumb currentStep={currentStep} />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <Trophy className="h-16 w-16 text-white" />
            </div>

            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Chúc Mừng Bạn Đã Hoàn Thành!
            </h2>

            <p className="text-xl text-gray-600 mb-8">
              Bạn đã học xong khóa học "{selectedCourse?.title}" và hoàn thành đánh giá sau học.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-blue-50 rounded-2xl p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Điểm Trước</h3>
                <p className="text-3xl font-bold text-blue-600">{preSurveyScore}</p>
              </div>

              <div className="bg-green-50 rounded-2xl p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Điểm Sau</h3>
                <p className="text-3xl font-bold text-green-600">{postSurveyScore}</p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Cải Thiện</h3>
                <p className={`text-3xl font-bold ${improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {improvement >= 0 ? '+' : ''}{improvement}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Thống Kê Học Tập</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{completedLessons}</p>
                  <p className="text-gray-600">Bài học hoàn thành</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{selectedCourse?.duration}</p>
                  <p className="text-gray-600">Thời gian học</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Đánh Giá Kết Quả</h3>
              <div className={`p-6 rounded-2xl ${
                improvement > 0 ? 'bg-green-50 border border-green-200' :
                improvement === 0 ? 'bg-yellow-50 border border-yellow-200' :
                'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-lg ${
                  improvement > 0 ? 'text-green-700' :
                  improvement === 0 ? 'text-yellow-700' :
                  'text-red-700'
                }`}>
                  {improvement > 0 &&
                    `Tuyệt vời! Bạn đã có tiến bộ rõ rệt với ${improvement} điểm cải thiện. Kiến thức về phòng chống tệ nạn xã hội của bạn đã được nâng cao đáng kể.`}
                  {improvement === 0 &&
                    "Bạn đã duy trì được mức độ hiểu biết ổn định. Hãy tiếp tục áp dụng những kiến thức đã học vào thực tế."}
                  {improvement < 0 &&
                    "Có vẻ như bạn cần ôn tập lại một số nội dung. Đừng lo lắng, hãy xem lại các bài học hoặc tham gia tư vấn thêm."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={onRestart}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Học Khóa Khác
              </button>

              <button
                onClick={() => window.open('/certificate', '_blank')}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <Award className="h-5 w-5 mr-2" />
                Tải Chứng Chỉ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
