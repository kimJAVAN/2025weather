import { useState } from "react"

function SearchBar({ onSearch }) {
  const [city, setCity] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (city.trim() === "") return
    onSearch(city)
    setCity("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="도시 이름 입력 (예: Seoul)"
        className="border rounded-lg px-3 py-2"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 rounded-lg">
        검색
      </button>
    </form>
  )
}

export default SearchBar
