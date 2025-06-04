import { Filter } from 'lucide-react'

const ResourceFilter = ({ categories, activeFilter, setActiveFilter, sortBy, setSortBy }) => {
  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl shadow-lg p-6 sticky top-24 border border-slate-700/50">
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
        <Filter className="h-5 w-5 text-sky-400" />
        Bộ lọc
      </h3>

      {/* Categories */}
      <div className="space-y-2 mb-6">
        {categories.map((category) => {
          const IconComponent = category.icon
          return (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                activeFilter === category.id
                  ? 'bg-sky-600/20 text-sky-300 border border-sky-500/30'
                  : 'hover:bg-slate-700/50 text-slate-300 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComponent className="h-4 w-4" />
                <span className="font-medium">{category.name}</span>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  activeFilter === category.id
                    ? 'bg-sky-500/20 text-sky-300'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {category.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Sort */}
      <div className="border-t border-slate-700/50 pt-4">
        <h4 className="font-medium text-white mb-3">Sắp xếp theo</h4>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-white"
        >
          <option value="newest">Mới nhất</option>
          <option value="popular">Phổ biến nhất</option>
          <option value="rating">Đánh giá cao nhất</option>
        </select>
      </div>
    </div>
  )
}

export default ResourceFilter
