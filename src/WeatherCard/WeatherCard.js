function WeatherCard({ data }) {
  if (!data || !data.weather || data.weather.length === 0) {
    return <p>날씨 데이터를 불러올 수 없습니다.</p>
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-80 text-center">
      <h2 className="text-xl font-bold">{data.name}</h2>
      <p className="text-lg">{data.weather[0].description}</p>
      <img
        src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
        alt="날씨 아이콘"
        className="mx-auto"
      />
      <p className="text-3xl font-bold">{Math.round(data.main.temp)}°C</p>
      <p>체감: {Math.round(data.main.feels_like)}°C</p>
      <p>습도: {data.main.humidity}% | 풍속: {data.wind.speed}m/s</p>
    </div>
  )
}


export default WeatherCard
