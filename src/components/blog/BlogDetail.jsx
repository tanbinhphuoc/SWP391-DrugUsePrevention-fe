import { useEffect, useState } from "react";
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, Heart, Eye, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";

const BlogDetail = () => {
  const { id } = useParams();
  // Mock data for demo
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
     axios.get(`http://localhost:7092/api/Blog/${id}`)
    .then(res => {
      const blogData = res.data;
      setBlog(blogData);
      const wordCount = blogData.content.split(' ').length;
      setReadingTime(Math.ceil(wordCount / 200));
      setLoading(false);
    })
    .catch(err => {
      console.error("Lỗi tải bài viết:", err);
      setLoading(false);
    });
}, [id]);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxScroll) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGoBack = () => {
    window.history.back();
    console.log("Quay lại trang trước");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Sharing failed:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép link vào clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin mx-auto" style={{animationDelay: '0.3s', animationDirection: 'reverse'}}></div>
          </div>
          <p className="text-gray-600 font-medium">Đang tải bài viết...</p>
          <p className="text-gray-400 text-sm mt-1">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-red-500 text-4xl">📄</div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy bài viết</h2>
          <p className="text-gray-600 mb-6">Bài viết này có thể đã bị xóa hoặc không tồn tại.</p>
          <button 
            onClick={handleGoBack}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Header Navigation */}
      <div className="sticky top-1 z-40 backdrop-blur-md bg-white/80 border-b border-gray-200/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleGoBack}
            className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
          >
            <span className="absolute inset-0 opacity-10 bg-white blur-sm group-hover:opacity-20 transition-opacity duration-300"></span>
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="relative z-10">Quay lại</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-full transition-all duration-200 ${isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full transition-all duration-200 ${isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={handleShare}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {blog.thumbnail && (
          <div className="relative h-96 md:h-[500px]">
            <img 
              src={blog.thumbnail} 
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <div className="max-w-4xl mx-auto">
                <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {blog.category}
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">
                  {blog.title}
                </h1>
              </div>
            </div>
          </div>
        )}
        
        {!blog.thumbnail && (
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 py-20 px-8">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                {blog.category}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                {blog.title}
              </h1>
            </div>
          </div>
        )}
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Article Meta */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <img
                src={blog.authorAvatar || "https://via.placeholder.com/80"}
                alt={blog.author}
                className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow"
              />
              <div>
                <p className="font-semibold text-gray-800">{blog.author}</p>
                <p className="text-sm text-gray-500">Tác giả</p>
              </div>
            </div>
            
            <div className="h-8 w-px bg-gray-200"></div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className="font-medium">
                {new Date(blog.publishDate).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5 text-green-500" />
              <span className="font-medium">{readingTime} phút đọc</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Eye className="w-5 h-5 text-purple-500" />
              <span className="font-medium">2,847 lượt xem</span>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <article className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
          <div 
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
            style={{ 
              whiteSpace: 'pre-wrap',
              fontSize: '1.125rem',
              lineHeight: '1.8'
            }}
          >
            {blog.content}
          </div>
        </article>

        {/* Article Footer */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200 font-medium ${
                  isLiked 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{isLiked ? 'Đã thích (247)' : 'Thích bài viết (246)'}</span>
              </button>
              
              <button 
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200 font-medium ${
                  isBookmarked 
                    ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>{isBookmarked ? 'Đã lưu' : 'Lưu bài viết'}</span>
              </button>
            </div>
            
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
            >
              <Share2 className="w-5 h-5" />
              <span>Chia sẻ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed right-6 bottom-6 flex flex-col gap-3 z-40">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-white hover:bg-gray-50 rounded-full shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200 transform hover:scale-110"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 rotate-90" />
        </button>
        <button 
          onClick={handleShare}
          className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110"
        >
          <Share2 className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default BlogDetail;