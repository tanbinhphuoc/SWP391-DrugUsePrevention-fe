import { Star, Award } from 'lucide-react';

const ExpertsSection = ({ experts }) => (
  <section className="py-16 px-4 bg-gray-50">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Đội Ngũ Chuyên Gia
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Được hỗ trợ bởi những chuyên gia hàng đầu với nhiều năm kinh nghiệm
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {experts.map((expert, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="p-6 text-center">
              <img
                src={expert.image}
                alt={expert.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold text-gray-800 mb-2">{expert.name}</h3>
              <p className="text-blue-600 font-semibold mb-2">{expert.specialty}</p>
              <p className="text-gray-600 mb-3">{expert.experience}</p>
              <div className="flex items-center justify-center mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-1 text-gray-600">{expert.rating}</span>
              </div>
              <div className="space-y-1">
                {expert.achievements.map((achievement, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-600">
                    <Award className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                    {achievement}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ExpertsSection;
