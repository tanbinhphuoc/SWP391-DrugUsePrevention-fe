import React from 'react';
import { BookOpen, PlayCircle } from 'lucide-react';

const HeaderSection = ({ handlePageTransition }) => (
  <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-8 shadow-2xl">
        <BookOpen className="h-10 w-10 text-white" />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
        Khóa học Giáo dục
      </h1>
      <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8 leading-relaxed">
        Chương trình giáo dục toàn diện về phòng chống tệ nạn xã hội,
        được thiết kế khoa học và phù hợp với từng đối tượng
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => handlePageTransition('/course-demo')}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
        >
          <PlayCircle className="w-5 h-5" />
          <span>Xem Demo</span>
        </button>
        <button
          onClick={() => handlePageTransition('/consultation')}
          className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30"
        >
          Tư vấn miễn phí
        </button>
      </div>
    </div>
  </section>
);

export default HeaderSection;