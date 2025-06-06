// Animated Background Component
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div>
      
      {/* Animated gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-pink-500/20 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-yellow-400/10 via-transparent to-blue-500/10"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      
      {/* Geometric patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-20 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-green-400 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
      </div>
      
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
    </div>
  );
};

export default AnimatedBackground