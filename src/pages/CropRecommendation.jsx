// src/pages/CropRecommendation.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { REGION_LIST } from "../constants/regions";
import { YEAR_LIST } from "../constants/year";
import "./CropRecommendation.css";

export default function CropRecommendation() {
  const [region, setRegion] = useState("");
  const [year, setYear] = useState("");
  const navigate = useNavigate();

  const handleRecommend = () => {
    if (region && year) {
      // 결과 페이지로 지역/년도 값 전달
      navigate("/loading", { state: { region, year } });
    }
  };

  return (
    <div className="recommendation-container">
      <div className="recommendation-box">
        <h2>지역</h2>
        <p>농사 지을 / 짓고 있는 위치를 선택해주세요!</p>
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="">-- 선택하세요 --</option>
          {REGION_LIST.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <h2>년도</h2>
        <p>예측하고자 하는 년도를 선택해주세요!</p>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">-- 선택하세요 --</option>
          {YEAR_LIST.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <button
          className="recommend-btn"
          onClick={handleRecommend}
          disabled={!region || !year}
        >
          추천받기
        </button>
      </div>
    </div>
  );
}
