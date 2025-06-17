// components/consultation/AnimatedBackground.jsx
import React from 'react';

const AnimatedBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
    <div className="absolute top-32 right-20 w-16 h-16 bg-green-300/20 rounded-full blur-lg animate-bounce"></div>
    <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-blue-300/15 rounded-full blur-xl animate-pulse delay-1000"></div>
    <div className="absolute bottom-40 right-1/3 w-18 h-18 bg-emerald-300/20 rounded-full blur-lg animate-bounce delay-500"></div>
  </div>
);

export default AnimatedBackground;
