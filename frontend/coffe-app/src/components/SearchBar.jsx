import { useState, useEffect, useRef } from 'react'

export default function SearchBar({ searchTerm, onSearch }) {
  const [localTerm, setLocalTerm] = useState(searchTerm)
  const debounceRef = useRef(null)
  
  useEffect(() => {
    setLocalTerm(searchTerm)
  }, [searchTerm])
  
  const handleChange = (e) => {
    const value = e.target.value
    setLocalTerm(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onSearch(value), 300)
  }
  
  const handleClear = () => {
    setLocalTerm('')
    onSearch('')
  }
  
  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon"></span>
        <input type="text" placeholder="Search products by name..." value={localTerm} onChange={handleChange} className="search-input" />
        {localTerm && <button onClick={handleClear} className="clear-btn">✕</button>}
      </div>
    </div>
  )
}
