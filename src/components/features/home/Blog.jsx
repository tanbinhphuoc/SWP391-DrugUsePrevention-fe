import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, Eye, Heart, Share2 } from 'lucide-react';

const Blog = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

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
    <div className="relative py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-16 transition-all duration-1000 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="max-w-2xl mb-8 md:mb-0">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-full mb-4 shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              TIN TỨC & BÀI VIẾT
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent mb-6 leading-tight">
              Những Hiểu Biết Mới Nhất Về Phòng Chống Ma Túy
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 mb-6 rounded-full shadow-lg"></div>
            <p className="text-xl text-slate-600 leading-relaxed">
              Hướng dẫn chuyên môn, câu chuyện thực tế và nghiên cứu khoa học về nhận thức và phòng chống lạm dụng chất gây nghiện.
            </p>
          </div>
          <button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center">
              Xem Tất Cả Bài Viết
              <ArrowRight className="ml-3 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <div 
              key={article.id}
              className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{transitionDelay: `${index * 200}ms`}}
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
        <div className="mt-16 text-center">
          <button className="md:hidden group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center">
              Xem Tất Cả Bài Viết
              <ArrowRight className="ml-3 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-xl animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
        <div className="absolute bottom-20 left-10 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-xl animate-bounce" style={{animationDelay: '2s', animationDuration: '4s'}}></div>
      </div>
    </div>
  );
};

export default Blog;