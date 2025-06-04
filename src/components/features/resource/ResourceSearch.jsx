import { Search } from 'lucide-react'

const ResourceSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
      <input
        type="text"
        placeholder="Tìm kiếm tài nguyên, từ khóa..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-12 pr-4 py-4 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-lg text-white placeholder-slate-400"
      />
    </div>
  )
}

export default ResourceSearch
