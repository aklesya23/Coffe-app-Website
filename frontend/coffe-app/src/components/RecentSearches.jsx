import { useCache } from '../context/CacheContext'

export default function RecentSearches({ onSearchSelect }) {
  const { recentSearches } = useCache()
  if (recentSearches.length === 0) return null
  
  return (
    <div className="recent-searches">
      <span className="recent-label">Recent:</span>
      {recentSearches.map(search => (
        <button key={search} className="recent-search-btn" onClick={() => onSearchSelect(search)}>
          {search}
        </button>
      ))}
    </div>
  )
}
