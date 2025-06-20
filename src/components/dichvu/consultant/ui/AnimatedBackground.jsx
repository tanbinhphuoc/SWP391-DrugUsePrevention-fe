import React from 'react';

const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-pulse"></div>
    <div className="absolute top-40 -left-40 w-60 h-60 bg-white/5 rounded-full animate-bounce"></div>
    <div className="absolute bottom-40 right-20 w-40 h-40 bg-white/10 rounded-full animate-ping"></div>
  </div>
);

export default AnimatedBackground;