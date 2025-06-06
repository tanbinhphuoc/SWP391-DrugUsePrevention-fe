const StatisticsSection = ({ achievements }) => (
  <section className="py-16 px-4 bg-white">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Thành Tựu Của Chúng Tôi
        </h2>
        <p className="text-lg text-gray-600">
          Những con số ấn tượng từ các chương trình cộng đồng
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {achievements.map((item, index) => (
          <div key={index} className="text-center">
            <div className="text-emerald-600 mb-4 flex justify-center">
              {item.icon}
            </div>
            <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              {item.number}
            </div>
            <div className="text-lg font-semibold text-gray-700 mb-1">
              {item.label}
            </div>
            <div className="text-sm text-gray-600">
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default StatisticsSection;
