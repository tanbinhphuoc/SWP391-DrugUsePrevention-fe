import React from 'react';
import { Users, Phone, TrendingUp, Eye, Download } from 'lucide-react';

const Sidebar = ({ posts }) => {
  const popularPosts = posts.slice(0, 5); // hoặc logic lọc khác nếu có

  const tags = [
    'cai nghiện', 'phòng chống', 'giáo dục', 'gia đình', 'tâm lý',
    'sức khỏe', 'cộng đồng', 'tình nguyện', 'hỗ trợ', 'phục hồi'
  ];

  return (
    <aside className="lg:w-1/3">
      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Tham gia cùng chúng tôi!</h3>
        <p className="mb-4">Hãy cùng lan tỏa thông điệp phòng chống ma túy trong cộng đồng</p>
        <div className="space-y-3">
          <button className="w-full bg-white text-green-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            <Users className="w-4 h-4 inline mr-2" />
            Tham gia tình nguyện
          </button>
          <button className="w-full bg-white bg-opacity-20 text-white py-2 rounded-lg font-semibold hover:bg-opacity-30 transition-colors">
            <Phone className="w-4 h-4 inline mr-2" />
            Tư vấn miễn phí
          </button>
        </div>
      </div>

      {/* Bài viết phổ biến */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-5 h-5 text-red-500 mr-2" />
          <h3 className="text-lg font-bold">Bài viết phổ biến</h3>
        </div>
        <div className="space-y-4">
          {popularPosts.map(post => (
            <div key={post.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
              <img src={post.image} alt={post.title} className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-800 line-clamp-2 mb-1">{post.title}</h4>
                <div className="flex items-center text-xs text-gray-500">
                  <Eye className="w-3 h-3 mr-1" />
                  {post.views}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-bold mb-4">Chủ đề phổ biến</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">Tài liệu tham khảo</h3>
        <div className="space-y-3">
          <a href="#" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Sổ tay phòng chống ma túy
          </a>
          <a href="#" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Video tuyên truyền
          </a>
          <a href="#" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Poster tuyên truyền
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
