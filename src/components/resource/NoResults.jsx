import { Search } from 'lucide-react'

const NoResults = ({ onClearFilters }) => {
  return (
    <div className="text-center py-12 bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50">
      <div className="text-slate-500 mb-4">
        <Search className="h-16 w-16 mx-auto" />
      </div>
      <h3 className="text-xl font-medium text-white mb-2">Không tìm thấy tài nguyên</h3>
      <p className="text-slate-400 mb-4">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc khác.</p>
      <button
        onClick={onClearFilters}
        className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
      >
        Xóa bộ lọc
      </button>
    </div>
  )
}

export default NoResults
