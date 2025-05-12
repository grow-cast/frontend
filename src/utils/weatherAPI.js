const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export async function getWeather(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`
  );
  if (!response.ok) throw new Error("날씨 정보를 불러오지 못했습니다.");
  return await response.json();
}
