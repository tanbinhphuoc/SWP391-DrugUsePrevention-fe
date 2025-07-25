import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, ClipboardCheck, CalendarClock, Users, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState([]);
  const [pageTransition, setPageTransition] = useState({ isTransitioning: false, direction: '', targetRoute: '' });
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const navigate = useNavigate();


  const services = [
{
  icon: <BookOpen className="h-8 w-8 text-emerald-600" />,
  title: 'Các Khóa học Giáo dục',
  description: 'Các khóa học phù hợp với lứa tuổi về nhận thức về ma túy, kỹ năng phòng ngừa và kỹ thuật từ chối cho học sinh, phụ huynh, giáo viên và thành viên cộng đồng.',
  features: ['Thiết kế theo nhóm tuổi', 'Học trực tuyến', 'Module tương tác', 'Chứng chỉ hoàn thành'],
  cta: 'Duyệt Khóa học',
  route: '/education-courses',
  gradient: 'from-emerald-400 to-teal-500',
  bgGradient: 'from-emerald-50 to-teal-50',
  shadowColor: 'shadow-emerald-200',
  iconBg: 'bg-emerald-100'
},
{
  icon: <ClipboardCheck className="h-8 w-8 text-sky-600" />,
  title: 'Đánh giá Rủi ro',
  description: 'Thực hiện các bảng câu hỏi dựa trên nghiên cứu như ASSIST và CRAFFT để đánh giá mức độ rủi ro sử dụng chất gây nghiện và nhận các đề xuất cá nhân hóa.',
  features: ['Sàng lọc bảo mật', 'Kết quả tức thì', 'Kế hoạch hành động tùy chỉnh', 'Tài nguyên hỗ trợ theo dõi'],
  cta: 'Thực hiện Đánh giá',
  route: '/risk-assessment',
  gradient: 'from-sky-400 to-blue-500',
  bgGradient: 'from-sky-50 to-blue-50',
  shadowColor: 'shadow-sky-200',
  iconBg: 'bg-sky-100'
},
{
  icon: <CalendarClock className="h-8 w-8 text-indigo-600" />,
  title: 'Dịch vụ Tư vấn',
  description: 'Đặt lịch hẹn trực tuyến với các chuyên gia và cố vấn phòng ngừa đủ điều kiện để nhận được hướng dẫn và hỗ trợ cá nhân hóa.',
  features: ['Tư vấn ảo', 'Lịch hẹn linh hoạt', 'Chuyên gia cố vấn', 'Hỗ trợ liên tục'],
  cta: 'Đặt lịch hẹn',
  route: '/consultation',
  gradient: 'from-indigo-400 to-purple-500',
  bgGradient: 'from-indigo-50 to-purple-50',
  shadowColor: 'shadow-indigo-200',
  iconBg: 'bg-indigo-100'
},
    {
  icon: <Users className="h-8 w-8 text-purple-600" />,
  title: 'Chương trình Cộng đồng(chức năng sắp tới)',
  description: 'Tham gia các chiến dịch nâng cao nhận thức, hội thảo và sự kiện giáo dục được thiết kế để tăng cường kiến thức và khả năng phục hồi của cộng đồng chống lại việc lạm dụng chất gây nghiện.',
  features: ['Sự kiện địa phương', 'Cơ hội tình nguyện', 'Đo lường tác động', 'Chia sẻ tài nguyên'],
  upcomingFeatures: ['Diễn đàn trực tuyến', 'Chương trình cố vấn', 'Hợp tác với các trường học địa phương'], // Đã thêm dòng này
  cta: 'Khám phá Chương trình',
  route: '/community-programs',
  gradient: 'from-purple-400 to-pink-500',
  bgGradient: 'from-purple-50 to-pink-50',
  shadowColor: 'shadow-purple-200',
  iconBg: 'bg-purple-100',
}
  ];

  const handleServiceNavigation = (route) => {
    setPageTransition({ isTransitioning: true, direction: 'out', targetRoute: route });
    
    // Simulate page transition
    setTimeout(() => {
      window.scrollTo(0, 0)
      navigate(route);
    }, 800);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === sectionRef.current) {
              setIsVisible(true);
            } else {
              const cardIndex = cardRefs.current.indexOf(entry.target);
              if (cardIndex !== -1) {
                setTimeout(() => {
                  setVisibleCards(prev => [...prev, cardIndex]);
                }, cardIndex * 200);
              }
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        />
      ))}
    </div>
  );

  const PageTransitionOverlay = () => (
    <div className={`fixed inset-0 z-50 pointer-events-none transition-all duration-800 ${
      pageTransition.isTransitioning ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Sliding curtain effect */}
      <div className={`absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 transform transition-transform duration-800 ease-in-out ${
        pageTransition.direction === 'out' 
          ? 'translate-x-0' 
          : pageTransition.direction === 'in' 
            ? '-translate-x-full' 
            : 'translate-x-full'
      }`}></div>
      
      {/* Geometric patterns */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
        pageTransition.direction === 'out' ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="relative">
          {/* Spinning circles */}
          <div className="w-32 h-32 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <div className="absolute inset-4 w-24 h-24 border-4 border-white/20 border-b-white rounded-full animate-spin animate-reverse"></div>
          <div className="absolute inset-8 w-16 h-16 border-4 border-white/10 border-l-white rounded-full animate-spin"></div>
          
          {/* Central icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-white animate-pulse" />
          </div>
        </div>
        
        {/* Loading text */}
        <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2">
          <p className="text-white text-lg font-semibold animate-pulse">
            Loading {pageTransition.targetRoute.replace('/', '').replace('-', ' ')}...
          </p>
        </div>
      </div>
      
      {/* Particle burst effect */}
      <div className={`absolute inset-0 transition-all duration-300 ${
        pageTransition.direction === 'out' ? 'opacity-100' : 'opacity-0'
      }`}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className={`relative py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden transition-all duration-800 ${
        pageTransition.isTransitioning && pageTransition.direction === 'out' 
          ? 'scale-95 blur-sm' 
          : 'scale-100 blur-0'
      }`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <FloatingParticles />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={sectionRef}>
          {/* Header with advanced animations */}
          <div className="text-center mb-16">
            <div className={`transition-all duration-1000 transform ${
              isVisible 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-10 opacity-0'
            }`}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
                <Sparkles className="h-8 w-8 text-white animate-pulse" />
              </div>
              
              <h2 className={`text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 transition-all duration-1000 delay-300 transform ${
                isVisible 
                  ? 'scale-100 opacity-100' 
                  : 'scale-95 opacity-0'
              }`}>
                Dịch vụ của Chúng tôi
              </h2>
              
              <div className={`w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6 rounded-full transition-all duration-1000 delay-500 transform ${
                isVisible 
                  ? 'scale-100 opacity-100' 
                  : 'scale-0 opacity-0'
              }`}></div>
              
              <p className={`max-w-4xl mx-auto text-xl text-gray-700 leading-relaxed transition-all duration-1000 delay-700 transform ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-5 opacity-0'
              }`}>
                Tài nguyên và hỗ trợ toàn diện để ngăn chặn lạm dụng chất gây nghiện và thúc đẩy các cộng đồng khỏe mạnh hơn.
              </p>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                ref={(el) => cardRefs.current[index] = el}
                className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 border border-white/50 ${
                  visibleCards.includes(index)
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-10 opacity-0'
                } ${
                  pageTransition.isTransitioning && pageTransition.direction === 'out'
                    ? 'scale-95 opacity-50'
                    : 'scale-100 opacity-100'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                {/* Gradient Border Animation */}
                <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`}></div>
                <div className="relative bg-white m-0.5 rounded-2xl">
                  
                  {/* Top Gradient Bar */}
                  <div className={`h-2 bg-gradient-to-r ${service.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                  
                  <div className={`p-8 bg-gradient-to-br ${service.bgGradient}`}>
                    {/* Icon with advanced styling */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${service.iconBg} rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${service.shadowColor} shadow-lg`}>
                      {service.icon}
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-gray-800 group-hover:to-gray-600 transition-all duration-300">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <ul className="mb-8 space-y-3">
                      {service.features.map((feature, idx) => (
                        <li 
                          key={idx} 
                          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
                          style={{
                            animationDelay: `${visibleCards.includes(index) ? idx * 100 : 0}ms`
                          }}
                        >
                          <span className="mr-3 text-emerald-500 font-bold text-lg">✓</span> 
                          <span className="transform hover:translate-x-1 transition-transform duration-200">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <button 
                      onClick={() => handleServiceNavigation(service.route)}
                      disabled={pageTransition.isTransitioning}
                      className={`group/btn inline-flex items-center px-6 py-3 bg-gradient-to-r ${service.gradient} text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 hover:from-opacity-90 hover:to-opacity-90 cursor-pointer relative overflow-hidden ${
                        pageTransition.isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {/* Button hover effect */}
                      <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
                      
                      <span className="relative mr-2">{service.cta}</span>
                      <ArrowRight className="relative h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      
                      {/* Ripple effect */}
                      <div className="absolute inset-0 rounded-xl opacity-0 group-active/btn:opacity-100 transition-opacity duration-150">
                        <div className="absolute inset-0 bg-white/30 rounded-xl animate-ping"></div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/30 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          .animate-reverse {
            animation-direction: reverse;
          }
        `}</style>
      </div>

      {/* Page Transition Overlay */}
      <PageTransitionOverlay />
    </>
  );
};

export default Services;