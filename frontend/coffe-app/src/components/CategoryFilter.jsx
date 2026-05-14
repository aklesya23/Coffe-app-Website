export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="category-filter">
      {categories.map(category => (
        <button key={category} className={`category-btn ${selectedCategory === category ? 'active' : ''}`} onClick={() => onCategoryChange(category)}>
          {category}
        </button>
      ))}
    </div>
  )
}
