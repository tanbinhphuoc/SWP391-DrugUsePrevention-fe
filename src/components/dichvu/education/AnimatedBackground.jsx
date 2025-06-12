import React from 'react';

const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800"></div>
    <div className="absolute inset-0">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 4}s`
          }}
        />
      ))}
    </div>
    <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-400/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
    <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
    <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-400/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
  </div>
);

export default AnimatedBackground;
