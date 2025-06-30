import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, Share2, Calendar, User, Eye, ChevronRight, Star, TrendingUp, MessageCircle, Download, Users, Phone, Mail, Facebook, Youtube, X, Image, Video, Smile, MapPin, Tag, Globe, Lock, Edit3, ChevronDown } from 'lucide-react';

import { categories, privacyOptions, commonEmojis } from './data/constant'; 

import Header from './Header';
import HeroSection from './HeroSection';
import SearchFilterBar from './SearchFilterBar';
import Sidebar from './SideBar';
import Footer from './Footer';
import CreatePostModal from './CreatePostModal';
import PostCard from './PostCard';

const ArticlesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create Post Modal States
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState('knowledge');
  const [postTags, setPostTags] = useState('');
  const [postPrivacy, setPostPrivacy] = useState('public');
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);

  const posts = [
    {
      id: 1,
      title: "5 dấu hiệu nhận biết người thân sử dụng ma túy",
      excerpt: "Những dấu hiệu ban đầu giúp gia đình sớm phát hiện và can thiệp kịp thời...",
      category: 'knowledge',
      author: "Dr. Nguyen Van A",
      date: "2024-06-20",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      views: 1250,
      featured: true,
      tags: ['nhận biết', 'gia đình', 'can thiệp sớm']
    },
    {
      id: 2,
      title: "Phỏng vấn người đã cai nghiện thành công",
      excerpt: "Câu chuyện truyền cảm hứng từ anh Minh - từ vực thẳm trở về cuộc sống...",
      category: 'stories',
      author: "Biên tập viên",
      date: "2024-06-18",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop",
      views: 2100,
      featured: true,
      tags: ['cai nghiện', 'phục hồi', 'cảm hứng']
    },
    {
      id: 3,
      title: "Chương trình tuyên truyền tại trường THPT Lê Quý Đôn",
      excerpt: "Buổi tuyên truyền thu hút hơn 500 học sinh tham gia với nhiều hoạt động tương tác...",
      category: 'events',
      author: "Đoàn tình nguyện",
      date: "2024-06-15",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=250&fit=crop",
      views: 890,
      featured: false,
      tags: ['tuyên truyền', 'học sinh', 'giáo dục']
    },
    {
      id: 4,
      title: "Tác động của ma túy đến não bộ và hệ thần kinh",
      excerpt: "Nghiên cứu khoa học về cách ma túy phá hủy hệ thần kinh và não bộ...",
      category: 'knowledge',
      author: "PGS.TS Tran Thi B",
      date: "2024-06-10",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=250&fit=crop",
      views: 1680,
      featured: false,
      tags: ['khoa học', 'não bộ', 'tác hại']
    },
    {
      id: 5,
      title: "Hỗ trợ tâm lý cho gia đình có người nghiện",
      excerpt: "Hướng dẫn cách gia đình đối phó và hỗ trợ người thân trong quá trình cai nghiện...",
      category: 'family',
      author: "ThS. Le Van C",
      date: "2024-06-08",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
      views: 945,
      featured: false,
      tags: ['gia đình', 'hỗ trợ', 'tâm lý']
    },
    {
      id: 6,
      title: "Workshop kỹ năng sống cho thanh thiếu niên",
      excerpt: "Chương trình đào tạo kỹ năng từ chối và tự bảo vệ trước tệ nạn xã hội...",
      category: 'education',
      author: "Trung tâm GDXH",
      date: "2024-06-05",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
      views: 1200,
      featured: false,
      tags: ['kỹ năng sống', 'thanh thiếu niên', 'phòng chống']
    }
  ];

  const featuredPosts = posts.filter(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  // Fetch user profile từ API
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // Giả lập API call - thay thế bằng endpoint thực tế
        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // hoặc cách lấy token khác
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUserProfile(userData);
        } else {
          // Nếu không có token hoặc không đăng nhập, sử dụng dữ liệu mặc định
          setUserProfile({
            username: 'Khách',
            fullName: 'Khách',
            avatar: null
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Fallback data khi có lỗi
        setUserProfile({
          username: 'Khách',
          fullName: 'Khách',
          avatar: null
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory]);

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
    setSelectedImages(prev => [...prev, ...files]);
  };

  // Remove image
  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Add emoji to content
  const addEmoji = (emoji) => {
    setPostContent(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Handle post creation
  const handleCreatePost = async () => {
    if (!postTitle.trim() || !postContent.trim()) {
      alert('Vui lòng nhập tiêu đề và nội dung bài viết');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', postTitle);
      formData.append('content', postContent);
      formData.append('category', postCategory);
      formData.append('tags', postTags);
      formData.append('privacy', postPrivacy);
      
      selectedImages.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        closeModal();
        alert('Bài viết đã được đăng thành công!');
        // Có thể refresh danh sách bài viết ở đây
      } else {
        alert('Có lỗi xảy ra khi đăng bài viết');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Có lỗi xảy ra khi đăng bài viết');
    }
  };

  // Close modal
  const closeModal = () => {
    setShowCreatePost(false);
    setPostTitle('');
    setPostContent('');
    setPostTags('');
    setSelectedImages([]);
    setPreviewImages([]);
    setShowEmojiPicker(false);
    setShowPrivacyDropdown(false);
  };

  // Handle privacy selection
  const handlePrivacySelect = (privacyId) => {
    setPostPrivacy(privacyId);
    setShowPrivacyDropdown(false);
  };

  const selectedPrivacy = privacyOptions.find(option => option.id === postPrivacy);
  const userName = userProfile?.fullName || userProfile?.username || 'Khách';

  const PostCard = ({ post, featured = false }) => (
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
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categories.find(cat => cat.id === post.category)?.color} text-gray-700`}>
            {categories.find(cat => cat.id === post.category)?.icon} {categories.find(cat => cat.id === post.category)?.name}
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        onCreatePost={() => setShowCreatePost(true)} 
        showMobileMenu={showMobileMenu}
        toggleMobileMenu={() => setShowMobileMenu(!showMobileMenu)}
      />

      {/* Hero Section */}
      <HeroSection />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="lg:w-2/3">
            {/* Search and Filter */}
            <SearchFilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
            />

            {/* Featured Posts */}
            {featuredPosts.length > 0 && selectedCategory === 'all' && (
              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <Star className="w-6 h-6 text-yellow-500 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-800">Bài viết nổi bật</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredPosts.map(post => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      featured={true} 
                      category={categories.find(cat => cat.id === post.category)} 
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Regular Posts */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedCategory === 'all' ? 'Tất cả bài viết' : categories.find(cat => cat.id === selectedCategory)?.name}
                </h2>
                <span className="text-gray-600">
                  {filteredPosts.length} bài viết
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Xem thêm bài viết
              </button>
            </div>
          </main>

          {/* Sidebar */}
          <Sidebar posts={posts} />
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modal Overlay */}
      <CreatePostModal
        show={showCreatePost}
        onClose={closeModal}
        onSubmit={handleCreatePost}
        postTitle={postTitle}
        setPostTitle={setPostTitle}
        postContent={postContent}
        setPostContent={setPostContent}
        postCategory={postCategory}
        setPostCategory={setPostCategory}
        postTags={postTags}
        setPostTags={setPostTags}
        categories={categories}
        selectedImages={selectedImages}
        previewImages={previewImages}
        handleImageUpload={handleImageUpload}
        removeImage={removeImage}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        addEmoji={addEmoji}
        postPrivacy={postPrivacy}
        setPostPrivacy={setPostPrivacy}
        privacyOptions={privacyOptions}
        showPrivacyDropdown={showPrivacyDropdown}
        setShowPrivacyDropdown={setShowPrivacyDropdown}
        userName={userName}
      />
  </div>
  );
};

export default ArticlesPage;