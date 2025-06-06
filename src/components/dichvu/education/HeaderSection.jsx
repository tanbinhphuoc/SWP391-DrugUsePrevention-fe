import { BookOpen } from 'lucide-react';

const HeaderSection = () => (
  <div className="relative pt-32 pb-20 text-center text-white">
    <div className="relative z-10 max-w-4xl mx-auto px-4">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
        Giáo dục Phòng chống Ma túy
      </h1>
      <p className="text-xl md:text-2xl opacity-90 mb-8 animate-fade-in-delay">
        Kiến thức và kỹ năng bảo vệ bản thân và cộng đồng
      </p>
      <button className="bg-white text-blue-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
        Bắt đầu học ngay
      </button>
    </div>
  </div>
);

export default HeaderSection;
