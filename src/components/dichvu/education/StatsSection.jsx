const StatsSection = ({ stats }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 text-center"
        >
          <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
          <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
          <div className="text-gray-600 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
);

export default StatsSection;
