import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  MessageCircle,
  Share2,
  MoreVertical,
  Bookmark,
  Star,
  FileText,
  Video,
  Heart,
  TrendingUp
} from "lucide-react";

const BlogManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [showActions, setShowActions] = useState(null);

  const categories = ["Tất cả", "Giáo dục", "Hướng dẫn", "Câu chuyện", "Báo cáo", "Tin tức"];
  const statuses = ["Tất cả", "Đã xuất bản", "Bản nháp", "Đang xem xét"];

  // Dữ liệu giả để làm đẹp trang khi chưa có API thật
  const mockBlogs = [
    {
      blogID: 1,
      title: "Tác hại của thuốc lá đối với thanh thiếu niên",
      content: "Thuốc lá là một trong những tệ nạn xã hội nghiêm trọng nhất hiện nay, đặc biệt ảnh hưởng đến sức khỏe và tương lai của các bạn trẻ. Việc hút thuốc lá không chỉ gây hại cho bản thân mà còn ảnh hưởng đến những người xung quanh...",
      author: "Nguyễn Minh Hạnh",
      authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      category: "Giáo dục",
      tags: ["thuốc lá", "tệ nạn xã hội", "sức khỏe", "thanh thiếu niên"],
      thumbnail: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&h=250&fit=crop",
      readTime: "8 phút",
      publishDate: "2024-12-15T10:30:00Z",
      status: "APPROVED",
      views: 2847,
      likes: 156,
      comments: 23,
      shares: 45,
      featured: true,
      type: "article"
    },
    {
      blogID: 2,
      title: "Cách nhận biết và phòng tránh tệ nạn ma túy",
      content: "Ma túy là một vấn đề nghiêm trọng trong xã hội hiện đại. Việc trang bị kiến thức để nhận biết và phòng tránh ma túy là vô cùng quan trọng, đặc biệt đối với giới trẻ. Bài viết này sẽ cung cấp những thông tin cần thiết...",
      author: "Trần Thị Lan",
      authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      category: "Hướng dẫn",
      tags: ["ma túy", "phòng chống", "an toàn", "giáo dục"],
      thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      readTime: "12 phút",
      publishDate: "2024-12-10T14:20:00Z",
      status: "APPROVED",
      views: 1923,
      likes: 89,
      comments: 15,
      shares: 32,
      featured: false,
      type: "guide"
    },
    {
      blogID: 3,
      title: "Câu chuyện về hành trình thoát khỏi nghiện game",
      content: "Đây là câu chuyện thật về một bạn trẻ đã vượt qua nghiện game online để trở lại cuộc sống bình thường. Hy vọng câu chuyện này sẽ truyền cảm hứng và động lực cho những ai đang gặp phải tình trạng tương tự...",
      author: "Lê Văn Minh",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      category: "Câu chuyện",
      tags: ["nghiện game", "thoát nghiện", "câu chuyện thật", "động lực"],
      thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=250&fit=crop",
      readTime: "15 phút",
      publishDate: "2024-12-08T09:15:00Z",
      status: "APPROVED",
      views: 3456,
      likes: 234,
      comments: 67,
      shares: 89,
      featured: true,
      type: "article"
    },
    {
      blogID: 4,
      title: "Báo cáo tình hình tệ nạn xã hội năm 2024",
      content: "Báo cáo tổng quan về tình hình các tệ nạn xã hội trong năm 2024, bao gồm các số liệu thống kê, xu hướng và những biện pháp phòng chống hiệu quả. Đây là tài liệu tham khảo quan trọng cho các nhà giáo dục và phụ huynh...",
      author: "Ban Biên Tập",
      authorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face",
      category: "Báo cáo",
      tags: ["báo cáo", "thống kê", "tệ nạn xã hội", "2024"],
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      readTime: "20 phút",
      publishDate: "2024-12-05T16:45:00Z",
      status: "PENDING",
      views: 1245,
      likes: 45,
      comments: 8,
      shares: 12,
      featured: false,
      type: "report"
    },
    {
      blogID: 5,
      title: "Video: Tác hại của rượu bia đối với não bộ",
      content: "Video giáo dục trực quan về tác hại của rượu bia đối với não bộ, đặc biệt là ở độ tuổi thanh thiếu niên. Nội dung được trình bày một cách khoa học nhưng dễ hiểu, phù hợp với mọi lứa tuổi...",
      author: "Phạm Thị Hoa",
      authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      category: "Giáo dục",
      tags: ["rượu bia", "não bộ", "video giáo dục", "tác hại"],
      thumbnail: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=250&fit=crop",
      readTime: "10 phút",
      publishDate: "2024-12-03T11:30:00Z",
      status: "APPROVED",
      views: 1876,
      likes: 112,
      comments: 34,
      shares: 56,
      featured: false,
      type: "video"
    },
    {
      blogID: 6,
      title: "Tin tức: Chương trình phòng chống tệ nạn xã hội mới",
      content: "Chính phủ vừa công bố chương trình phòng chống tệ nạn xã hội mới với nhiều hoạt động thiết thực và hiệu quả. Chương trình tập trung vào giáo dục, tuyên truyền và hỗ trợ cộng đồng...",
      author: "Hồ Thị Mai",
      authorAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face",
      category: "Tin tức",
      tags: ["tin tức", "chương trình mới", "chính phủ", "phòng chống"],
      thumbnail: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop",
      readTime: "6 phút",
      publishDate: "2024-12-01T08:00:00Z",
      status: "APPROVED",
      views: 987,
      likes: 67,
      comments: 12,
      shares: 23,
      featured: false,
      type: "article"
    },
    {
      blogID: 7,
      title: "Hướng dẫn cha mẹ phát hiện con sử dụng chất kích thích",
      content: "Bài viết hướng dẫn chi tiết giúp cha mẹ nhận biết những dấu hiệu cảnh báo khi con em mình có thể đang sử dụng các chất kích thích. Bao gồm các biểu hiện về thể chất, tâm lý và hành vi...",
      author: "Nguyễn Văn Đức",
      authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      category: "Hướng dẫn",
      tags: ["cha mẹ", "chất kích thích", "nhận biết", "hướng dẫn"],
      thumbnail: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=250&fit=crop",
      readTime: "14 phút",
      publishDate: "2024-11-28T13:20:00Z",
      status: "REJECTED",
      views: 567,
      likes: 34,
      comments: 5,
      shares: 8,
      featured: false,
      type: "guide"
    },
    {
      blogID: 8,
      title: "Những tác động tích cực của việc từ bỏ thuốc lá",
      content: "Bài viết mô tả chi tiết những thay đổi tích cực mà cơ thể trải qua khi bỏ thuốc lá, từ những giờ đầu tiên cho đến nhiều năm sau. Đây là động lực mạnh mẽ cho những ai đang có ý định bỏ thuốc...",
      author: "Trần Văn Hùng",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      category: "Giáo dục",
      tags: ["bỏ thuốc lá", "sức khỏe", "thay đổi tích cực", "động lực"],
      thumbnail: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=250&fit=crop",
      readTime: "11 phút",
      publishDate: "2024-11-25T15:45:00Z",
      status: "APPROVED",
      views: 2134,
      likes: 143,
      comments: 28,
      shares: 67,
      featured: true,
      type: "article"
    }
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:7092/api/Blog/list');
        let blogsFromServer = response.data;
        
        // Nếu API không trả về dữ liệu hoặc trả về mảng rỗng, sử dụng dữ liệu giả
        if (!blogsFromServer || blogsFromServer.length === 0) {
          blogsFromServer = mockBlogs;
        } else {
          // Xử lý dữ liệu từ API như cũ
          blogsFromServer = response.data.map(b => {
            const content = b.content || b.Content || "";
            return {
              ...b,
              excerpt: content.substring(0, 100) + "...",
              author: b.author || "Người dùng",
              authorAvatar: b.authorAvatar || "https://via.placeholder.com/40",
              category: b.category || "Giáo dục",
              tags: b.tags || [],
              thumbnail: b.thumbnail || "https://via.placeholder.com/400x250",
              readTime: b.readTime || "5 phút",
              createdAt: b.publishDate || b.PublishDate,
              updatedAt: b.publishDate || b.PublishDate,
              views: b.views || 0,
              likes: b.likes || 0,
              comments: b.comments || 0,
              shares: b.shares || 0,
              featured: b.featured || false,
              type: b.type || "article"
            };
          });
        }
        
        // Xử lý dữ liệu chung cho cả API thật và dữ liệu giả
        const processedBlogs = blogsFromServer.map(b => ({
          ...b,
          excerpt: b.excerpt || (b.content ? b.content.substring(0, 100) + "..." : ""),
          createdAt: b.createdAt || b.publishDate || b.PublishDate,
          updatedAt: b.updatedAt || b.publishDate || b.PublishDate
        }));
        
        setBlogs(processedBlogs);
        setFilteredBlogs(processedBlogs);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi tải blog:", err);
        // Nếu API lỗi, sử dụng dữ liệu giả
        setBlogs(mockBlogs);
        setFilteredBlogs(mockBlogs);
        setLoading(false);
      }
    };
    fetchBlogs();
  },[location.state]);

  useEffect(() => {
    let filtered = [...blogs];
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }
    if (selectedStatus !== "all") {
      const statusMap = {
        "Đã xuất bản": "APPROVED",
        "Bản nháp": "draft",
        "Đang xem xét": "PENDING"
      };
      filtered = filtered.filter(blog => blog.status === statusMap[selectedStatus]);
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest": return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest": return new Date(a.createdAt) - new Date(b.createdAt);
        case "mostViewed": return b.views - a.views;
        case "mostLiked": return b.likes - a.likes;
        case "title": return a.title.localeCompare(b.title);
        default: return 0;
      }
    });
    setFilteredBlogs(filtered);
  }, [blogs, searchTerm, selectedCategory, selectedStatus, sortBy]);

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED": return "bg-green-100 text-green-700 border-green-300";
      case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "REJECTED": return "bg-red-100 text-red-600 border-red-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "APPROVED": return "Đã duyệt";
      case "PENDING": return "Đang chờ duyệt";
      case "REJECTED": return "Từ chối";
      default: return "Không xác định";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "video": return <Video className="w-4 h-4" />;
      case "article": return <FileText className="w-4 h-4" />;
      case "guide": return <Bookmark className="w-4 h-4" />;
      case "report": return <TrendingUp className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const formatNumber = (num) => num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num.toString();

  const deleteBlog = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này không?")) return;
    try {
      await axios.delete(`http://localhost:7092/api/Blog/${id}`);
      setBlogs(prev => prev.filter(b => b.blogID !== id));
      setFilteredBlogs(prev => prev.filter(b => b.blogID !== id));
    } catch (err) {
      // Nếu API lỗi, vẫn xóa khỏi state để demo
      setBlogs(prev => prev.filter(b => b.blogID !== id));
      setFilteredBlogs(prev => prev.filter(b => b.blogID !== id));
      console.error("Xóa blog lỗi:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold mb-2">Quản lý Blog</h1>
            <p className="text-blue-100 text-lg">
              Tạo và quản lý nội dung giáo dục về phòng chống tệ nạn xã hội
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{blogs.length}</div>
              <div className="text-sm text-blue-100">Tổng bài viết</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {blogs.filter(b => b.status === 'APPROVED').length}
              </div>
              <div className="text-sm text-blue-100">Đã xuất bản</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {formatNumber(blogs.reduce((sum, b) => sum + b.views, 0))}
              </div>
              <div className="text-sm text-blue-100">Lượt xem</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.slice(1).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              {statuses.slice(1).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="mostViewed">Nhiều lượt xem</option>
              <option value="mostLiked">Nhiều lượt thích</option>
              <option value="title">Theo tên</option>
            </select>

            <button
              onClick={() => navigate("/staff/blog/create")}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Tạo bài viết</span>
            </button>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <div
            key={blog.id || blog.blogID}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
          >
            {/* Thumbnail */}
            <div className="relative overflow-hidden">
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(blog.status)}`}>
                  {getStatusText(blog.status)}
                </span>
                {blog.featured && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Nổi bật</span>
                  </span>
                )}
              </div>
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setShowActions(showActions === blog.id ? null : blog.id)}
                  className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {showActions === blog.id && (
                  <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48 z-10">
                    <button
                      onClick={() => navigate(`/blog/${blog.blogID}`)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Xem chi tiết</span>
                    </button>
                    <button
                      onClick={() => navigate(`/blog/edit/${blog.blogID}`)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Chỉnh sửa</span>
                    </button>
                    <button
                      onClick={() => deleteBlog(blog.blogID)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Xóa</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="absolute bottom-4 left-4">
                <div className="flex items-center space-x-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                  {getTypeIcon(blog.type)}
                  <span>{blog.readTime}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {blog.category}
                </span>
                <span className="text-gray-400 text-xs">•</span>
                <span className="text-gray-500 text-xs flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(blog.createdAt)}</span>
                </span>
              </div>

              <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {blog.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {blog.excerpt}
              </p>

              {/* Author */}
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={blog.authorAvatar}
                  alt={blog.author}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{blog.author}</p>
                  <p className="text-xs text-gray-500">Tác giả</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
                  >
                    #{tag}
                  </span>
                ))}
                {blog.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                    +{blog.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{formatNumber(blog.views)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{formatNumber(blog.likes)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{formatNumber(blog.comments)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                    <Share2 className="w-4 h-4" />
                    <span>{formatNumber(blog.shares)}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    ))}
</div>

    </div>
  );
};

export default BlogManagement;