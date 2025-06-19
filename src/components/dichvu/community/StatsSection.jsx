import React from 'react';

const StatisticsSection = ({ achievements = [] }) => {
  return (
    <section className="py-16 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-xl group">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${
                  index % 4 === 0 ? 'from-blue-100 to-blue-200' :
                  index % 4 === 1 ? 'from-green-100 to-green-200' :
                  index % 4 === 2 ? 'from-purple-100 to-purple-200' :
                  'from-red-100 to-red-200'
                } mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-8 h-8 ${achievement.color}`} />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{achievement.value}</h3>
                <p className="text-gray-600 font-medium">{achievement.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
