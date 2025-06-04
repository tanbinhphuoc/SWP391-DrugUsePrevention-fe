const ProcessStepsSection = ({ steps }) => (
  <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Quy trình đánh giá
        </h2>
        <p className="text-xl opacity-90 max-w-3xl mx-auto">
          Quy trình 4 bước đơn giản và hiệu quả
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={step.number} className="text-center relative">
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-red-500 to-transparent transform translate-x-8"></div>
            )}
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                <span className="text-2xl font-bold">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-300 leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ProcessStepsSection;
