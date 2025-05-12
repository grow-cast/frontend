// Home.js
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getWeather } from "../utils/weatherAPI";
import { getFormattedDate } from "../utils/dateUtils";

export default function Home() {
  const navigate = useNavigate();
  const today = getFormattedDate();
  const [weather, setWeather] = useState(null);
  const [crops, setCrops] = useState(() => {
    const stored = localStorage.getItem("crops");
    return stored ? JSON.parse(stored) : [];
  });

  // 삭제 함수
  const handleDelete = (index) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    const updated = crops.filter((_, i) => i !== index);
    setCrops(updated);
    localStorage.setItem("crops", JSON.stringify(updated));
  };

  // 수정 함수
  const handleEdit = (index) => {
    const cropToEdit = crops[index];
    localStorage.setItem("editCrop", JSON.stringify({ ...cropToEdit, index }));
    navigate("/register-crop");
  };

  useEffect(() => {
    // 현재 위치로 날씨 정보 가져오기
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const data = await getWeather(latitude, longitude);
          setWeather(data);
        } catch (error) {
          console.error("날씨 로드 실패:", error);
        }
      },
      (error) => {
        console.error("위치 정보 접근 실패:", error);
      }
    );

    // 로컬스토리지에서 작물 목록 불러오기
    const storedCrops = JSON.parse(localStorage.getItem("crops")) || [];
    setCrops(storedCrops); // 상태 업데이트
  }, []); // 컴포넌트가 마운트될 때마다 실행

  return (
    <div className="home-container">
      {/* 왼쪽: 날씨 정보 */}
      <div className="weather-box">
        <p className="date-text">{today}</p>
        {weather ? (
          <div className="weather-info">
            <p>날씨: {weather.weather[0].description}</p>
            <p>기온: {weather.main.temp}°C</p>
            <p>습도: {weather.main.humidity}%</p>
            <p>풍속: {weather.wind.speed} m/s</p>
          </div>
        ) : (
          <p>날씨 정보를 불러오는 중...</p>
        )}
      </div>

      {/* 중앙: 작물 리스트 */}
      <div className="crop-list">
        <div className="crop-list-title-wrapper">
          <div className="crop-list-title">키우고 있는 작물 리스트</div>
          <div className="add-crop" onClick={() => navigate("/register-crop")}>
            <div className="plus-icon">+</div>
          </div>
        </div>

        {/* 등록된 작물 리스트 */}
        {crops.length > 0 ? (
          crops.map((crop, index) => (
            <div className="crop-card" key={index}>
              <div className="crop-card-content">
                {crop.image ? (
                  <img
                    src={crop.image}
                    alt={`${crop.name} 이미지`}
                    className="crop-image"
                  />
                ) : (
                  <div className="crop-image-placeholder" />
                )}
                <div className="crop-text">
                  <p>작물 이름: {crop.name}</p>
                  <p>심은 날짜: {crop.plantingDate}</p>
                  <p>수확 예정일: {crop.harvestDate}</p>
                  <div className="crop-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(index)}
                    >
                      수정
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(index)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ marginTop: "10px", color: "#888" }}>
            등록된 작물이 없습니다.
          </p>
        )}
      </div>

      {/* 오른쪽: 병해충 */}
      <div className="pest-box">
        <div className="pest-title">월별 병해충 리스트</div>
        <div className="pest-info">예측된 병해충이 없습니다.</div>
      </div>
    </div>
  );
}
