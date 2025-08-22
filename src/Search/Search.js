import { useState } from "react"
import './Search.css'

function SearchBar({ onSearch }) {
  const [city, setCity] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (city.trim() === "") return
    onSearch(city)
    setCity("")
  }

  return (
    <form onSubmit={handleSubmit} className="search-form flex gap-2 mb-4">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="도시 이름 입력 (예: Seoul)"
        className="search-box"
      />
      <button type="submit" className="search-btn">
        검색
      </button>
    </form>
  )
}

export default SearchBar
