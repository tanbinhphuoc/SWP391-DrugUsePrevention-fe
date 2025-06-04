import { Calendar, Download, ExternalLink, Eye, Star, Video, FileText, BookOpen, Users } from 'lucide-react'

const ResourceCard = ({ resource }) => {
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

  const getStatDisplay = () => {
    if (resource.downloads) return `${resource.downloads} lượt tải`
    if (resource.views) return `${resource.views} lượt xem`
    if (resource.users) return `${resource.users} người dùng`
    if (resource.members) return `${resource.members} thành viên`
    if (resource.students) return `${resource.students} học viên`
    return ''
  }

  return (
    <div className={`bg-slate-800/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-700/50 hover:border-slate-600/50 ${resource.featured ? 'ring-2 ring-sky-500/30' : ''}`}>
      {resource.featured && (
        <div className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-4 py-2 text-sm font-medium flex items-center gap-2">
          <Star className="h-4 w-4" />
          Tài nguyên nổi bật
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-500/20 rounded-lg text-sky-400">
              {getResourceIcon(resource.type)}
            </div>
            <div>
              <span className="text-sm font-medium text-sky-400">{resource.type}</span>
              {resource.premium && (
                <span className="ml-2 text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">Premium</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium text-slate-300">{resource.rating}</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {resource.title}
        </h3>
        <p className="text-slate-300 text-sm mb-4 line-clamp-3">
          {resource.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {resource.tags.map((tag, index) => (
            <span key={index} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {/* Meta info */}
        <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(resource.date)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {getStatDisplay()}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">bởi {resource.author}</span>
          <button className="bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center gap-2">
            {resource.interactive ? 'Sử dụng ngay' : resource.premium ? 'Xem chi tiết' : 'Tải xuống'}
            {resource.interactive ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResourceCard
