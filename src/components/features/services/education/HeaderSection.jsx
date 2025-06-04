import { BookOpen } from 'lucide-react';

const HeaderSection = () => (
  <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
    <div className="absolute inset-0 bg-black opacity-20" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
        <BookOpen className="h-5 w-5 mr-2" />
        <span className="text-sm font-medium">Giáo dục Phòng chống Ma túy</span>
      </div>
      <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        Khóa học <br />
        <span className="text-yellow-400">Giáo dục</span> Chuyên nghiệp
      </h1>
      <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
        Nâng cao kiến thức và kỹ năng phòng chống ma túy thông qua các khóa học chất lượng cao
      </p>
      <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
        Khám phá ngay
      </button>
    </div>
  </div>
);

export default HeaderSection;
