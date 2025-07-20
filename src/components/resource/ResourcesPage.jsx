import { useEffect, useState } from 'react'
import { Download, ExternalLink, BookOpen, Video, FileText, Users, Search, Filter, ArrowLeft, Star, Calendar, Eye, X, Lock, Upload, Settings, CheckCircle, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ResourcesPage = () => {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showAuthPopup, setShowAuthPopup] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const expiresAt = localStorage.getItem("expiresAt")

    if (token && expiresAt && new Date(expiresAt) > new Date()) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  const resourceCategories = [
    { id: 'all', name: 'Tất cả', icon: BookOpen, count: 24 },
    { id: 'guides', name: 'Hướng dẫn', icon: FileText, count: 8 },
    { id: 'videos', name: 'Video', icon: Video, count: 6 },
    { id: 'tools', name: 'Công cụ', icon: Download, count: 4 },
    { id: 'community', name: 'Cộng đồng', icon: Users, count: 3 },
    { id: 'courses', name: 'Khóa học', icon: BookOpen, count: 3 }
  ]

  const resources = [
    {
      id: 1,
      title: 'Hướng dẫn Phòng chống Ma túy cho Gia đình',
      description: 'Tài liệu chi tiết về cách nhận biết và phòng chống tệ nạn xã hội trong gia đình. Bao gồm các dấu hiệu cảnh báo, phương pháp can thiệp và hỗ trợ tâm lý.',
      category: 'guides',
      type: 'PDF',
      size: '2.5 MB',
      downloads: 1250,
      rating: 4.8,
      date: '2024-05-15',
      author: 'Dr. Nguyễn Văn An',
      tags: ['gia đình', 'phòng chống', 'ma túy'],
      featured: true,
      premium: false
    },
    {
      id: 2,
      title: 'Video: Dấu hiệu nhận biết sử dụng chất kích thích',
      description: 'Series video giáo dục về các dấu hiệu cảnh báo và cách can thiệp kịp thời. Được thực hiện bởi các chuyên gia tâm lý hàng đầu.',
      category: 'videos',
      type: 'Video',
      duration: '15 phút',
      views: 8500,
      rating: 4.9,
      date: '2024-05-10',
      author: 'ThS. Trần Thị Bình',
      tags: ['video', 'nhận biết', 'can thiệp'],
      featured: true,
      premium: false
    },
    {
      id: 3,
      title: 'Bộ công cụ Đánh giá Rủi ro Tự động',
      description: 'Công cụ AI tiên tiến giúp đánh giá mức độ rủi ro và đưa ra khuyến nghị phù hợp dựa trên dữ liệu khoa học.',
      category: 'tools',
      type: 'Online Tool',
      interactive: true,
      users: 2400,
      rating: 4.7,
      date: '2024-05-08',
      author: 'PreventionSupport Team',
      tags: ['AI', 'đánh giá', 'tự động'],
      featured: false,
      premium: true
    }
  ]

  const filteredResources = resources.filter(resource => {
    const matchesFilter = activeFilter === 'all' || resource.category === activeFilter
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date)
      case 'popular':
        return (b.downloads || b.views || b.users || 0) - (a.downloads || a.views || a.users || 0)
      case 'rating':
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const handleResourceClick = () => {
    if (!isLoggedIn) {
      setShowAuthPopup(true)
    } else {
      // Handle download/view for logged in users
      console.log('Downloading resource...')
    }
  }

  const handleSignupRedirect = () => {
    setShowAuthPopup(false)
    navigate("/register")
  }

  const ResourceCard = ({ resource }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-sky-500/30 transition-all duration-300 group">
      {resource.featured && (
        <div className="flex items-center gap-2 mb-3">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-xs font-medium text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full">
            Tài nguyên nổi bật
          </span>
        </div>
      )}
      
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-12 h-12 bg-sky-500/20 rounded-lg flex items-center justify-center">
          {resource.type === 'PDF' && <FileText className="h-6 w-6 text-sky-400" />}
          {resource.type === 'Video' && <Video className="h-6 w-6 text-sky-400" />}
          {resource.type === 'Online Tool' && <Download className="h-6 w-6 text-sky-400" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-sky-400 transition-colors">
            {resource.title}
          </h3>
          <p className="text-slate-400 text-sm mb-3 line-clamp-3">
            {resource.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span>{resource.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(resource.date).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
        <div className="text-slate-500">
          {resource.downloads && `${resource.downloads} lượt tải`}
          {resource.views && `${resource.views} lượt xem`}
          {resource.users && `${resource.users} người dùng`}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-400">
          Tác giả: {resource.author}
        </div>
        <button
          onClick={handleResourceClick}
          className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          {resource.type === 'Video' ? <Eye className="h-4 w-4" /> : <Download className="h-4 w-4" />}
          {resource.type === 'Video' ? 'Xem' : 'Tải xuống'}
        </button>
      </div>
    </div>
  )

  // Auth Popup Component
  const AuthPopup = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl max-w-md w-full p-8 border border-slate-700 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="w-8 h-8 bg-sky-500/20 rounded-lg flex items-center justify-center">
            <Lock className="h-5 w-5 text-sky-400" />
          </div>
          <button 
            onClick={() => setShowAuthPopup(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">
          Bạn muốn xem thêm?
        </h2>
        
        <p className="text-slate-300 mb-6">
          Để truy cập đầy đủ tài nguyên và tải xuống không giới hạn, vui lòng đăng ký tài khoản miễn phí.
        </p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-slate-300">
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
            <span>Truy cập tất cả tài liệu</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
            <span>Tải xuống không giới hạn</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
            <span>Cập nhật tài nguyên mới</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleSignupRedirect}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            Đăng ký ngay
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setShowAuthPopup(false)}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Để sau
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-slate-800/80 backdrop-blur-sm shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate("/")} 
              className="text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Trang chủ
            </button>
            <span className="text-slate-500">/</span>
            <span className="text-slate-200 font-medium">Tài nguyên</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Trung tâm <span className="text-sky-400">Tài nguyên</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Khám phá bộ sưu tập phong phú các tài liệu, video, công cụ và tài nguyên cộng đồng 
            để hỗ trợ hiệu quả trong công tác phòng chống tệ nạn xã hội.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <div className="text-3xl font-bold text-sky-400 mb-2">24</div>
              <div className="text-slate-300">Tài nguyên</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <div className="text-3xl font-bold text-green-400 mb-2">12K+</div>
              <div className="text-slate-300">Lượt tải</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <div className="text-3xl font-bold text-orange-400 mb-2">3.2K</div>
              <div className="text-slate-300">Thành viên</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <div className="text-3xl font-bold text-purple-400 mb-2">4.8</div>
              <div className="text-slate-300">Đánh giá TB</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5 text-sky-400" />
                Bộ lọc
              </h3>
              
              <div className="space-y-3">
                {resourceCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      activeFilter === category.id
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : 'text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <category.icon className="h-4 w-4" />
                      <span>{category.name}</span>
                    </div>
                    <span className="text-sm">{category.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tài nguyên, từ khóa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-sky-500/50"
                />
              </div>
            </div>

            {/* Results */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-slate-300">
                Tìm thấy <span className="font-semibold text-white">{sortedResources.length}</span> tài nguyên
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-800/50 border border-slate-700/50 text-white rounded-lg px-3 py-2"
              >
                <option value="newest">Mới nhất</option>
                <option value="popular">Phổ biến nhất</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>

            {/* Resources Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {sortedResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Popup */}
      {showAuthPopup && <AuthPopup />}
    </div>
  )
}

export default ResourcesPage