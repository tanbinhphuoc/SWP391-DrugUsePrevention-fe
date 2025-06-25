import React from 'react';
import { Star } from 'lucide-react';

const Step2ExpertSelection = ({ experts, selectedService, selectedExpert, setSelectedExpert }) => {
  const filteredExperts = experts.filter(expert => 
    expert.available && expert.category === selectedService?.category
  );

  const formatPrice = (price) => price.toLocaleString('vi-VN') + 'đ';

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Chọn chuyên gia tư vấn</h3>
      <div className="space-y-3">
        {filteredExperts.map((expert) => (
          <div
            key={expert.id}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedExpert?.id === expert.id
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedExpert(expert)}
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{expert.image}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{expert.name}</h4>
                <p className="text-gray-600 text-sm">{expert.specialty}</p>
                <p className="text-gray-500 text-xs mt-1">{expert.bio}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-gray-500 text-sm">{expert.experience}</span>
                  <div className="flex items-center space-x-1">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{expert.rating}</span>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Đang hoạt động
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-emerald-600 font-semibold">
                    {formatPrice(expert.hourlyRate)}/giờ
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step2ExpertSelection;