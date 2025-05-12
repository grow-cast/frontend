import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Calendar.css";

export default function CalendarPage() {
  const navigate = useNavigate();
  const [diaryMap, setDiaryMap] = useState({});
  const [modalDiaries, setModalDiaries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const diaries = JSON.parse(localStorage.getItem("diaries") || "[]");
    const map = {};
    diaries.forEach((diary) => {
      map[diary.date] = map[diary.date] ? [...map[diary.date], diary] : [diary];
    });
    setDiaryMap(map);
  }, []);

  const handleDateClick = (date) => {
    const dateStr = date.toLocaleDateString("sv-SE");
    navigate("/workdiaryform", { state: { date: dateStr } });
  };

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const dateStr = date.toLocaleDateString("sv-SE");
    const todayDiaries = diaryMap[dateStr] || [];
    const maxDisplay = 4;

    return (
      <div className="diary-tags" onClick={(e) => e.stopPropagation()}>
        {todayDiaries.slice(0, maxDisplay).map((diary, index) => (
          <div
            key={diary.id}
            className={`diary-tag color-${index % 4}`}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/workdiaryform/${diary.id}`);
            }}
          >
            <div className="scroll-title">{diary.title}</div>
          </div>
        ))}
        {todayDiaries.length > maxDisplay && (
          <div
            className="diary-tag more-count"
            onClick={(e) => {
              e.stopPropagation();
              setModalDiaries(todayDiaries);
              setIsModalOpen(true);
            }}
          >
            +{todayDiaries.length - maxDisplay}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <h2>농장 캘린더</h2>
      <Calendar
        onClickDay={handleDateClick}
        value={new Date()}
        tileContent={tileContent}
      />
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>일지 목록</h3>
            <button
              className="close-button"
              onClick={() => setIsModalOpen(false)}
            >
              X
            </button>
            <ul className="modal-list">
              {modalDiaries.map((diary) => (
                <li
                  key={diary.id}
                  className="modal-diary-item"
                  onClick={() => {
                    navigate(`/workdiaryform/${diary.id}`);
                    setIsModalOpen(false);
                  }}
                >
                  {diary.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
