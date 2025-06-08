const ResourceStats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-slate-700/50">
        <div className="text-2xl font-bold text-sky-400">24</div>
        <div className="text-sm text-slate-400">Tài nguyên</div>
      </div>
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-slate-700/50">
        <div className="text-2xl font-bold text-emerald-400">12K+</div>
        <div className="text-sm text-slate-400">Lượt tải</div>
      </div>
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-slate-700/50">
        <div className="text-2xl font-bold text-orange-400">3.2K</div>
        <div className="text-sm text-slate-400">Thành viên</div>
      </div>
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-slate-700/50">
        <div className="text-2xl font-bold text-purple-400">4.8</div>
        <div className="text-sm text-slate-400">Đánh giá TB</div>
      </div>
    </div>
  )
}

export default ResourceStats
