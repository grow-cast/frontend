// src/pages/CropResult.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./CropResult.css";

export default function CropResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { region, year } = location.state || {};

  // 선택된 지역과 연도를 기반으로 동적으로 추천 작물 데이터 생성
  const generateCrops = (region, year) => {
    if (!region || !year) return [];

    // 예시로, 지역과 연도에 따라 추천 작물을 생성
    const crops = [
      {
        name: "고구마",
        description:
          "토양 배수만 잘되면 습기에도 강하며 기온 상승에 따른 수량 증대가 기대됨.",
      },
      {
        name: "옥수수",
        description:
          "고온에서도 잘 자라며 강수량 증가에도 견딜 수 있는 수분 적응력이 높음.",
      },
      {
        name: "팥",
        description:
          "여름철 고온다습 환경에 잘 적응하며 단기간 재배 가능해 기후 리스크 분산에 유리함.",
      },
    ];

    // 이곳에서 지역과 연도에 따른 논리 추가 가능
    return crops;
  };

  // 동적으로 추천 작물 생성
  const crops = generateCrops(region, year);

  // 로컬스토리지에 저장
  useEffect(() => {
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
    if (isDuplicate) return; // 중복이면 저장 안 함

    const updated = [newResult, ...existing];
    localStorage.setItem("cropRecommendations", JSON.stringify(updated));

    console.log("✅ 저장 완료:", updated); // 디버깅 로그
  }, [region, year, crops]);

  const handleRetry = () => {
    navigate("/recommend-crop");
  };

  return (
    <div className="result-container">
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
            <p>
              {year}년 {region}는 온난화로 여름 기온 상승과 강수량 증가가
              예상됩니다.
            </p>
            <p className="arrow">↓</p>
            <p>내습성 있고 수분 관리가 쉬운 작물 선택을 권장합니다.</p>
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

      {/* 버튼 */}
      <div className="retry-wrap">
        <button className="retry-btn" onClick={handleRetry}>
          다시 조회하기
        </button>
      </div>
    </div>
  );
}
