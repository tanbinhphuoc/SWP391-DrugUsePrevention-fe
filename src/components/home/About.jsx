import React from 'react';
import { Shield, Award, Users, Leaf, Heart, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="py-12 bg-gradient-to-b from-white to-sky-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-100 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 sm:w-56 sm:h-56"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-sky-100 rounded-full filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2 sm:w-80 sm:h-80"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-sky-800 mb-4">Về Chúng Tôi</h2>
          <div className="w-20 h-1 bg-emerald-400 mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-base text-sky-700">
            Chúng tôi là tổ chức tình nguyện tập trung vào phòng chống ma túy thông qua giáo dục,
            gắn kết cộng đồng và dịch vụ hỗ trợ cá nhân hóa.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: <Shield className="h-7 w-7" />,
              title: "Sứ Mệnh",
              description: "Giảm thiểu tác hại của ma túy thông qua các chương trình phòng ngừa dựa trên bằng chứng.",
            },
            {
              icon: <Award className="h-7 w-7" />,
              title: "Giá Trị",
              description: "Lòng trắc ẩn, chính trực, giáo dục và trao quyền là những nguyên tắc cốt lõi.",
            },
            {
              icon: <Users className="h-7 w-7" />,
              title: "Tác Động",
              description: "Đã giúp hàng nghìn cá nhân và gia đình xây dựng kỹ năng phòng chống ma túy.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group bg-gradient-to-br from-sky-700 to-sky-800 p-6 rounded-lg text-center transform transition-all duration-300 hover:scale-105 hover:from-sky-600 hover:to-sky-700 shadow-md hover:shadow-lg border border-sky-600/30 hover:border-emerald-400/50"
            >
              <div className="inline-flex items-center justify-center p-3 bg-emerald-400/20 rounded-full text-emerald-300 mb-4 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
              <p className="text-sky-100 text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-sky-700 to-sky-800 p-6 rounded-lg shadow-lg border border-sky-600/30">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="md:w-[55%] mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-4">Câu Chuyện Của Chúng Tôi</h3>
              <p className="text-sky-100 text-sm mb-4">
                Được thành lập vào năm 2025 bởi một nhóm các chuyên gia y tế và lãnh đạo cộng đồng tận tâm,
                tổ chức của chúng tôi đã phát triển từ một nhóm hỗ trợ địa phương thành một trung tâm
                tài nguyên toàn diện về giáo dục phòng chống ma túy.
              </p>
              <p className="text-sky-100 text-sm">
                Hiện nay, chúng tôi hợp tác với các trường học, trung tâm cộng đồng và các nhà cung cấp
                dịch vụ y tế để triển khai các chương trình tiếp cận mọi lứa tuổi và hoàn cảnh.
              </p>
            </div>
            <div className="md:w-[45%] grid grid-cols-2 gap-4">
              {[
                { number: "5000+", label: "Người Được Hỗ Trợ", icon: <Heart className="h-5 w-5" /> },
                { number: "200+", label: "Chuyên Gia Tình Nguyện", icon: <Users className="h-5 w-5" /> },
                { number: "50+", label: "Khóa Học", icon: <Leaf className="h-5 w-5" /> },
                { number: "20+", label: "Đối Tác Cộng Đồng", icon: <Sparkles className="h-5 w-5" /> },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-sky-600/30 p-4 rounded-lg text-center transform transition-all duration-300 hover:scale-105 hover:bg-sky-600/40 border border-sky-500/30 hover:border-emerald-400/30"
                >
                  <div className="text-emerald-300 mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sky-100 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;