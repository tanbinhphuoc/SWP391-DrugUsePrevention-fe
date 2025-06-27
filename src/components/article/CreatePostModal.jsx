import React from 'react';
import {
  X, Image, Video, Smile, MapPin, Tag,
  ChevronDown, Globe, Lock, Users
} from 'lucide-react';

const CreatePostModal = ({
  show,
  onClose,
  onSubmit,
  postTitle,
  setPostTitle,
  postContent,
  setPostContent,
  postCategory,
  setPostCategory,
  postTags,
  setPostTags,
  categories,
  selectedImages,
  previewImages,
  handleImageUpload,
  removeImage,
  showEmojiPicker,
  setShowEmojiPicker,
  addEmoji,
  postPrivacy,
  setPostPrivacy,
  privacyOptions,
  showPrivacyDropdown,
  setShowPrivacyDropdown,
  userName,
}) => {
  const selectedPrivacy = privacyOptions.find(option => option.id === postPrivacy);

  const handlePrivacySelect = (privacyId) => {
    setPostPrivacy(privacyId);
    setShowPrivacyDropdown(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Tạo bài viết</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* User info + privacy */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{userName}</h3>
              <div className="relative">
                <button
                  onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
                  className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md text-sm"
                >
                  {React.createElement(selectedPrivacy.icon, { className: "w-3 h-3" })}
                  <span>{selectedPrivacy.name}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showPrivacyDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-64">
                    {privacyOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => handlePrivacySelect(option.id)}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 text-left"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          {React.createElement(option.icon, { className: "w-4 h-4 text-gray-600" })}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{option.name}</div>
                          <div className="text-sm text-gray-500">{option.desc}</div>
                        </div>
                        {postPrivacy === option.id && (
                          <div className="ml-auto w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <input
            type="text"
            placeholder="Tiêu đề bài viết..."
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="w-full text-lg font-semibold border-none outline-none bg-transparent placeholder-gray-500 mb-4"
          />

          {/* Content */}
          <textarea
            placeholder={`${userName} ơi, bạn đang nghĩ gì thế?`}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="w-full h-32 text-gray-800 border-none outline-none resize-none bg-transparent placeholder-gray-500 text-lg mb-4"
          />

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Chủ đề bài viết</label>
            <select
              value={postCategory}
              onChange={(e) => setPostCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <input
            type="text"
            placeholder="Thẻ tag (phân cách bằng dấu phẩy)..."
            value={postTags}
            onChange={(e) => setPostTags(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
          />

          {/* Image previews */}
          {previewImages.length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-2">
              {previewImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={img} alt="" className="w-full h-32 object-cover rounded-lg" />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-1 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50 grid grid-cols-9 gap-2">
              {['😊', '😍', '🤗', '👍', '❤️', '😢', '😱', '😡', '🤔', '👏', '🙏', '💪', '🔥', '✨', '🎉', '📚', '💡', '🌟'].map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => addEmoji(emoji)}
                  className="text-2xl hover:bg-gray-200 p-2 rounded-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Add to post */}
          <div className="border border-gray-200 rounded-lg p-3 mb-4 flex justify-between items-center">
            <span className="font-medium text-gray-700">Thêm vào bài viết của bạn</span>
            <div className="flex items-center space-x-2">
              <label className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                <Image className="w-6 h-6 text-green-600" />
              </label>
              <button className="p-2 hover:bg-gray-100 rounded-full" title="Video">
                <Video className="w-6 h-6 text-red-600" />
              </button>
              <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 hover:bg-gray-100 rounded-full">
                <Smile className="w-6 h-6 text-yellow-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full" title="Vị trí">
                <MapPin className="w-6 h-6 text-red-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full" title="Gắn thẻ">
                <Tag className="w-6 h-6 text-blue-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={onSubmit}
            disabled={!postTitle.trim() || !postContent.trim()}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              postTitle.trim() && postContent.trim()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Đăng
          </button>
        </div>

        {/* Click outside to close dropdown */}
        {showPrivacyDropdown && (
          <div className="fixed inset-0 z-0" onClick={() => setShowPrivacyDropdown(false)}></div>
        )}
      </div>
    </div>
  );
};

export default CreatePostModal;
