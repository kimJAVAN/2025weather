import React from "react";
import './WeatherCard.css';

// ✅ 계절 판별
const getSeason = (month) => {
  if ([12, 1, 2].includes(month)) return "winter";
  if ([3, 4, 5].includes(month)) return "spring";
  if ([6, 7, 8].includes(month)) return "summer";
  return "autumn";
};

// ✅ 배경 이미지 선택
const getBackground = (season, sky, pty) => {
  if (season === "winter" && pty) return "/image/snow3.jpg";
  if (season === "winter") return "/image/snow10.jpg";

  if (season === "spring") {
    if (sky === "Clear") return "/image/spring3.jpg";
    if (["Rain", "Drizzle"].includes(sky)) return "/image/spring4.jpg";
    return "/image/spring3.JPG";
  }

  if (season === "summer") {
    if (sky === "Clear") return "/image/cloud4.jpg";
    if (["Rain", "Drizzle"].includes(sky)) return "/image/rain10.jpg";
    return "/image/cloud4.jpg";
  }

  if (season === "autumn") {
    if (sky === "Clear") return "/image/cloud4.jpg";
    if (["Rain", "Drizzle"].includes(sky)) return "/image/rain10.jpg";
    return "/image/cloud4.jpg";
  }

  return "/image/default_bg.png";
};

// ✅ 사람(옷차림) 선택
const getPersonImage = (temp) => {
  if (temp >= 28) return "/image/summer1.png";
  if (temp >= 23) return "/image/summer5.png";
  if (temp >= 20) return "/image/summer9.png";
  if (temp >= 17) return "/image/spring6.png";
  if (temp >= 12) return "/image/fall1.png";
  if (temp >= 9) return "/image/winter4.png";
  if (temp >= 5) return "/image/winter6.png";
  return "/image/winter1.png";
};

// ✅ 계절 이미지 선택
const getSeasonImage = (season) => {
  switch (season) {
    case "spring": return "/image/spring.png";
    case "summer": return "/image/summer0.png";
    case "autumn": return "/image/fall3.png";
    case "winter": return "/image/winter9.png";
    default: return "/image/summer8.png";
  }
};

// ✅ 날씨 아이콘 선택
const getWeatherIcon = (weather, icon, windSpeed) => {
  if (windSpeed >= 17) return "/image/weatherIcon/typhoon.png";

  switch (weather) {
    case "Clear":
      return icon.includes("d") ? "/image/sun2.png" : "/image/star2.png";
    case "Clouds":
      if (icon.includes("d")) return "/image/sun3.png";
      if (icon.includes("n")) return "/image/cloud3.png";
      return "/image/cloud2.png";
    case "Rain": return "/image/rain7.png";
    case "Drizzle": return "/image/rain6.png";
    case "Snow": return "/image/snow9.png";
    case "Thunderstorm": return "/image/storm2.png";
    default: return "/image/cloud2.png";
  }
};

export default function WeatherCard({ data, favorites, toggleFavorite }) {
  const { main, weather, wind } = data;

  const cityName = data.name

  // ✅ 현재 온도
  const temp = main?.temp;

  // ✅ 하루 최저/최고 (기존 구조 유지, main.temp_min/max 대신 data.daily[0].temp.min/max로 가정)
  const min = data.daily?.[0]?.temp?.min ?? main?.temp_min;
  const max = data.daily?.[0]?.temp?.max ?? main?.temp_max;

  const sky = weather?.[0]?.main;
  const icon = weather?.[0]?.icon;
  const windSpeed = wind?.speed || 0;
  const pty = data.rain || 0;

  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const year = now.getFullYear().toString().slice(-2);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdays[now.getDay()];
  const season = getSeason(month);

  // ✅ 이미지 선택
  const background = getBackground(season, sky, pty);
  const seasonImage = getSeasonImage(season);
  const person = getPersonImage(temp);
  const weatherIcon = getWeatherIcon(sky, icon, windSpeed);

  // ✅ 일교차 계산 및 조언
  const gap = Math.abs(max - min);
  const gapAdvice = gap >= 10 ? "오늘은 일교차가 크니 얇은 옷을 여러 겹 챙기세요." : "";

  // ✅ 우산 조언
  const umbrellaAdvice =
    ["Rain", "Drizzle", "Snow", "Thunderstorm"].includes(sky) || windSpeed >= 17
      ? "오늘은 우산을 챙기세요 ☔"
      : "";

  // ✅ 옷 추천 문구
  const clothing =
    temp >= 28
      ? "민소매, 반팔, 반바지"
      : temp >= 23
      ? "반팔, 얇은셔츠, 반바지"
      : temp >= 20
      ? "블라우스, 긴팔티, 면바지"
      : temp >= 17
      ? "얇은 가디건, 니트, 맨투맨, 후드"
      : temp >= 12
      ? "자켓, 가디건, 청자켓, 스타킹, 청바지"
      : temp >= 9
      ? "트렌치코트, 야상, 점퍼, 스타킹, 기모바지"
      : temp >= 5
      ? "울 코트, 히트텍, 가죽옷, 기모"
      : "패딩, 두꺼운 코트, 누빔옷, 기모, 목도리";

  return (
    <div className="main-wea-card bg-white shadow-md rounded-xl p-6 w-full max-w-md">
      <div className="today-text">
        <h2 className=" text-xl font-semibold mb-2">{`${year} / ${month} / ${day} (${weekday}) // ${data.name} 날씨`}</h2>
        <div className="favorite-div mt-2 flex items-center gap-2">
          <button
            className={`fav-btn ${favorites.includes(cityName) ? "bg-yellow-300" : "bg-white"}`}
            onClick={() => toggleFavorite(cityName)}
          >
            {favorites.includes(cityName) ? "★ 즐겨찾기" : "☆ 즐겨찾기"}
          </button>
        </div>
      </div>

      {/* ✅ 날씨 아이콘 + 현재 온도 */}
      <div className="todays-wrap flex items-center justify-end mb-2">
        <div className="left-today-text-wrap flex items-center">
          <div className="icon-wrapper flex flex-col items-center">
            <img src={`${process.env.PUBLIC_URL}${weatherIcon}`} alt="날씨 아이콘" className="icon-img w-12 object-contain" />
            <p>{weather?.[0]?.description}</p>
          </div>
          <span className="temp-text ml-2 text-sm text-gray-600">{temp}°C</span>
        </div>
        <div className="ml-4">
          <p>최저 {min}°C <br /> 최고 {max}°C</p>
        </div>
      </div>

      {/* ✅ 이미지 (배경 / 계절 / 사람) */}
      <div className="wea-img-wrap relative flex justify-center my-4 w-40 h-40">
        <img src={`${process.env.PUBLIC_URL}${background}`} alt="배경 이미지" className="back-img absolute inset-0 w-full h-full object-contain" />
        <img src={`${process.env.PUBLIC_URL}${seasonImage}`} alt="계절 이미지" className="school-img absolute inset-0 w-full h-full object-contain opacity-60" />
        <img src={`${process.env.PUBLIC_URL}${person}`} alt="사람 이미지" className="hum-img absolute bottom-0 left-1/2 -translate-x-1/2 w-24 object-contain" />

        {/* ✅ 조언 */}
        <div className="mal-div mt-4 bg-sky-50 p-3 rounded-lg">
          <p className="cloth-text">👕 오늘은 <b>{clothing}</b> 추천!</p>
          {umbrellaAdvice && <p>☔ {umbrellaAdvice}</p>}
          {gapAdvice && <p>⚠️ {gapAdvice}</p>}
        </div>
      </div>
    </div>
  );
}
