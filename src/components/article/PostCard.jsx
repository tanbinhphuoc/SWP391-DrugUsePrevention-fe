import React from 'react';
import { Star, Eye, Calendar, User, Heart, Share2, ChevronRight } from 'lucide-react';

const PostCard = ({ post, featured = false, category }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${featured ? 'border-2 border-yellow-400' : ''}`}>
      {featured && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-sm font-semibold flex items-center">
          <Star className="w-4 h-4 mr-2" />
          Bài viết nổi bật
        </div>
      )}

      <div className="relative">
        <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-3 py-1 text-sm font-medium text-gray-700 flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          {post.views}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${category?.color || 'bg-gray-100'} text-gray-700`}>
            {category?.icon} {category?.name}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(post.date).toLocaleDateString('vi-VN')}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
          {post.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-gray-600 text-sm">
            <User className="w-4 h-4 mr-2" />
            {post.author}
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm font-semibold">
              Đọc tiếp <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
