import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { REGION_LIST } from "../constants/city";
import { YEAR_LIST } from "../constants/year";
import { MONTH_LIST } from "../constants/month";
import "./PestCheck.css";

export default function PestCheckPage() {
  const navigate = useNavigate();
  const [selectedSido, setSelectedSido] = useState("");
  const [selectedSigungu, setSelectedSigungu] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [crop, setCrop] = useState("");

  const handleSidoChange = (e) => {
    const value = e.target.value;
    setSelectedSido(value);
    setSelectedSigungu("");
  };

  const handleSigunguChange = (e) => {
    setSelectedSigungu(e.target.value);
  };

  const handleSubmit = () => {
    if (
      crop &&
      selectedSido &&
      (selectedSigungu || selectedSido) &&
      year &&
      month
    ) {
      navigate("/pest-loading", {
        state: {
          crop,
          year,
          month,
          sido: selectedSido,
          sigungu: selectedSigungu,
        },
      });
    }
  };

  return (
    <div className="recommendation-container">
      <div className="top-title">
        <h2>병해충 확인</h2>
      </div>
      <div className="recommendation-box">
        <h2>지역</h2>
        <p>농사 지을 지역을 선택해주세요!</p>

        <div className="row">
          <select value={selectedSido} onChange={handleSidoChange}>
            <option value="">시도 선택</option>
            {Object.keys(REGION_LIST).map((sido) => (
              <option key={sido} value={sido}>
                {sido}
              </option>
            ))}
          </select>

          <select
            value={selectedSigungu}
            onChange={handleSigunguChange}
            disabled={!selectedSido || !REGION_LIST[selectedSido].length}
          >
            <option value="">시군구 선택</option>
            {selectedSido &&
              REGION_LIST[selectedSido].length > 0 &&
              REGION_LIST[selectedSido].map((sigungu) => (
                <option key={sigungu} value={sigungu}>
                  {sigungu}
                </option>
              ))}
          </select>
        </div>

        <h2>작물</h2>
        <p>농사 지을/짓고 있는 작물을 입력해주세요!</p>
        <input
          type="text"
          placeholder="작물이름"
          className="highlight-box"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
        />

        <h2>날짜</h2>
        <p>예측하고자 하는 년/월을 선택해주세요!</p>

        <div className="row">
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">연도 선택</option>
            {YEAR_LIST.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="">월 선택</option>
            {MONTH_LIST.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <button
          className="recommend-btn"
          onClick={handleSubmit}
          disabled={
            !selectedSido ||
            !crop ||
            !year ||
            !month ||
            (!selectedSido && selectedSigungu)
          }
        >
          확인하기
        </button>
      </div>
    </div>
  );
}
