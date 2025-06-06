const StatsSection = ({ stats }) => (
  <div className="relative py-16 bg-white/10 backdrop-blur-sm">
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center text-white">
            <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
            <div className="text-3xl font-bold mb-2">{stat.value}</div>
            <div className="text-lg opacity-90">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default StatsSection;
