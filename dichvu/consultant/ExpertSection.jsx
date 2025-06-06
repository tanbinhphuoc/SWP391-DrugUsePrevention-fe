import { Star, Award } from 'lucide-react';

// Experts Section Component
const ExpertsSection = ({ experts }) => {
  return (
    <div className="relative py-20 px-6">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Đội ngũ Chuyên gia</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Gặp gỡ những chuyên gia hàng đầu trong lĩnh vực
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {experts.map((expert, index) => (
            <div key={index} className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:transform hover:-translate-y-2">
              <div className="text-center">
                <img 
                  src={expert.image} 
                  alt={expert.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-yellow-400"
                />
                <h3 className="text-xl font-bold text-white mb-2">{expert.name}</h3>
                <p className="text-blue-200 mb-2">{expert.specialty}</p>
                <p className="text-blue-100 text-sm mb-3">{expert.experience}</p>
                <div className="flex items-center justify-center mb-4">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-white ml-1 font-semibold">{expert.rating}</span>
                </div>
                <div className="space-y-1">
                  {expert.achievements.map((achievement, i) => (
                    <div key={i} className="text-green-300 text-sm flex items-center justify-center">
                      <Award className="w-3 h-3 mr-1" />
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default ExpertsSection;
