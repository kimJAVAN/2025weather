import { useEffect, useState } from "react"
import SearchBar from "../Search/Search.js"
import WeatherCard from "../WeatherCard/WeatherCard.js"
import Loading from "../Loading/Loading.js"

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY

function App() {

  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ✅ 내 위치 기반 날씨 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          console.log("위치 가져오기 성공 ✅", pos)
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
      console.error("이 브라우저는 위치 기능을 지원하지 않습니다.")
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
      console.log("API 응답1:", data)

      setWeather(data)
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
      console.log("API 응답2:", data)

      if (data.cod === "404") {
        setError("도시를 찾을 수 없습니다.")
        setWeather(null)
      } else {
        setWeather(data)
        setError(null)
      }
    } catch (e) {
      setError("데이터를 불러오는 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">🌤️ 날씨 어시스턴트</h1>

      <SearchBar onSearch={fetchWeatherByCity} />

      {loading && <Loading />}
      {error && <p className="text-red-500">{error}</p>}
      
      {weather && weather.weather && <WeatherCard data={weather} />}
    </div>
  )
}

export default App
