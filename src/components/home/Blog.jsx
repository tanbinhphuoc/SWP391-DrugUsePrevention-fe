import React, { useState, useEffect, useRef, use } from 'react';
import { Calendar, User, ArrowRight, Eye, Heart, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setAnimate(true), 200);
        }
      },
      { threshold: 0.2, rootMargin: '50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleNavigateToArticles = () => {
    setIsTransitioning(true);
    
    // Simulate page transition - in real app, replace with actual navigation
    setTimeout(() => {
      // navigate('/articles') - Replace this with your actual router navigation
      navigate('/articles');
      setIsTransitioning(false);
    }, 1500);
  };

  const articles = [
    {
      id: 1,
      title: 'Understanding the Warning Signs of Substance Abuse',
      excerpt: 'Learn to recognize early indicators of potential substance use problems and how to approach the situation with compassion.',
      image: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=800',
      date: 'May 15, 2025',
      author: 'Dr. Sarah Johnson',
      category: 'Education',
      color: 'bg-gradient-to-r from-indigo-500 to-purple-600',
      readTime: '5 min read',
      views: '2.4k',
      likes: 156
    },
    {
      id: 2,
      title: 'Talking to Teens About Drug Prevention: A Guide for Parents',
      excerpt: 'Effective strategies for parents to discuss substance abuse prevention with teenagers in a way that builds trust.',
      image: 'https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg?auto=compress&cs=tinysrgb&w=800',
      date: 'April 28, 2025',
      author: 'Michael Torres, LCSW',
      category: 'Parenting',
      color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      readTime: '7 min read',
      views: '3.1k',
      likes: 203
    },
    {
      id: 3,
      title: 'The Role of Community in Substance Abuse Prevention',
      excerpt: 'How community-based approaches can create protective environments and reduce substance abuse risks.',
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
      date: 'April 10, 2025',
      author: 'Lisa Chen, MPH',
      category: 'Community',
      color: 'bg-gradient-to-r from-amber-500 to-orange-600',
      readTime: '6 min read',
      views: '1.8k',
      likes: 124
    }
  ];

  return (
    <>
      {/* Page Transition Overlay */}
      <div className={`fixed inset-0 z-50 pointer-events-none transition-all duration-1000 ease-in-out ${
        isTransitioning 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-0'
      }`}>
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Animated Circles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/30 to-indigo-600/30 rounded-full blur-3xl animate-ping"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-full blur-3xl animate-ping" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-ping" style={{animationDelay: '1s'}}></div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            {/* Spinning Logo/Icon */}
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center animate-spin">
                <ArrowRight className="h-8 w-8 text-white" />
              </div>
            </div>
            
            {/* Loading Text */}
            <h3 className="text-3xl font-bold text-white mb-4 animate-pulse">
              Đang tải bài viết...
            </h3>
            <p className="text-blue-200 text-lg animate-pulse">
              Chuẩn bị nội dung mới nhất cho bạn
            </p>
            
            {/* Progress Bar */}
            <div className="mt-8 w-64 mx-auto">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse transform transition-transform duration-1500 scale-x-100"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide-in effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 transform transition-transform duration-1000 ease-in-out ${
          isTransitioning ? 'translate-x-0' : 'translate-x-full'
        }`}></div>
      </div>

      {/* Main Content */}
      <div ref={sectionRef} className={`relative py-20 bg-gradient-to-br from-slate-900 via-blue-900/80 to-indigo-900/60 overflow-hidden transition-all duration-1000 ${
        isTransitioning ? 'scale-95 opacity-50 blur-sm' : 'scale-100 opacity-100 blur-0'
      }`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/30 to-indigo-600/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-500/30 to-pink-600/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-600/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
          
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-1/4 w-4 h-4 bg-blue-400/30 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
          <div className="absolute bottom-32 right-1/4 w-6 h-6 bg-purple-400/30 rotate-45 animate-bounce" style={{animationDelay: '2s', animationDuration: '4s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-indigo-400/40 rounded-full animate-bounce" style={{animationDelay: '0.5s', animationDuration: '5s'}}></div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" 
               style={{
                 backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 1px, transparent 1px)',
                 backgroundSize: '50px 50px'
               }}>
          </div>
          
          {/* Dynamic light rays */}
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-blue-400/20 via-transparent to-purple-400/20 transform -translate-x-1/2 animate-pulse" style={{animationDuration: '6s'}}></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-indigo-400/20 via-transparent to-cyan-400/20 transform -translate-y-1/2 animate-pulse" style={{animationDelay: '3s', animationDuration: '8s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-16 transition-all duration-1200 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
            <div className="max-w-2xl mb-8 md:mb-0">
              <div className={`inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-full mb-4 shadow-lg transition-all duration-800 delay-200 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                TIN TỨC & BÀI VIẾT
              </div>
              <h2 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent mb-6 leading-tight transition-all duration-1000 delay-400 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
                Những Hiểu Biết Mới Nhất
                <br />
                <span className={`transition-all duration-1000 delay-600 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
                  Về Phòng Chống Ma Túy
                </span>
              </h2>
              <div className={`w-24 h-1.5 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 mb-6 rounded-full shadow-lg transition-all duration-800 delay-800 ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`} style={{transformOrigin: 'left'}}></div>
              <p className={`text-xl text-blue-100/90 leading-relaxed transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                Hướng dẫn chuyên môn, câu chuyện thực tế và nghiên cứu khoa học về nhận thức và phòng chống lạm dụng chất gây nghiện.
              </p>
            </div>
            <button
              onClick={handleNavigateToArticles}
              disabled={isTransitioning}
              className={`group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 delay-1200 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'} ${isTransitioning ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
          >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                {isTransitioning ? (
                  <>
                    Đang tải...
                    <div className="ml-3 w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </>
                ) : (
                  <>
                    Xem Tất Cả Bài Viết
                    <ArrowRight className="ml-3 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <div 
                key={article.id}
                className={`group relative bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/30 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{transitionDelay: `${1400 + (index * 200)}ms`}}
                onMouseEnter={() => setHoveredCard(article.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className={`absolute top-4 right-4 ${article.color} text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm`}>
                    {article.category}
                  </div>

                  {/* Floating Action Buttons */}
                  <div className={`absolute top-4 left-4 flex space-x-2 transition-all duration-300 ${hoveredCard === article.id ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Stats Overlay */}
                  <div className="absolute bottom-4 left-4 flex items-center space-x-4 text-white text-sm">
                    <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Eye className="h-4 w-4 mr-1" />
                      {article.views}
                    </div>
                    <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Heart className="h-4 w-4 mr-1" />
                      {article.likes}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  {/* Meta Information */}
                  <div className="flex justify-between items-center text-sm text-slate-500 mb-4">
                    <div className="flex items-center bg-slate-100 px-3 py-1 rounded-full">
                      <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                      <span className="font-medium">{article.date}</span>
                    </div>
                    <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {article.readTime}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-4 text-slate-800 leading-snug group-hover:text-blue-600 transition-colors duration-300">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {article.excerpt}
                  </p>

                  {/* Author and CTA */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                        {article.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-700">{article.author}</div>
                        <div className="text-xs text-slate-500">Chuyên gia</div>
                      </div>
                    </div>
                    
                    <button className="group/btn inline-flex items-center text-blue-600 hover:text-white bg-blue-50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 border border-blue-200 hover:border-transparent">
                      <span className="relative">Đọc Thêm</span>
                      <ArrowRight className="ml-2 h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Bottom CTA for Mobile */}
          <div className={`mt-16 text-center transition-all duration-1000 delay-2000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
             <button
              onClick={handleNavigateToArticles}
              disabled={isTransitioning}
              className={`md:hidden group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${isTransitioning ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                {isTransitioning ? (
                  <>
                    Đang tải...
                    <div className="ml-3 w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </>
                ) : (
                  <>
                    Xem Tất Cả Bài Viết
                    <ArrowRight className="ml-3 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Decorative Elements */}
          <div className={`absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-blue-400/30 to-indigo-600/40 rounded-full blur-xl animate-bounce transition-all duration-1000 delay-2200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} style={{animationDelay: '1s', animationDuration: '3s'}}></div>
          <div className={`absolute bottom-20 left-10 w-16 h-16 bg-gradient-to-br from-purple-400/30 to-pink-600/40 rounded-full blur-xl animate-bounce transition-all duration-1000 delay-2400 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} style={{animationDelay: '2s', animationDuration: '4s'}}></div>
        </div>
      </div>
    </>
  );
};

export default Blog;