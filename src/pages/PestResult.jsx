import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./PestResult.css";

export default function PestResult() {
  const location = useLocation();
  const { crop, year, month, sido, sigungu } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (!crop || !year || !month || !sido) return;

    const newResult = {
      crop,
      year,
      month,
      sido,
      sigungu: sigungu || "",
      prediction: "AI 분석 결과 (추후 교체)",
      date: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("pestPredictions")) || [];
    const isDuplicate = existing.some(
      (item) =>
        item.crop === crop &&
        item.year === year &&
        item.month === month &&
        item.sido === sido &&
        item.sigungu === sigungu
    );
    if (isDuplicate) return;

    const updated = [newResult, ...existing];
    localStorage.setItem("pestPredictions", JSON.stringify(updated));
  }, [crop, year, month, sido, sigungu]);

  const pests = [
    {
      name: "덩굴쪼김병",
      level: "위험",
      description:
        "고온다습한 5월 말부터 6월 중순에 발생 가능성이 높습니다.\n\n정식 전 토양 소독과 배수 관리, 병든 식물 즉시 제거가 필요합니다.",
      color: "danger",
    },
    {
      name: "무름병",
      level: "보통",
      description:
        "습도가 높은 환경에서 줄기와 잎이 물러지는 증상이 5월 초부터 나타날 수 있습니다.\n\n건전한 씨고구마 선별, 저장 중 관리, 재배 전 예방조치가 필요합니다.",
      color: "warning",
    },
    {
      name: "밤나방류",
      level: "보통",
      description:
        "5월부터 밤고구마 잎과 줄기를 갉아먹는 해충 피해가 예상됩니다.\n\n야간 유인등 설치 및 등록 살충제 사용으로 방제해야 합니다.",
      color: "warning",
    },
  ];

  return (
    <div className="pest-result-container">
      <h2 className="pest-title">{month}의 병해충 리스트</h2>

      <div className="pest-card-wrapper">
        {pests.map((pest, index) => (
          <div className="pest-card" key={index}>
            <h3 className="pest-name">{pest.name}</h3>
            <p className="pest-latin">(Stem Rot)</p>
            <span className={`pest-level ${pest.color}`}>{pest.level}</span>
            <p className="pest-description">{pest.description}</p>
          </div>
        ))}
      </div>

      <button className="pest-button" onClick={() => navigate("/pest-check")}>
        다시 조회하기
      </button>
    </div>
  );
}
