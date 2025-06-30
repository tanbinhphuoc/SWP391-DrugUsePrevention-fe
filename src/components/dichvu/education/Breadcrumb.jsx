import React from 'react';
import { Home, ChevronRight } from 'lucide-react';

const Breadcrumb = ({ currentStep }) => {
  const steps = {
    'survey-start': 'Bắt đầu khảo sát',
    'pre-survey': 'Khảo sát đầu',
    'course-selection': 'Chọn khóa học',
    'course-learning': 'Học bài',
    'post-survey': 'Khảo sát sau',
    'results': 'Kết quả',
    'consultation-redirect': 'Tư vấn'
  };

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Home className="h-4 w-4 cursor-pointer text-blue-500 hover:text-blue-700" onClick={() => window.location.href = '/'} />
          <ChevronRight className="h-4 w-4" />
          <span>Khóa học giáo dục</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-blue-600 font-medium">{steps[currentStep]}</span>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
