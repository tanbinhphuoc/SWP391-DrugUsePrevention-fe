import React from 'react';

const AnimatedBackground = () => {
  return (
    <>
    <div className="fixed inset-0 -z-10">
      {/* Primary gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50"></div>

      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-l from-orange-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-gradient-to-t from-red-500/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-gradient-to-bl from-orange-500/20 to-red-400/20 rounded-full blur-3xl animate-pulse delay-3000"></div>

      {/* Geometric shapes */}
      <div className="absolute top-1/3 left-1/2 w-32 h-32 border border-red-200/30 rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-orange-200/30 rotate-12 animate-bounce" style={{ animationDuration: '3s' }}></div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-red-400/30 to-orange-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>
    </div>
    
    <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default AnimatedBackground;
