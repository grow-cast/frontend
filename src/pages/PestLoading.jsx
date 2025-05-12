import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./PestLoading.css";

export default function PestLoading() {
  const navigate = useNavigate();
  const location = useLocation();
  const { crop, year, month, sido, sigungu } = location.state || {};

  const [error, setError] = useState(false);

  useEffect(() => {
    if (!crop || !year || !month || !sido) {
      setError(true);
      return;
    }

    const timer = setTimeout(() => {
      const isDataAvailable = true;

      if (isDataAvailable) {
        navigate("/pest-result", {
          state: { crop, year, month, sido, sigungu },
        });
      } else {
        setError(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, crop, year, month, sido, sigungu]);

  if (error) {
    return (
      <div className="error-container">
        <p>병해충 예측 결과를 불러오지 못했습니다.</p>
        <button onClick={() => navigate("/pest-check")}>
          처음으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">
        병해충 예측 결과를 생성 중입니다. 잠시만 기다려주세요!
      </p>
    </div>
  );
}
