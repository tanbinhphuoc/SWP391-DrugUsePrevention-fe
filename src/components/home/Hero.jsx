import React from 'react';
import { useNavigate } from "react-router-dom";
import { Heart, Book, Calendar, FileCheck, ArrowRight, Megaphone } from 'lucide-react';

const FeatureCard = ({ icon, title, description }) => (
  <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-sky-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative z-10">
      <div className="bg-white/20 rounded-xl p-3 w-fit mb-4 group-hover:bg-emerald-400/30 transition-colors duration-300">
        {React.cloneElement(icon, { className: "w-6 h-6 text-white" })}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sky-100 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

const Hero = () => {

  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-600 via-sky-500 to-emerald-500 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-sky-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main hero content */}
        <div className="pt-20 pb-12 lg:pt-32 lg:pb-20">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left content */}
            <div className="lg:w-1/2 text-center lg:text-left space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-full px-6 py-3 border-2 border-red-400/30 shadow-lg animate-pulse">
                <Megaphone className="w-6 h-6 text-red-300 animate-bounce" />
                <span className="text-base font-bold text-red-200 tracking-wide">MA TÚY KHÔNG NÊN THỬ DÙ CHỈ 1 LẦN</span>
              </div>

              {/* Main heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight">
                <span className="block text-white">Chung tay </span>
                <span className="block">
                  <span className="text-emerald-300">vì </span>
                  <span className="text-white">cộng</span>
                </span>
                <span className="block text-emerald-300">đồng</span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-sky-100 max-w-2xl leading-relaxed">
                Phần mềm hỗ trợ phòng chống ma túy trong cộng đồng thông qua giáo dục, 
                đánh giá rủi ro và tư vấn chuyên nghiệp.
              </p>

              {/* CTA buttons */}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="group relative bg-white text-sky-700 font-semibold px-8 py-4 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                onClick={() => navigate("/UserCourses")}>
                  <span className="relative z-10 flex items-center gap-2">
                    Khám phá khóa học
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-white group-hover:opacity-0 transition-opacity duration-300"></div>
                </button>
                
                <button onClick={() => navigate("/UserSurveys")}
                 className="group relative border-2 border-white/60 text-white font-semibold px-8 py-4 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <span className="relative z-10 flex items-center gap-2">
                    Đánh giá rủi ro
                    <FileCheck className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-sky-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>

            {/* Right image */}
            <div className="lg:w-1/2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400/50 to-sky-400/50 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-2 border border-white/20">
                  <img
                    src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Community volunteers working together"
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom features */}
        <div className="pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <FeatureCard 
              icon={<Book />} 
              title="Giáo dục" 
              description="Khóa học phù hợp mọi lứa tuổi với nội dung chuyên sâu" 
            />
            <FeatureCard 
              icon={<FileCheck />} 
              title="Đánh giá" 
              description="Đánh giá rủi ro cá nhân hóa dựa trên khoa học" 
            />
            <FeatureCard 
              icon={<Calendar />} 
              title="Tư vấn" 
              description="Hướng dẫn chuyên môn từ các chuyên gia hàng đầu" 
            />
            <FeatureCard 
              icon={<Heart />} 
              title="Cộng đồng" 
              description="Mạng lưới hỗ trợ toàn diện và bền vững" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;