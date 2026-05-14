export const getCachedProducts = () => {
  const cache = JSON.parse(localStorage.getItem('products_cache'))
  if (!cache) return null
  return Date.now() - cache.timestamp < 300000 ? cache.data : null
}

export const setCachedProducts = (data) => {
  localStorage.setItem('products_cache', JSON.stringify({ data, timestamp: Date.now() }))
}

export const updateSearchCache = (query) => {
  let searches = JSON.parse(localStorage.getItem('searches')) || []
  searches = [query, ...searches.filter(q => q !== query)].slice(0, 3)
  localStorage.setItem('searches', JSON.stringify(searches))
}
