import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "./CropResult.css";
import { REGION_CODE_MAP } from "../constants/regionCodes";

export default function CropResult() {
  const location = useLocation();
  const { region, year } = location.state || {};
  const [crops, setCrops] = useState([]);
  const [scenarioText, setScenarioText] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCropRecommendations = useCallback(async () => {
    if (!region || !year) {
      setError("지역과 년도 정보가 없습니다.");
      return;
    }

    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum)) {
      setError("년도 정보가 올바르지 않습니다.");
      return;
    }

    const regionCode = REGION_CODE_MAP[region];
    if (!regionCode) {
      setError(`선택한 지역(${region})에 대한 코드가 존재하지 않습니다.`);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://34.47.85.36:3030/cropsRecommend",
        {
          regionCode: regionCode.toString(),
          year: yearNum,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const recommended = response.data.cropsRecommendation.recommended.map((item) => ({
        name: item.recommendedCropName,
        description: item.reason,
      }));

      setScenarioText(response.data.scenario.summary);
      setNote(response.data.scenario.recommendationNote);
      setCrops(recommended);
    } catch (err) {
      if (err.response) {
        setError(
          `(${err.response.status}) 서버 응답 오류: ${
            err.response.data?.message || "알 수 없는 에러"
          }`
        );
      } else if (err.request) {
        setError("서버로부터 응답을 받지 못했습니다. 네트워크를 확인하세요.");
      } else {
        setError("요청 중 오류 발생: " + err.message);
      }
    }
  }, [region, year]);

  useEffect(() => {
    if (region && year) {
      fetchCropRecommendations();
    }
  }, [region, year, fetchCropRecommendations]);

  useEffect(() => {
    if (crops.length > 0) {
      const newResult = {
        region,
        year,
        crops,
        date: new Date().toISOString(),
      };

      const existing =
        JSON.parse(localStorage.getItem("cropRecommendations")) || [];

      const isDuplicate = existing.some(
        (item) => item.region === region && item.year === year
      );
      if (isDuplicate) return;

      const updated = [newResult, ...existing];
      localStorage.setItem("cropRecommendations", JSON.stringify(updated));
    }
  }, [region, year, crops]);

  return (
    <div className="result-container">
      {error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => navigate("/recommend-crop")}>
            처음으로 돌아가기
          </button>
        </div>
      ) : crops.length === 0 ? (
        <div className="loading-text">
          추천 작물 정보를 불러오는 중입니다...
        </div>
      ) : (
        <div className="result-grid">
          {/* 좌측 영역 */}
          <div className="left-box">
            <h3>선택 지역 및 년도</h3>
            <div className="region-year-box">
              <div className="info-box">
                <div className="info-title">입력 지역</div>
                <div className="info-value">{region}</div>
              </div>
              <div className="info-box">
                <div className="info-title">입력 년도</div>
                <div className="info-value">{year}</div>
              </div>
            </div>
            <h3>기후 시나리오</h3>
            <div className="scenario-box">
              <p>{scenarioText}</p>
              <p className="arrow">↓</p>
              <p>{note}</p>
            </div>
          </div>

          {/* 우측 영역 */}
          <div className="right-box">
            <h3>추천 작물 리스트</h3>
            {crops.map((crop, index) => (
              <div key={index} className="crop-box">
                <strong>{crop.name}</strong>
                <p>{crop.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <button className="retry-btn" onClick={() => navigate("/recommend-crop")}>
        다시 조회하기
      </button>
    </div>
  );
}
