import { CheckCircle, ArrowRight } from 'lucide-react';

const AssessmentTypesSection = ({ assessmentTypes }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Các loại đánh giá rủi ro
      </h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        Chúng tôi cung cấp nhiều phương pháp đánh giá phù hợp với từng đối tượng và mục đích khác nhau
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {assessmentTypes.map((type) => (
        <div key={type.id} className="group cursor-pointer">
          <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:transform hover:-translate-y-2">
            <div className={`h-2 bg-gradient-to-r ${type.color}`}></div>
            <div className="p-8">
              <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <type.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-red-600 group-hover:to-orange-600 transition-all duration-300">
                {type.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {type.description}
              </p>
              <div className="space-y-3">
                {type.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center group">
                Chọn loại này
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AssessmentTypesSection;
