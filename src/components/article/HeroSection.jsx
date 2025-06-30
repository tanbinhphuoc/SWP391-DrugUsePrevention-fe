import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Cùng Phòng Chống Ma Túy
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Cập nhật bài viết, câu chuyện thực tế, kiến thức và kinh nghiệm về công tác phòng chống ma túy trong cộng đồng
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {/* Card 1 */}
            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-lg font-semibold mb-2">Kiến thức</h3>
              <p className="text-blue-100">Thông tin khoa học, cập nhật</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-lg font-semibold mb-2">Cộng đồng</h3>
              <p className="text-blue-100">Chia sẻ, hỗ trợ lẫn nhau</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="text-lg font-semibold mb-2">Phòng chống</h3>
              <p className="text-blue-100">Bảo vệ thế hệ tương lai</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
