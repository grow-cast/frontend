import "./WorkDiaryForm.css";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function WorkDiaryForm() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const dateFromCalendar = location.state?.date;
  const defaultDate = dateFromCalendar
    ? new Date(dateFromCalendar).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    id: id ? Number(id) : Date.now(),
    user: localStorage.getItem("username") || "익명 사용자", // 사용자 이름 저장
    date: defaultDate,
    title: "",
    isPublic: false,
    weather: {
      highTemp: "",
      lowTemp: "",
      rain: "",
      humidity: "",
      wind: "",
    },
    growthImage: null,
    imagePreview: null,
    weedTime: "",
    fertilizer: {
      name: "",
      time: "",
      amount: "",
    },
    pesticide: {
      name: "",
      time: "",
      amount: "",
    },
    growthNote: "",
    fieldVisits: "",
    todayWork: "",
    todoWork: "",
    harvest: {
      time: "",
      amount: "",
      storage: "",
      quality: "",
    },
  });

  useEffect(() => {
    const diaries = JSON.parse(localStorage.getItem("diaries") || "[]");

    if (id) {
      const entry = diaries.find((d) => Number(d.id) === Number(id));

      // title이 없거나 비어 있으면 접근 차단
      if (entry && entry.title && entry.title.trim() !== "") {
        setFormData({
          ...entry,
          imagePreview: entry.imagePreview || null,
        });
      } else {
        alert("해당 일지가 존재하지 않거나 작성된 내용이 없습니다.");
        navigate("/calendar");
      }
    } else if (dateFromCalendar) {
      setFormData((prev) => ({
        ...prev,
        date: dateFromCalendar,
      }));
    } else if (defaultDate) {
      setFormData((prev) => ({
        ...prev,
        date: defaultDate,
      }));
    }
  }, [id, dateFromCalendar, defaultDate, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNestedChange = (e, key, field) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        growthImage: file,
        imagePreview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert("일지 제목을 입력해주세요.");
      return;
    }

    const diaries = JSON.parse(localStorage.getItem("diaries") || "[]");

    const diaryToSave = {
      ...formData,
      user: localStorage.getItem("username") || "익명 사용자",
    };

    const updated = id
      ? diaries.map((d) => (d.id === Number(id) ? diaryToSave : d))
      : [...diaries, diaryToSave];

    localStorage.setItem("diaries", JSON.stringify(updated));
    alert("저장되었습니다!");
    navigate("/calendar");
  };

  return (
    <>
      <h2 className="diary-title">작업 일지</h2>
      <div className="diary-container">
        <div className="form-group">
          <div className="section-header">
            <strong>일지 제목</strong>
            <input
              type="text"
              name="title"
              placeholder="예: 4월 22일 꽂힌 재배 일지"
              value={formData.title}
              onChange={handleChange}
              className="title-input"
            />
            <label className="switch-label">
              공개 여부
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
              />
              <span className="toggle-switch" />
            </label>
          </div>
          <div className="date-weather">
            <div>
              날짜{" "}
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div>
              최고기온{" "}
              <input
                type="text"
                placeholder="°C"
                value={formData.weather.highTemp}
                onChange={(e) => handleNestedChange(e, "weather", "highTemp")}
              />
            </div>
            <div>
              최저기온{" "}
              <input
                type="text"
                placeholder="°C"
                value={formData.weather.lowTemp}
                onChange={(e) => handleNestedChange(e, "weather", "lowTemp")}
              />
            </div>
            <div>
              비{" "}
              <input
                type="text"
                placeholder="%"
                value={formData.weather.rain}
                onChange={(e) => handleNestedChange(e, "weather", "rain")}
              />
            </div>
            <div>
              습도{" "}
              <input
                type="text"
                placeholder="%"
                value={formData.weather.humidity}
                onChange={(e) => handleNestedChange(e, "weather", "humidity")}
              />
            </div>
            <div>
              풍속{" "}
              <input
                type="text"
                placeholder="m/s"
                value={formData.weather.wind}
                onChange={(e) => handleNestedChange(e, "weather", "wind")}
              />
            </div>
          </div>
          <h3 className="form-title">생육 상태</h3>
          <input type="file" onChange={handleImageChange} accept="image/*" />
          {formData.imagePreview && (
            <div style={{ margin: "1rem 0" }}>
              <img
                src={formData.imagePreview}
                alt="미리보기"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          )}
          <div>
            풀 준 시간{" "}
            <input
              type="time"
              name="weedTime"
              value={formData.weedTime}
              onChange={handleChange}
            />
          </div>
          <div>
            영양제
            <input
              type="text"
              placeholder="예: 질소비료 (NPK 20-10-10)"
              value={formData.fertilizer.name}
              onChange={(e) => handleNestedChange(e, "fertilizer", "name")}
            />
            시간{" "}
            <input
              type="time"
              value={formData.fertilizer.time}
              onChange={(e) => handleNestedChange(e, "fertilizer", "time")}
            />
            양{" "}
            <input
              type="text"
              placeholder="예: 5L"
              value={formData.fertilizer.amount}
              onChange={(e) => handleNestedChange(e, "fertilizer", "amount")}
            />
          </div>
          <div>
            사용 중인 농약
            <input
              type="text"
              placeholder="없음"
              value={formData.pesticide.name}
              onChange={(e) => handleNestedChange(e, "pesticide", "name")}
            />
            시간{" "}
            <input
              type="time"
              value={formData.pesticide.time}
              onChange={(e) => handleNestedChange(e, "pesticide", "time")}
            />
            양{" "}
            <input
              type="text"
              placeholder="예: 5L"
              value={formData.pesticide.amount}
              onChange={(e) => handleNestedChange(e, "pesticide", "amount")}
            />
          </div>
          작물 성장 상태{" "}
          <textarea
            name="growthNote"
            value={formData.growthNote}
            onChange={handleChange}
            rows={3}
          />
          <h3 className="form-title">작업 내용</h3>
          <div>
            밭에 나간 횟수{" "}
            <input
              type="number"
              name="fieldVisits"
              value={formData.fieldVisits}
              onChange={handleChange}
            />{" "}
            회
          </div>
          오늘 한 작업{" "}
          <textarea
            name="todayWork"
            value={formData.todayWork}
            onChange={handleChange}
            rows={3}
          />
          해야 할 작업{" "}
          <textarea
            name="todoWork"
            value={formData.todoWork}
            onChange={handleChange}
            rows={3}
          />
          <h3 className="form-title">수확 관련 정보</h3>
          <div>
            수확 시기{" "}
            <input
              type="text"
              value={formData.harvest.time}
              onChange={(e) => handleNestedChange(e, "harvest", "time")}
            />
          </div>
          <div>
            수확량{" "}
            <input
              type="text"
              value={formData.harvest.amount}
              onChange={(e) => handleNestedChange(e, "harvest", "amount")}
            />
          </div>
          <div>
            저장 방법{" "}
            <input
              type="text"
              value={formData.harvest.storage}
              onChange={(e) => handleNestedChange(e, "harvest", "storage")}
            />
          </div>
          <div>
            품질 상태{" "}
            <textarea
              value={formData.harvest.quality}
              onChange={(e) => handleNestedChange(e, "harvest", "quality")}
              rows={2}
            />
          </div>
          <button className="submit-button" onClick={handleSubmit}>
            {id ? "수정하기" : "업로드"}
          </button>
        </div>
      </div>
    </>
  );
}
