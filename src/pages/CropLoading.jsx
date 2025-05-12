import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CropLoading.css";

export default function Loading() {
  const navigate = useNavigate();
  const location = useLocation();
  const { region, year } = location.state || {};

  const [error, setError] = useState(false);

  useEffect(() => {
    if (!region || !year) {
      setError(true);
      return;
    }

    const timer = setTimeout(() => {
      const isDataAvailable = true;

      if (isDataAvailable) {
        navigate("/crop-result", { state: { region, year } });
      } else {
        setError(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, region, year]);

  if (error) {
    return (
      <div className="error-container">
        <p>추천 결과를 불러오지 못했습니다.</p>
        <button onClick={() => navigate("recommend-crop")}>
          처음으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">
        추천 작물 리스트를 생성 중입니다. 잠시만 기다려주세요!
      </p>
    </div>
  );
}
