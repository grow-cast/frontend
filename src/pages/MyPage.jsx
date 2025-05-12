import "./MyPage.css";
import { useEffect, useState } from "react";
import { getWeather } from "../utils/weatherAPI";
import { getFormattedDate } from "../utils/dateUtils";

export default function MyPage() {
  const today = getFormattedDate();
  const [weather, setWeather] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true); // 날씨 로딩 상태

  const [crops, setCrops] = useState([]);
  const [showAllCrops, setShowAllCrops] = useState(false);

  const [recommendations, setRecommendations] = useState([]);
  const [showAllRecs, setShowAllRecs] = useState(false);

  const [pestResults, setPestResults] = useState([]);
  const [showAllPests, setShowAllPests] = useState(false);

  useEffect(() => {
    // 날씨 정보 로딩
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await getWeather(
            position.coords.latitude,
            position.coords.longitude
          );
          setWeather(data);
          setIsWeatherLoading(false); // 날씨 정보 로딩 완료
        } catch (err) {
          console.error("날씨 로드 실패:", err);
          setIsWeatherLoading(false);
        }
      },
      (err) => {
        console.error("위치 정보 접근 실패:", err);
        setIsWeatherLoading(false);
      }
    );

    // 로컬스토리지에서 데이터 불러오기
    const storedCrops = JSON.parse(localStorage.getItem("crops")) || []; // 로컬스토리지에서 가져오고 없으면 빈 배열로 초기화
    setCrops(storedCrops);

    const storedRecs =
      JSON.parse(localStorage.getItem("cropRecommendations")) || [];
    setRecommendations(storedRecs);

    const storedPests =
      JSON.parse(localStorage.getItem("pestPredictions")) || [];
    setPestResults(storedPests);
  }, []);

  return (
    <div className="mypage-container">
      {/* 날짜 + 날씨 */}
      <div className="weather-box">
        <p className="date-text">{today}</p>
        {isWeatherLoading ? (
          <p>날씨 정보를 불러오는 중...</p> // 로딩 중 메시지
        ) : weather ? (
          <div className="weather-info">
            <p>날씨: {weather.weather[0].description}</p>
            <p>기온: {weather.main.temp}°C</p>
            <p>습도: {weather.main.humidity}%</p>
            <p>풍속: {weather.wind.speed} m/s</p>
          </div>
        ) : (
          <p>날씨 정보를 불러오는 데 실패했습니다.</p> // 에러 처리
        )}
      </div>

      {/* 등록 작물 */}
      {/* 오른쪽: 작물, 추천, 병해충 */}
      <div className="content-box">
        <div className="section-box">
          <div className="section-title">내 작물 관리</div>
          {(showAllCrops ? crops : crops.slice(0, 1)).map((crop, index) => (
            <div key={index} className="crop-card">
              {crop.image && (
                <img
                  src={crop.image}
                  alt={`${crop.name} 이미지`}
                  className="crop-image"
                />
              )}
              <div className="crop-info">
                <p>작물 이름: {crop.name}</p>
                <p>심은 날짜: {crop.plantingDate}</p>
                <p>수확 예정일: {crop.harvestDate}</p>
              </div>
            </div>
          ))}

          {crops.length > 1 && (
            <button onClick={() => setShowAllCrops(!showAllCrops)}>
              {showAllCrops ? "접기" : "더보기"}
            </button>
          )}
        </div>

        {/* 추천 작물 */}
        <div className="section-box">
          <div className="section-title">내 추천 결과 보기</div>
          {(showAllRecs ? recommendations : recommendations.slice(0, 1)).map(
            (rec, index) => (
              <div key={index} className="recommendation-card">
                <p>추천 작물1: {rec.crops?.[0]?.name || "작물 없음"}</p>
                <p>추천 작물2: {rec.crops?.[1]?.name || "작물 없음"}</p>
                <p>추천 작물3: {rec.crops?.[2]?.name || "작물 없음"}</p>
                <p>추천 지역: {rec.region}</p>
                <p>연도: {rec.year}</p>
              </div>
            )
          )}
          {recommendations.length > 1 && (
            <button onClick={() => setShowAllRecs(!showAllRecs)}>
              {showAllRecs ? "접기" : "더보기"}
            </button>
          )}
        </div>

        {/* 병해충 예측 결과 */}
        <div className="section-box">
          <div className="section-title">내 작물 병해충 예측 보기</div>
          {(showAllPests ? pestResults : pestResults.slice(0, 1)).map(
            (pest, index) => (
              <div key={index} className="pest-card">
                <p>작물: {pest.crop}</p>
                <p>예측 병해충: {pest.prediction}</p>
                <p>예측 월: {pest.month}</p>
              </div>
            )
          )}
          {pestResults.length > 1 && (
            <button onClick={() => setShowAllPests(!showAllPests)}>
              {showAllPests ? "접기" : "더보기"}
            </button>
          )}
        </div>
      </div>
      <div className="side-space" />
    </div>
  );
}
