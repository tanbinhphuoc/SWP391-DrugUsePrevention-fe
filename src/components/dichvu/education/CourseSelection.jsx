import React from 'react';
import { Star, Clock, PlayCircle, Users, BarChart3 } from 'lucide-react';
import Breadcrumb from './Breadcrumb';

const CourseSelection = ({ availableCourses, recommendedCourse, score, onSelect }) => {
  const getScoreLabel = (score) => {
    if (score < 4) return 'Mức độ rủi ro thấp - Khóa học cơ bản phù hợp';
    if (score === 4) return 'Mức độ rủi ro trung bình - Nên học khóa chuyên sâu';
    return 'Mức độ rủi ro cao - Đã được tư vấn';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <Breadcrumb currentStep="course-selection" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Chọn Khóa Học Phù Hợp</h1>
            <p className="text-lg text-gray-600">
              {score < 4 ? 'Khóa học được đề xuất cho bạn' :
                score === 4 ? 'Bạn có thể chọn khóa học phù hợp hoặc khám phá thêm' :
                'Chọn khóa học bạn muốn học'}
            </p>

            {score !== null && (
              <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg max-w-md mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
                  <span className="text-2xl font-bold text-gray-800">Điểm khảo sát: {score}</span>
                </div>
                <div className="text-sm text-gray-600">{getScoreLabel(score)}</div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  {course.id === recommendedCourse?.id && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Đề xuất
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{course.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-emerald-600">{course.price}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-gray-600">{course.rating}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <PlayCircle className="h-4 w-4 mr-1" />
                      {course.lessons} bài
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelect(course)}
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {course.price === 'Miễn phí' ? 'Bắt Đầu Học' : 'Mua Khóa Học'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSelection;
