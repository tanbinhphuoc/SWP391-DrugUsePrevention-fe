import React, { useState, useEffect, useRef } from 'react';
import { Quote } from 'lucide-react';

const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const testimonials = [
    {
      quote: "The educational courses provided valuable insights that helped me talk to my teenage children about drugs in an informative, non-judgmental way.",
      name: "Rebecca Chen",
      role: "Parent",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      quote: "The risk assessment tools gave me a clear understanding of potential issues and connected me with resources I wouldn't have found otherwise.",
      name: "Marcus Johnson",
      role: "Community Leader",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      quote: "As a teacher, the specialized training has equipped me with strategies to recognize warning signs and support students who might be at risk.",
      name: "Sophia Rivera",
      role: "High School Teacher",
      image: "https://images.pexels.com/photos/762080/pexels-photo-762080.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '50px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={sectionRef}
      className="relative py-20 overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 198, 255, 0.2) 0%, transparent 50%),
          linear-gradient(135deg, #1e3a8a 0%, #1e40af 25%, #2563eb 50%, #3b82f6 75%, #60a5fa 100%)
        `
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyan-300 rounded-full opacity-80 animate-bounce" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-70 animate-bounce" style={{animationDelay: '5s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center mb-16">
          <h2 
            className={`text-4xl md:text-5xl font-bold mb-6 text-white transition-all duration-1000 ${
              isVisible 
                ? 'transform translate-y-0 opacity-100 scale-100' 
                : 'transform translate-y-8 opacity-0 scale-95'
            }`}
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              background: 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 50%, #b3e5fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Success Stories
          </h2>
          
          <div 
            className={`w-32 h-1.5 mx-auto mb-8 transition-all duration-1000 delay-300 ${
              isVisible 
                ? 'transform scale-x-100 opacity-100' 
                : 'transform scale-x-0 opacity-0'
            }`}
            style={{
              background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)'
            }}
          ></div>
          
          <p 
            className={`max-w-3xl mx-auto text-xl text-blue-100 transition-all duration-1000 delay-500 ${
              isVisible 
                ? 'transform translate-y-0 opacity-100' 
                : 'transform translate-y-4 opacity-0'
            }`}
          >
            Hear from those who have benefited from our programs and services.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`group relative transition-all duration-700 ${
                isVisible 
                  ? 'transform translate-y-0 opacity-100' 
                  : 'transform translate-y-12 opacity-0'
              }`}
              style={{
                transitionDelay: `${800 + index * 200}ms`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 shadow-xl hover:shadow-2xl border border-white/20 hover:border-white/30 group-hover:transform group-hover:scale-105">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
                
                <Quote className="h-10 w-10 text-cyan-300 mb-6 relative z-10 group-hover:text-cyan-200 transition-colors duration-300" />
                
                <p className="text-lg mb-8 text-blue-50 relative z-10 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center relative z-10">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover mr-4 shadow-lg ring-2 ring-white/20"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-400/20"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg">{testimonial.name}</h4>
                    <p className="text-blue-200 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div 
          className={`mt-20 text-center transition-all duration-1000 delay-1000 ${
            isVisible 
              ? 'transform translate-y-0 opacity-100' 
              : 'transform translate-y-8 opacity-0'
          }`}
        >
          <h3 
            className="text-3xl font-bold mb-6 text-white"
            style={{
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            Ready to Make a Difference?
          </h3>
          <p className="max-w-2xl mx-auto mb-10 text-blue-100 text-lg leading-relaxed">
            Join our community of volunteers, educators, and advocates committed to substance abuse prevention.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="group relative bg-white text-blue-800 hover:bg-blue-50 transition-all duration-300 px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:transform hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Join Our Effort</span>
            </button>
            <button className="group relative border-2 border-white text-white hover:bg-cyan-500/20 hover:border-cyan-300 transition-all duration-300 px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:transform hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Learn More</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;