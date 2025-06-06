const FilterSection = ({ categories, selectedCategory, setSelectedCategory }) => (
  <div className="flex flex-wrap justify-center gap-4 mb-12">
    {categories.map((category) => (
      <button
        key={category.id}
        onClick={() => setSelectedCategory(category.id)}
        className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
          selectedCategory === category.id
            ? 'bg-blue-600 text-white shadow-lg transform scale-105'
            : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
        }`}
      >
        {category.name} ({category.count})
      </button>
    ))}
  </div>
);

export default FilterSection;
