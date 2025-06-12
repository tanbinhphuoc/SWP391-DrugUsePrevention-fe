import React from 'react';
import { Sparkles } from 'lucide-react';

const PageTransitionOverlay = ({ pageTransition }) => (
  <div className={`fixed inset-0 z-50 pointer-events-none transition-all duration-800 ${
    pageTransition.isTransitioning ? 'opacity-100' : 'opacity-0'
  }`}>
    <div className={`absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 transform transition-transform duration-800 ease-in-out ${
      pageTransition.direction === 'out'
        ? 'translate-x-0'
        : pageTransition.direction === 'in'
          ? '-translate-x-full'
          : 'translate-x-full'
    }`}>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-4 border-white/50 rotate-45 animate-spin"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 border-4 border-white/40 rotate-12 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 border-4 border-white/30 rotate-45 animate-bounce"></div>
      </div>
    </div>

    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
      pageTransition.direction === 'out' ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="relative">
        <div className="w-32 h-32 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        <div className="absolute inset-4 w-24 h-24 border-4 border-white/20 border-b-white rounded-full animate-spin animate-reverse"></div>
        <div className="absolute inset-8 w-16 h-16 border-4 border-white/10 border-l-white rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-white animate-pulse" />
        </div>
      </div>

      <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-white text-xl font-bold animate-pulse mb-2">Chuyển trang...</p>
        <div className="w-32 h-1 bg-white/30 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full animate-loading-bar"></div>
        </div>
      </div>
    </div>

    <div className={`absolute inset-0 transition-all duration-300 ${
      pageTransition.direction === 'out' ? 'opacity-100' : 'opacity-0'
    }`}>
      {[...Array(30)].map((_, i) => (
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

export default PageTransitionOverlay;
