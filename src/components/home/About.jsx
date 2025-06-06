import React from 'react';
import { Shield, Award, Users, Leaf, Heart, Sparkles, Star, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [scrollAnimations, setScrollAnimations] = useState({
    title: false,
    subtitle: false,
    description: false,
    values: false,
    story: false,
    stats: false,
    cta: false
  });

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const valuesRef = useRef(null);
  const storyRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          
          if (target === sectionRef.current) {
            setIsVisible(true);
          }
          
          // Trigger animations with staggered delays
          if (target === titleRef.current) {
            setTimeout(() => setScrollAnimations(prev => ({ ...prev, title: true })), 100);
          }
          if (target === subtitleRef.current) {
            setTimeout(() => setScrollAnimations(prev => ({ ...prev, subtitle: true })), 300);
          }
          if (target === descriptionRef.current) {
            setTimeout(() => setScrollAnimations(prev => ({ ...prev, description: true })), 500);
          }
          if (target === valuesRef.current) {
            setTimeout(() => setScrollAnimations(prev => ({ ...prev, values: true })), 700);
          }
          if (target === storyRef.current) {
            setTimeout(() => setScrollAnimations(prev => ({ ...prev, story: true })), 900);
          }
          if (target === statsRef.current) {
            setTimeout(() => setScrollAnimations(prev => ({ ...prev, stats: true })), 1100);
          }
          if (target === ctaRef.current) {
            setTimeout(() => setScrollAnimations(prev => ({ ...prev, cta: true })), 1300);
          }
        }
      });
    }, observerOptions);

    // Observe all elements
    const elements = [sectionRef, titleRef, subtitleRef, descriptionRef, valuesRef, storyRef, statsRef, ctaRef];
    elements.forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const stats = [
    { number: "5000+", label: "Người Được Hỗ Trợ", icon: <Heart className="h-6 w-6" />, color: "from-pink-500 to-rose-500" },
    { number: "200+", label: "Chuyên Gia Tình Nguyện", icon: <Users className="h-6 w-6" />, color: "from-blue-500 to-cyan-500" },
    { number: "50+", label: "Khóa Học", icon: <Leaf className="h-6 w-6" />, color: "from-green-500 to-emerald-500" },
    { number: "20+", label: "Đối Tác Cộng Đồng", icon: <Sparkles className="h-6 w-6" />, color: "from-purple-500 to-violet-500" },
  ];

  const values = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Sứ Mệnh",
      description: "Giảm thiểu tác hại của ma túy thông qua các chương trình phòng ngừa dựa trên bằng chứng khoa học và thực tiễn.",
      gradient: "from-blue-600 to-blue-800"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Giá Trị",
      description: "Lòng trắc ẩn, chính trực, giáo dục và trao quyền là những nguyên tắc cốt lõi định hướng mọi hoạt động.",
      gradient: "from-emerald-600 to-emerald-800"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Tác Động",
      description: "Đã giúp hàng nghìn cá nhân và gia đình xây dựng kỹ năng phòng chống ma túy hiệu quả.",
      gradient: "from-purple-600 to-purple-800"
    },
  ];

  return (
    <div 
      ref={sectionRef}
      id="about" 
      className="scroll-smooth min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden"
    >
      {/* Animated geometric background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large glowing orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-500/25 to-pink-500/25 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full filter blur-3xl animate-pulse delay-500"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Animated waves */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path 
              d="M0,60 C300,20 600,100 900,60 C1050,30 1150,80 1200,60 L1200,120 L0,120 Z" 
              fill="url(#wave-gradient)" 
              className="animate-wave"
            />
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
                <stop offset="50%" stopColor="rgba(147, 51, 234, 0.1)" />
                <stop offset="100%" stopColor="rgba(236, 72, 153, 0.1)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/5 w-4 h-4 bg-blue-400/30 rotate-45 animate-spin-slow"></div>
        <div className="absolute top-3/4 right-1/3 w-6 h-6 bg-purple-400/20 rounded-full animate-bounce-slow"></div>
        <div className="absolute top-1/2 left-3/4 w-3 h-8 bg-cyan-400/25 animate-pulse"></div>
      </div>

      {/* Enhanced floating particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            {i % 3 === 0 ? (
              <Star className="h-2 w-2 text-cyan-300/60" />
            ) : i % 3 === 1 ? (
              <div className="w-1 h-1 bg-blue-400/50 rounded-full"></div>
            ) : (
              <div className="w-2 h-2 bg-purple-400/40 rounded-full"></div>
            )}
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full shadow-lg mb-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Sparkles className="h-5 w-5 text-cyan-400" />
            <span className="text-white font-medium">Về Chúng Tôi</span>
          </div>
          
          {/* Main Title with Zoom-In Effect */}
          <div 
            ref={titleRef}
            className={`transform transition-all duration-1500 ease-out ${
              scrollAnimations.title 
                ? 'scale-100 opacity-100 translate-y-0' 
                : 'scale-75 opacity-0 translate-y-8'
            }`}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 leading-tight animate-text-shimmer">
              Phòng Chống Ma Túy
            </h1>
          </div>

          {/* Subtitle with Slide-Up Effect */}
          <div 
            ref={subtitleRef}
            className={`transform transition-all duration-1500 ease-out delay-300 ${
              scrollAnimations.subtitle 
                ? 'scale-100 opacity-100 translate-y-0' 
                : 'scale-90 opacity-0 translate-y-6'
            }`}
          >
            <span className="text-3xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-text-shimmer">
              Cùng Cộng Đồng
            </span>
          </div>
          
          {/* Description with Fade-In Effect */}
          <div 
            ref={descriptionRef}
            className={`transform transition-all duration-1500 ease-out delay-500 ${
              scrollAnimations.description 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-200 leading-relaxed mt-6">
              Chúng tôi là tổ chức tình nguyện tập trung vào phòng chống ma túy thông qua giáo dục, 
              gắn kết cộng đồng và dịch vụ hỗ trợ cá nhân hóa.
            </p>
          </div>

          <div className={`flex justify-center mt-8 transform transition-all duration-1000 delay-700 ${scrollAnimations.description ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full shadow-lg shadow-cyan-500/25 animate-pulse"></div>
          </div>
        </div>

        {/* Values Grid with Staggered Animation */}
        <div 
          ref={valuesRef}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {values.map((item, idx) => (
            <div
              key={idx}
              className={`group relative transform transition-all duration-1000 hover:scale-105 ${
                scrollAnimations.values 
                  ? 'translate-y-0 opacity-100 scale-100' 
                  : 'translate-y-12 opacity-0 scale-95'
              }`}
              style={{ transitionDelay: `${idx * 200 + 200}ms` }}
              onMouseEnter={() => setActiveCard(idx)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className={`relative bg-gradient-to-br ${item.gradient} p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 backdrop-blur-sm overflow-hidden transform hover:rotate-1`}>
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Floating icon background */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <div className="text-white/20 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    {item.icon}
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center p-4 bg-white/20 rounded-2xl text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 animate-bounce-subtle">
                    {item.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-yellow-200 transition-colors duration-300">
                    {item.title}
                  </h3>
                  
                  <p className="text-white/90 leading-relaxed group-hover:text-white transition-colors duration-300">
                    {item.description}
                  </p>

                  <div className="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowRight className="h-5 w-5 text-yellow-300 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Story Section with Slide Animation */}
        <div 
          ref={storyRef}
          className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-8 md:p-12 mb-16 transform transition-all duration-1500 ${
            scrollAnimations.story 
              ? 'translate-x-0 opacity-100' 
              : '-translate-x-8 opacity-0'
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-400/20 px-4 py-2 rounded-full mb-6 animate-pulse">
                <Heart className="h-4 w-4 text-cyan-400" />
                <span className="text-cyan-100 font-medium text-sm">Câu Chuyện Của Chúng Tôi</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6 animate-text-shimmer">
                Hành Trình Phát Triển
              </h2>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p className="transform transition-all duration-1000 delay-300 opacity-0 translate-y-4 animate-fade-in-up">
                  Được thành lập vào năm 2025 bởi một nhóm các chuyên gia y tế và lãnh đạo cộng đồng tận tâm, 
                  tổ chức của chúng tôi đã phát triển từ một nhóm hỗ trợ địa phương thành một trung tâm 
                  tài nguyên toàn diện về giáo dục phòng chống ma túy.
                </p>
                
                <p className="transform transition-all duration-1000 delay-500 opacity-0 translate-y-4 animate-fade-in-up">
                  Hiện nay, chúng tôi hợp tác với các trường học, trung tâm cộng đồng và các nhà cung cấp 
                  dịch vụ y tế để triển khai các chương trình tiếp cận mọi lứa tuổi và hoàn cảnh.
                </p>
              </div>
            </div>

            {/* Stats Grid with Pop Animation */}
            <div 
              ref={statsRef}
              className="grid grid-cols-2 gap-6"
            >
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`group relative bg-gradient-to-br ${stat.color} p-6 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-700 hover:scale-105 text-center overflow-hidden ${
                    scrollAnimations.stats 
                      ? 'scale-100 opacity-100 translate-y-0' 
                      : 'scale-75 opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-xl text-white mb-3 group-hover:scale-110 transition-transform duration-300 animate-bounce-subtle">
                      {stat.icon}
                    </div>
                    
                    <div className="text-3xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300 animate-number-count">
                      {stat.number}
                    </div>
                    
                    <div className="text-white/90 text-sm font-medium">
                      {stat.label}
                    </div>
                  </div>

                  {/* Floating particles */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
                  <div className="absolute bottom-3 left-3 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action with Zoom Effect */}
        <div 
          ref={ctaRef}
          className={`text-center transform transition-all duration-1500 ${
            scrollAnimations.cta 
              ? 'scale-100 opacity-100 translate-y-0' 
              : 'scale-90 opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 cursor-pointer group animate-pulse-glow">
            <span className="font-semibold">Tham Gia Cùng Chúng Tôi</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes wave {
          0%, 100% { d: path("M0,60 C300,20 600,100 900,60 C1050,30 1150,80 1200,60 L1200,120 L0,120 Z"); }
          50% { d: path("M0,80 C300,40 600,120 900,80 C1050,50 1150,100 1200,80 L1200,120 L0,120 Z"); }
        }

        @keyframes textShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        @keyframes numberCount {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.3); }
          50% { box-shadow: 0 0 30px rgba(34, 211, 238, 0.5), 0 0 40px rgba(147, 51, 234, 0.3); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-wave {
          animation: wave 10s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce 4s ease-in-out infinite;
        }

        .animate-text-shimmer {
          background-size: 200% auto;
          animation: textShimmer 3s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }

        .animate-bounce-subtle {
          animation: bounceSubtle 3s ease-in-out infinite;
        }

        .animate-number-count {
          animation: numberCount 0.8s ease-out;
        }

        .animate-pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default About;