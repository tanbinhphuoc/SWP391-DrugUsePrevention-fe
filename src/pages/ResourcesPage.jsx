import { useState } from 'react'
import { Download, ExternalLink, BookOpen, Video, FileText, Users, Search, Filter, ArrowLeft, Star, Calendar, Eye } from 'lucide-react'
import ResourceCard from '../components/features/resource/ResourceCard'
import ResourceFilter from '../components/features/resource/ResourceFilter'
import ResourceSearch from '../components/features/resource/ResourceSearch'
import ResourceStats from '../components/features/resource/ResourceStats'
import NoResults from '../components/features/resource/NoResults'
import CTASection from '../components/features/resource/CTASection'

const ResourcesPage = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')

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
    },
    {
      id: 4,
      title: 'Cẩm nang Hỗ trợ Khủng hoảng 24/7',
      description: 'Hướng dẫn xử lý tình huống khẩn cấp và danh sách liên hệ hỗ trợ toàn quốc. Cập nhật thường xuyên với thông tin mới nhất.',
      category: 'guides',
      type: 'PDF',
      size: '1.8 MB',
      downloads: 950,
      rating: 4.6,
      date: '2024-05-03',
      author: 'Tổ chức Y tế Thế giới',
      tags: ['khẩn cấp', 'hỗ trợ', '24/7'],
      featured: false,
      premium: false
    },
    {
      id: 5,
      title: 'Diễn đàn Cộng đồng Hỗ trợ Lẫn nhau',
      description: 'Không gian an toàn để chia sẻ kinh nghiệm, nhận hỗ trợ từ cộng đồng và kết nối với những người có cùng hoàn cảnh.',
      category: 'community',
      type: 'Forum',
      members: 3200,
      posts: 15600,
      rating: 4.5,
      date: '2024-04-28',
      author: 'Community Team',
      tags: ['cộng đồng', 'hỗ trợ', 'chia sẻ'],
      featured: false,
      premium: false
    },
    {
      id: 6,
      title: 'Khóa học: Tâm lý học Phòng chống Tệ nạn',
      description: 'Khóa học trực tuyến chuyên sâu về tâm lý học trong công tác phòng chống tệ nạn xã hội. Có chứng chỉ hoàn thành.',
      category: 'courses',
      type: 'Course',
      lessons: 12,
      duration: '6 giờ',
      students: 890,
      rating: 4.9,
      date: '2024-04-25',
      author: 'PGS.TS Lê Minh Cường',
      tags: ['tâm lý', 'chứng chỉ', 'chuyên sâu'],
      featured: true,
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

  const getResourceIcon = (type) => {
    switch (type) {
      case 'PDF': return <FileText className="h-5 w-5" />
      case 'Video': return <Video className="h-5 w-5" />
      case 'Course': return <BookOpen className="h-5 w-5" />
      case 'Online Tool': return <Download className="h-5 w-5" />
      case 'Forum': return <Users className="h-5 w-5" />
      default: return <BookOpen className="h-5 w-5" />
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const getStatDisplay = (resource) => {
    if (resource.downloads) return `${resource.downloads} lượt tải`
    if (resource.views) return `${resource.views} lượt xem`
    if (resource.users) return `${resource.users} người dùng`
    if (resource.members) return `${resource.members} thành viên`
    if (resource.students) return `${resource.students} học viên`
    return ''
  }

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
              onClick={() => window.location.href = '/'}
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
          <ResourceStats />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <ResourceFilter
              categories={resourceCategories}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Search */}
            <ResourceSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            {/* Results */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-slate-300">
                Tìm thấy <span className="font-semibold text-white">{sortedResources.length}</span> tài nguyên
              </p>
              <div className="text-sm text-slate-400">
                {activeFilter !== 'all' && `Danh mục: ${resourceCategories.find(cat => cat.id === activeFilter)?.name}`}
              </div>
            </div>

            {/* Resources Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {sortedResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>

            {/* No Results */}
            {sortedResources.length === 0 && (
              <NoResults onClearFilters={() => {
                setSearchTerm('')
                setActiveFilter('all')
              }} />
            )}
          </div>
        </div>

        {/* CTA Section */}
        <CTASection />
      </div>
    </div>
  )
}

export default ResourcesPage