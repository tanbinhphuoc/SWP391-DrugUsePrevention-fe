import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from 'axios';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"]
  ]
};

const BlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [editingBlog, setEditingBlog] = useState(null);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState("Education");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState("Dr. Sarah Johnson");
  const [authorID, setAuthorID] = useState(1);
  const [authorTitle, setAuthorTitle] = useState("Chuyên gia");
  const [authorAvatar, setAuthorAvatar] = useState("https://images.unsplash.com/photo-1494790108755-2616b612b300?w=150&h=150&fit=crop&crop=face");
  const [readTime, setReadTime] = useState("5");
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState("PENDING");
  const [featured, setFeatured] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [socialImage, setSocialImage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const hour = new Date().getHours();
    setDarkMode(hour >= 18 || hour < 6);
  }, []);

  useEffect(() => {
    const words = content.trim().split(/\s+/).length;
    setWordCount(content.trim() ? words : 0);
    const estimatedReadTime = Math.max(1, Math.ceil(words / 200));
    setReadTime(estimatedReadTime.toString());
  }, [content]);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:7092/api/Blog/${id}`)
        .then(res => {
          const b = res.data;
          setTitle(b.title || "");
          setExcerpt(b.excerpt || "");
          setContent(b.content || "");
          setThumbnail(b.thumbnail || "");
          setCategory(b.category || "Education");
          setTags((b.tags || []).join(", "));
          setAuthor(b.author || "");
          setAuthorID(b.authorID || 1);
          setAuthorTitle(b.authorTitle || "");
          setAuthorAvatar(b.authorAvatar || "");
          setReadTime(b.readTime || "5");
          setPublishDate(b.publishDate?.split('T')[0] || new Date().toISOString().split('T')[0]);
          setStatus(b.status || "PENDING");
          setFeatured(b.featured || false);
          setSeoTitle(b.seoTitle || "");
          setSeoDescription(b.seoDescription || "");
          setSocialImage(b.socialImage || "");
        })
        .catch(err => {
          console.error("Failed to fetch blog:", err);
        });
    }
  }, [id]);

  const handleSave = async () => {
    const payload = {
      blogID: id ? parseInt(id) : 0,
      title,
      content,
      excerpt,
      thumbnail,
      category,
      tags: tags.split(',').map(t => t.trim()),
      author,
      authorID,
      authorTitle,
      authorAvatar,
      readTime,
      publishDate: new Date(publishDate).toISOString(),
      status,
      featured,
      seoTitle,
      seoDescription,
      socialImage
    };

    try {
      if (id) {
        await axios.put(`http://localhost:7092/api/Blog/${id}`, payload);
        alert("Cập nhật bài viết thành công!");
      } else {
        await axios.post("http://localhost:7092/api/Blog", payload);
        alert("Tạo bài viết thành công!");
      }
      navigate("/staff-dashboard", { state: { refresh: true } });
    } catch (error) {
      console.error("Lỗi lưu blog:", error.response?.data || error.message);
      alert("Lỗi khi lưu blog: " + JSON.stringify(error.response?.data?.errors || {}));
    }
  };

  const categories = [
    { value: "Education", label: "📚 Education", color: "from-blue-500 to-purple-500" },
    { value: "Technology", label: "🔬 Technology", color: "from-green-500 to-blue-500" },
    { value: "Health", label: "⚕️ Health", color: "from-red-500 to-pink-500" },
    { value: "Business", label: "💼 Business", color: "from-yellow-500 to-orange-500" },
    { value: "Lifestyle", label: "🌟 Lifestyle", color: "from-purple-500 to-pink-500" },
    { value: "Science", label: "🧪 Science", color: "from-cyan-500 to-blue-500" },
  ];

  const statusOptions = [
    { value: "PENDING", label: "🕓 Đang chờ duyệt", color: "bg-yellow-100 text-yellow-800" },
    { value: "APPROVED", label: "✅ Đã duyệt", color: "bg-green-100 text-green-800" },
    { value: "REJECTED", label: "❌ Từ chối", color: "bg-red-100 text-red-800" },
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark' : ''}`}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          
          * {
            font-family: 'Inter', sans-serif;
          }
          
          @keyframes aurora {
            0% { background-position: 0% 50%; }
            25% { background-position: 100% 50%; }
            50% { background-position: 100% 100%; }
            75% { background-position: 0% 100%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-15px) rotate(1deg); }
            66% { transform: translateY(-5px) rotate(-1deg); }
          }
          
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.3); }
            50% { box-shadow: 0 0 40px rgba(147, 51, 234, 0.6); }
          }
          
          @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .aurora-bg {
            background: linear-gradient(-45deg, 
              #667eea 0%, 
              #764ba2 25%, 
              #f093fb 50%, 
              #f5576c 75%, 
              #4facfe 100%
            );
            background-size: 400% 400%;
            animation: aurora 15s ease infinite;
          }
          
          .dark .aurora-bg {
            background: linear-gradient(-45deg, 
              #0f0f23 0%, 
              #1a1a2e 25%, 
              #16213e 50%, 
              #0f3460 75%, 
              #533483 100%
            );
            background-size: 400% 400%;
            animation: aurora 20s ease infinite;
          }
          
          .glass-morphism {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(25px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
          }
          
          .dark .glass-morphism {
            background: rgba(17, 24, 39, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          }
          
          .floating-element {
            animation: float 8s ease-in-out infinite;
          }
          
          .shimmer-text {
            background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #667eea);
            background-size: 300% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 4s ease-in-out infinite;
          }
          
          .input-luxury {
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid transparent;
            border-radius: 16px;
            padding: 16px 20px;
            font-size: 16px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
            position: relative;
          }
          
          .input-luxury:focus {
            outline: none;
            border: 2px solid #667eea;
            background: rgba(255, 255, 255, 1);
            transform: translateY(-3px);
            box-shadow: 0 25px 50px rgba(102, 126, 234, 0.25);
          }
          
          .dark .input-luxury {
            background: rgba(31, 41, 55, 0.8);
            color: white;
            border-color: rgba(255, 255, 255, 0.1);
          }
          
          .dark .input-luxury:focus {
            background: rgba(31, 41, 55, 1);
            border-color: #667eea;
          }
          
          .btn-luxury {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 12px;
            padding: 12px 24px;
            color: white;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }
          
          .btn-luxury:hover {
            transform: translateY(-3px);
            box-shadow: 0 20px 40px rgba(102, 126, 234, 0.4);
          }
          
          .btn-luxury:active {
            transform: translateY(-1px);
          }
          
          .tab-button {
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .tab-button.active {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
          }
          
          .tab-button:not(.active) {
            background: rgba(255, 255, 255, 0.1);
            color: #667eea;
          }
          
          .dark .tab-button:not(.active) {
            background: rgba(255, 255, 255, 0.05);
            color: #a78bfa;
          }
          
          .preview-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(25px);
            border-radius: 24px;
            padding: 32px;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .dark .preview-card {
            background: rgba(17, 24, 39, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .floating-shapes {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
            z-index: 1;
          }
          
          .floating-shapes::before,
          .floating-shapes::after {
            content: '';
            position: absolute;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
            animation: float 12s ease-in-out infinite;
          }
          
          .floating-shapes::before {
            width: 400px;
            height: 400px;
            top: 5%;
            right: 5%;
            animation-delay: -3s;
          }
          
          .floating-shapes::after {
            width: 250px;
            height: 250px;
            bottom: 15%;
            left: 8%;
            animation-delay: -6s;
          }
          
          .stats-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 16px;
            padding: 20px;
            transition: all 0.3s ease;
          }
          
          .dark .stats-card {
            background: linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(31, 41, 55, 0.6));
            border-color: rgba(255, 255, 255, 0.1);
          }
          
          .stats-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>

      {/* Background với hiệu ứng Aurora */}
      <div className="aurora-bg fixed inset-0 z-0"></div>
      
      {/* Floating shapes cho background */}
      <div className="floating-shapes"></div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Editor Panel */}
        <div className="w-1/2 p-6 overflow-y-auto">
          <div className="glass-morphism rounded-3xl p-8 h-full">
            {/* Header */}
            <div className="mb-8 flex justify-between items-start">
              <div className="floating-element">
                <h1 className="text-5xl font-black mb-3 shimmer-text">
                  {editingBlog ? "✨ Edit Article" : "🎨 Create New Article"}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                  Craft compelling content that engages and inspires
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="stats-card flex items-center gap-2 text-sm">
                    <span className="text-blue-500">📊</span>
                    <span className="font-semibold">{wordCount} words</span>
                  </div>
                  <div className="stats-card flex items-center gap-2 text-sm">
                    <span className="text-green-500">⏱️</span>
                    <span className="font-semibold">{readTime} min read</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="btn-luxury flex items-center gap-2 floating-element"
                style={{ animationDelay: '1s' }}
              >
                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="flex gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
                {[
                  { id: "content", label: "✍️ Content", icon: "📝" },
                  { id: "settings", label: "⚙️ Settings", icon: "🔧" },
                  { id: "seo", label: "🎯 SEO", icon: "📈" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Tab */}
            {activeTab === "content" && (
              <div className="space-y-6">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    📖 Article Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your compelling title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-2xl font-bold input-luxury"
                    style={{ minHeight: '60px' }}
                  />
                </div>

                {/* Excerpt Input */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    📝 Excerpt / Summary
                  </label>
                  <textarea
                    placeholder="Write a compelling summary that will hook your readers..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full text-lg input-luxury resize-none"
                    rows={3}
                  />
                </div>

                {/* Thumbnail Input */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    🖼️ Featured Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    className="w-full input-luxury"
                  />
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    ✨ Article Content *
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing your amazing content here..."
                    className="w-full input-luxury resize-none font-mono"
                    rows={15}
                  />
                </div>

                {/* Category & Tags */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      📚 Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full input-luxury"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      🏷️ Tags
                    </label>
                    <input
                      type="text"
                      placeholder="tag1, tag2, tag3"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full input-luxury"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                {/* Author Information */}
              <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    🆔 Author ID
                </label>
                <input
                  type="number"
                  value={isNaN(authorID) ? "" : authorID}
                  onChange={(e) => setAuthorID(parseInt(e.target.value) || 0)}
                  className="w-full input-luxury"
                  placeholder="Nhập ID người viết"
                />
              </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      👤 Author Name
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full input-luxury"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      🎓 Author Title
                    </label>
                    <input
                      type="text"
                      value={authorTitle}
                      onChange={(e) => setAuthorTitle(e.target.value)}
                      className="w-full input-luxury"
                    />
                  </div>
                </div>

                {/* Author Avatar */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    📸 Author Avatar URL
                  </label>
                  <input
                    type="text"
                    value={authorAvatar}
                    onChange={(e) => setAuthorAvatar(e.target.value)}
                    className="w-full input-luxury"
                  />
                </div>

                {/* Publish Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      📅 Publish Date
                    </label>
                    <input
                      type="date"
                       value={publishDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setPublishDate(e.target.value)}
                      className="w-full input-luxury"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      📊 Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full input-luxury"
                    >
                      <option value="PENDING">⏳ Đang chờ duyệt</option>
                      <option value="APPROVED">✅ Đã duyệt</option>
                      <option value="REJECTED">❌ Từ chối</option>
                    </select>
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="featured" className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    ⭐ Featured Article
                  </label>
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === "seo" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    🎯 SEO Title
                  </label>
                  <input
                    type="text"
                    placeholder="Optimized title for search engines"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full input-luxury"
                  />
                  <p className="text-xs text-gray-500 mt-1">{seoTitle.length}/60 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    📝 Meta Description
                  </label>
                  <textarea
                    placeholder="Brief description for search results"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    className="w-full input-luxury resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">{seoDescription.length}/160 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    📱 Social Media Image
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/social-image.jpg"
                    value={socialImage}
                    onChange={(e) => setSocialImage(e.target.value)}
                    className="w-full input-luxury"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-xl font-semibold transition-all duration-300 hover:transform hover:scale-105 text-gray-800 dark:text-white"
              >
                {showPreview ? "✏️ Edit" : "👀 Preview"}
              </button>
              <button
                onClick={() => {/* navigate("/staff/blog") */}}
                className="px-6 py-3 bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 dark:from-red-900 dark:to-red-800 dark:hover:from-red-800 dark:hover:to-red-700 rounded-xl font-semibold transition-all duration-300 hover:transform hover:scale-105 text-red-800 dark:text-red-200"
              >
                ❌ Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-luxury px-8 py-3 text-lg font-bold flex items-center gap-2"
              >
                💾 {editingBlog ? "Update Article" : "Save Article"}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className={`w-1/2 p-6 overflow-y-auto transition-all duration-500 ${showPreview ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
          <div className="preview-card h-full">
            <div className="max-w-4xl mx-auto">
              {/* Preview Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 shimmer-text">
                  🎭 Article Preview
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
              </div>

              {/* Article Card Preview */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl mb-8">
                {/* Thumbnail Preview */}
                {thumbnail && (
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={thumbnail} 
                      alt="Article thumbnail" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    {featured && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          ⭐ Featured
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        categories.find(c => c.value === category)?.color || 'from-blue-500 to-purple-500'
                      } bg-gradient-to-r text-white`}>
                        {categories.find(c => c.value === category)?.label || category}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Publish Date & Read Time */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      📅 {new Date(publishDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      ⏱️ {readTime} min read
                    </span>
                  </div>

                  {/* Title Preview */}
                  {title && (
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                      {title}
                    </h1>
                  )}

                  {/* Excerpt Preview */}
                  {excerpt && (
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 italic font-medium leading-relaxed">
                      {excerpt}
                    </p>
                  )}

                  {/* Author Info */}
                  <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <img 
                      src={authorAvatar} 
                      alt={author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{author}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{authorTitle}</div>
                    </div>
                  </div>

                  {/* Content Preview */}
                  {content && (
                    <div className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mb-8 leading-relaxed whitespace-pre-wrap">
                      {content}
                    </div>
                  )}

                  {/* Tags */}
                  {tags && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {tags.split(",").map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats Preview */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        👁️ 2.4k views
                      </span>
                      <span className="flex items-center gap-1">
                        ❤️ 156 likes
                      </span>
                      <span className="flex items-center gap-1">
                        💬 23 comments
                      </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      statusOptions.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {statusOptions.find(s => s.value === status)?.label || status}
                    </div>
                  </div>
                </div>
              </div>

              {/* SEO Preview */}
              {(seoTitle || seoDescription) && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    🎯 SEO Preview
                  </h3>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-blue-600 dark:text-blue-400 text-lg font-medium mb-1">
                      {seoTitle || title}
                    </div>
                    <div className="text-green-600 dark:text-green-400 text-sm mb-2">
                      https://example.com/article/{title?.toLowerCase().replace(/\s+/g, '-')}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 text-sm">
                      {seoDescription || excerpt}
                    </div>
                  </div>
                </div>
              )}

              {/* Social Media Preview */}
              {(socialImage || thumbnail) && (
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900 dark:to-purple-900 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    📱 Social Media Preview
                  </h3>
                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img 
                      src={socialImage || thumbnail} 
                      alt="Social preview"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="p-4">
                      <div className="font-bold text-gray-900 dark:text-white mb-1">
                        {title}
                      </div>
                      <div className="text-gray-600 dark:text-gray-300 text-sm">
                        {excerpt}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;