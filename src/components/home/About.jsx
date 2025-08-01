"use client"
import { Shield, Users, Heart, Sparkles, Star, ArrowRight, BookOpen, FileText } from "lucide-react"
import React from "react"

import { useState, useEffect, useRef } from "react"

const About = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeCard, setActiveCard] = useState(null)
  const [scrollAnimations, setScrollAnimations] = useState({
    title: false,
    subtitle: false,
    description: false,
    values: false,
    story: false,
    stats: false,
    cta: false,
  })

  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const descriptionRef = useRef(null)
  const valuesRef = useRef(null)
  const storyRef = useRef(null)
  const statsRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target

          if (target === sectionRef.current) {
            setIsVisible(true)
          }

          // Trigger animations with staggered delays
          if (target === titleRef.current) {
            setTimeout(() => setScrollAnimations((prev) => ({ ...prev, title: true })), 100)
          }
          if (target === subtitleRef.current) {
            setTimeout(() => setScrollAnimations((prev) => ({ ...prev, subtitle: true })), 300)
          }
          if (target === descriptionRef.current) {
            setTimeout(() => setScrollAnimations((prev) => ({ ...prev, description: true })), 500)
          }
          if (target === valuesRef.current) {
            setTimeout(() => setScrollAnimations((prev) => ({ ...prev, values: true })), 700)
          }
          if (target === storyRef.current) {
            setTimeout(() => setScrollAnimations((prev) => ({ ...prev, story: true })), 900)
          }
          if (target === statsRef.current) {
            setTimeout(() => setScrollAnimations((prev) => ({ ...prev, stats: true })), 1100)
          }
          if (target === ctaRef.current) {
            setTimeout(() => setScrollAnimations((prev) => ({ ...prev, cta: true })), 1300)
          }
        }
      })
    }, observerOptions)

    // Observe all elements
    const elements = [sectionRef, titleRef, subtitleRef, descriptionRef, valuesRef, storyRef, statsRef, ctaRef]
    elements.forEach((ref) => {
      if (ref.current) observer.observe(ref.current)
    })

    return () => observer.disconnect()
  }, [])

  const stats = [
    {
      number: "500+",
      label: "Người Được Hỗ Trợ",
      icon: <Heart className="h-6 w-6" />,
    },
    {
      number: "20+",
      label: "Chuyên Gia Tình Nguyện",
      icon: <Users className="h-6 w-6" />,
    },
    {
      number: "50+",
      label: "Khóa Học",
      icon: <BookOpen className="h-6 w-6" />,
    },
    {
      number: "20+",
      label: "Đối Tác Cộng Đồng",
      icon: <Sparkles className="h-6 w-6" />,
    },
  ]

  const values = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Giáo Dục",
      description:
        "Khóa học phù hợp mọi lứa tuổi với nội dung chuyên sâu về phòng chống tệ nạn xã hội và xây dựng lối sống tích cực.",
      bgIcon: <BookOpen className="h-12 w-12" />,
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Đánh Giá",
      description:
        "Đánh giá rủi ro cá nhân hóa dựa trên khoa học để xác định mức độ nguy cơ và đưa ra lộ trình phù hợp.",
      bgIcon: <FileText className="h-12 w-12" />,
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Tư Vấn",
      description: "Hướng dẫn chuyên môn từ các chuyên gia hàng đầu với phương pháp tư vấn cá nhân hóa và hiệu quả.",
      bgIcon: <Users className="h-12 w-12" />,
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Cộng Đồng",
      description:
        "Mạng lưới hỗ trợ toàn diện với sự tham gia tích cực của cộng đồng trong việc phòng chống tệ nạn xã hội.",
      bgIcon: <Heart className="h-12 w-12" />,
    },
  ]

  return (
    <div
      ref={sectionRef}
      id="about"
      className="scroll-smooth min-h-screen bg-gradient-to-br from-sky-600 via-sky-500 to-emerald-500 text-white relative overflow-hidden"
    >
      {/* Animated background elements - matching Hero component */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-sky-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Gradient overlay - matching Hero component */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>

      {/* Enhanced floating particles */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            {i % 3 === 0 ? (
              <Star className="h-2 w-2 text-white/40" />
            ) : i % 3 === 1 ? (
              <div className="w-1 h-1 bg-white/30 rounded-full"></div>
            ) : (
              <div className="w-2 h-2 bg-white/20 rounded-full"></div>
            )}
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div
            className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full shadow-lg mb-8 transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <Shield className="h-5 w-5 text-white" />
            <span className="text-white font-semibold">PreventionSupport</span>
          </div>

          {/* Main Title matching website style */}
          <div
            ref={titleRef}
            className={`transform transition-all duration-1500 ease-out ${
              scrollAnimations.title ? "scale-100 opacity-100 translate-y-0" : "scale-75 opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">Chung tay</h1>
          </div>

          {/* Subtitle with emerald accent - matching Hero */}
          <div
            ref={subtitleRef}
            className={`transform transition-all duration-1500 ease-out delay-300 ${
              scrollAnimations.subtitle ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-6"
            }`}
          >
            <span className="text-3xl md:text-5xl lg:text-6xl font-extrabold">
              <span className="text-emerald-300">vì </span>
              <span className="text-white">cộng</span>
            </span>
            <br />
            <span className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-emerald-300">đồng</span>
          </div>

          {/* Description */}
          <div
            ref={descriptionRef}
            className={`transform transition-all duration-1500 ease-out delay-500 ${
              scrollAnimations.description ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="max-w-4xl mx-auto text-lg md:text-xl text-sky-100 leading-relaxed mt-8 font-medium">
              Phần mềm hỗ trợ phòng chống ma túy trong cộng đồng thông qua giáo dục, đánh giá rủi ro và tư vấn chuyên
              nghiệp.
            </p>
          </div>

          <div
            className={`flex justify-center mt-8 transform transition-all duration-1000 delay-700 ${scrollAnimations.description ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
          >
            <div className="w-24 h-1 bg-white/40 rounded-full shadow-lg animate-pulse"></div>
          </div>
        </div>

        {/* Values Grid matching website services */}
        <div ref={valuesRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {values.map((item, idx) => (
            <div
              key={idx}
              className={`group relative transform transition-all duration-1000 hover:scale-105 ${
                scrollAnimations.values ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-95"
              }`}
              style={{ transitionDelay: `${idx * 150 + 200}ms` }}
              onMouseEnter={() => setActiveCard(idx)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-sky-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Background icon */}
                <div className="absolute -top-6 -right-6 text-white/5 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
                  {item.bgIcon}
                </div>

                <div className="relative z-10">
                  <div className="bg-white/20 rounded-xl p-3 w-fit mb-4 group-hover:bg-emerald-400/30 transition-colors duration-300">
                    {React.cloneElement(item.icon, { className: "w-6 h-6 text-white" })}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>

                  <p className="text-sky-100 text-sm leading-relaxed">{item.description}</p>

                  <div className="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowRight className="h-5 w-5 text-emerald-200 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div
          ref={storyRef}
          className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 mb-16 transform transition-all duration-1500 ${
            scrollAnimations.story ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-sky-500/20 backdrop-blur-sm border border-emerald-400/20 px-4 py-2 rounded-full mb-6">
                <Heart className="h-4 w-4 text-emerald-300" />
                <span className="text-emerald-100 font-medium text-sm">Câu Chuyện Của Chúng Tôi</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Hành Trình Phát Triển</h2>

              <div className="space-y-6 text-sky-100 leading-relaxed">
                <p className="transform transition-all duration-1000 delay-300 opacity-0 translate-y-4 animate-fade-in-up">
                  Được thành lập vào năm 2025 bởi một nhóm các chuyên gia y tế và lãnh đạo cộng đồng tận tâm,
                  PreventionSupport đã phát triển từ một ý tưởng đơn giản thành một nền tảng công nghệ toàn diện về giáo
                  dục phòng chống ma túy.
                </p>

                <p className="transform transition-all duration-1000 delay-500 opacity-0 translate-y-4 animate-fade-in-up">
                  Hiện nay, chúng tôi hợp tác với các trường học, trung tâm cộng đồng và các nhà cung cấp dịch vụ y tế
                  để triển khai các chương trình tiếp cận mọi lứa tuổi và hoàn cảnh thông qua công nghệ hiện đại.
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div ref={statsRef} className="grid grid-cols-2 gap-6">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`group relative bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-700 hover:scale-105 text-center overflow-hidden border border-white/20 hover:bg-white/20 ${
                    scrollAnimations.stats ? "scale-100 opacity-100 translate-y-0" : "scale-75 opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  {/* Hover gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-sky-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative z-10">
                    <div className="bg-white/20 rounded-xl p-3 w-fit mx-auto mb-3 group-hover:bg-emerald-400/30 transition-colors duration-300">
                      {React.cloneElement(stat.icon, { className: "w-6 h-6 text-white" })}
                    </div>

                    <div className="text-3xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                      {stat.number}
                    </div>

                    <div className="text-sky-100 text-sm font-medium">{stat.label}</div>
                  </div>

                  {/* Floating particles */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
                  <div className="absolute bottom-3 left-3 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div
          ref={ctaRef}
          className={`text-center transform transition-all duration-1500 ${
            scrollAnimations.cta ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-8"
          }`}
        >
          <div className="group relative bg-white text-sky-700 font-semibold px-8 py-4 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl inline-flex items-center gap-3 cursor-pointer">
            <span className="relative z-10 flex items-center gap-2">
              Khám Phá Khóa Học
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-white group-hover:opacity-0 transition-opacity duration-300"></div>
          </div>

          <p className="text-sky-100 text-sm mt-4 font-medium">
            Tham gia cùng chúng tôi trong việc xây dựng cộng đồng khỏe mạnh
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default About
