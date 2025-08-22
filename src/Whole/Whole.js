import { useEffect, useState } from "react"
import SearchBar from "../Search/Search.js"
import WeatherCard from "../WeatherCard/WeatherCard.js"
import Loading from "../Loading/Loading.js"
import './Whole.css'

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY

function App() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [recentSearches, setRecentSearches] = useState([])
  const [favorites, setFavorites] = useState([])

  // ✅ 내 위치 기반 날씨 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords
          fetchWeatherByCoords(latitude, longitude)
        },
        (err) => {
          console.error("위치 에러 ❌", err)
          setError("위치 정보를 가져올 수 없습니다. 브라우저 권한을 확인해주세요.")
          setLoading(false)
        }
      )
    } else {
      setError("이 브라우저는 위치 기능을 지원하지 않습니다.")
      setLoading(false)
    }
  }, [])

  // 위도/경도로 날씨 호출
  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true)
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=kr`
      )
      const data = await res.json()
      setWeather(data)
      setError(null)
    } catch (e) {
      setError("데이터를 불러오는 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  // 도시 이름으로 날씨 호출
  const fetchWeatherByCity = async (city) => {
    try {
      setLoading(true)
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=kr`
      )
      const data = await res.json()
      if (data.cod === "404") {
        setError("도시를 찾을 수 없습니다.")
        setWeather(null)
      } else {
        setWeather(data)
        setError(null)

        // ✅ 최근검색 업데이트 (중복 제거, 최대 5개)
        setRecentSearches(prev => {
          const newList = [city, ...prev.filter(c => c !== city)]
          return newList.slice(0, 5)
        })
      }
    } catch (e) {
      setError("데이터를 불러오는 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  // ✅ 즐겨찾기 토글
  const toggleFavorite = (city) => {
    setFavorites(prev =>
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    )
  }

  // ✅ 최근검색 삭제
  const removeRecentSearch = (city) => {
    setRecentSearches(prev => prev.filter(c => c !== city))
  }

  // ✅ 즐겨찾기 삭제
  const removeFavorite = (city) => {
    setFavorites(prev => prev.filter(c => c !== city))
  }


  return (
    <div className="weatherDiv min-h-screen bg-sky-100 flex flex-col items-center p-6">
      <div className="wea-wrapper">
        <div className="search-div">
          <h1 className="main-Text text-2xl font-bold mb-4">🌤️ 다른 도시 날씨는?</h1>
          <SearchBar onSearch={fetchWeatherByCity} />
        </div>

        {loading && <Loading />}
        {error && <p className="text-red-500">{error}</p>}

        {/* ✅ 최근 검색 전체삭제 */}
        {recentSearches.length > 0 && (
          <div className="recent-searches mt-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-and-delete">
                <h2 className="font-semibold">최근 검색</h2>
                <button
                  onClick={() => setRecentSearches([])}
                  className="all-delete text-sm text-red-500 font-bold px-2 py-1 bg-white rounded shadow"
                >
                  전체삭제
                </button>
              </div>
            </div>
            <div className="list-wrap flex gap-2 flex-wrap">
              {recentSearches.map(city => (
                <div key={city} className="list-flex-div flex items-center gap-1">
                  <button
                    onClick={() => fetchWeatherByCity(city)}
                    className="list-btn px-2 py-1 bg-white rounded shadow"
                  >
                    {city}
                  </button>
                  <button
                    onClick={() => removeRecentSearch(city)}
                    className="remove-btn px-1 py-1 text-red-500 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ 즐겨찾기 전체삭제 */}
        {favorites.length > 0 && (
          <div className="favorites-list mt-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-and-delete">
                <h2 className="font-semibold">즐겨찾기</h2>
                <button
                  onClick={() => setFavorites([])}
                  className="all-delete text-sm text-red-500 font-bold px-2 py-1 bg-white rounded shadow"
                >
                  전체삭제
                </button>
              </div>
            </div>
            <div className="list-wrap flex gap-2 flex-wrap">
              {favorites.map(city => (
                <div key={city} className="list-flex-div flex items-center gap-1">
                  <button
                    onClick={() => fetchWeatherByCity(city)}
                    className="list-btn px-2 py-1 bg-yellow-200 rounded shadow"
                  >
                    {city}
                  </button>
                  <button
                    onClick={() => removeFavorite(city)}
                    className="remove-btn px-1 py-1 text-red-500 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}



        {/* <div className="favorite-div mt-2 flex items-center gap-2">
              <button
                className={`px-2 py-1 rounded ${favorites.includes(weather.name) ? "bg-yellow-300" : "bg-white"}`}
                onClick={() => toggleFavorite(weather.name)}
              >
                {favorites.includes(weather.name) ? "★ 즐겨찾기" : "☆ 즐겨찾기"}
              </button>
        </div> */}

        {weather && (
          <>
           {weather && (
              <WeatherCard 
                data={weather} 
                favorites={favorites} 
                toggleFavorite={toggleFavorite} 
              />
            )}

          </>
        )}

      </div>
    </div>
  )
}

export default App
