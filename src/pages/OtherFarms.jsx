import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OtherFarms.css";

export default function OtherFarm() {
  const [diaries, setDiaries] = useState([]);
  const [sortType, setSortType] = useState("latest");
  const navigate = useNavigate();

  useEffect(() => {
    const allDiaries = JSON.parse(localStorage.getItem("diaries") || "[]");
    const publicDiaries = allDiaries.filter((diary) => diary.isPublic);

    publicDiaries.forEach((diary) => {
      const likes = JSON.parse(
        localStorage.getItem(`likes-${diary.id}`) || "[]"
      );
      diary.likeCount = likes.length;
    });

    setDiaries(sortDiaries(publicDiaries, sortType));
  }, [sortType]);

  const handleDiaryClick = (id) => {
    navigate(`/workdiarydetail/${id}`);
  };

  const sortDiaries = (list, type) => {
    const copied = [...list];
    if (type === "latest") {
      return copied.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (type === "popular") {
      return copied.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
    }
    return copied;
  };

  return (
    <div className="otherfarm-container">
      <div className="sort-buttons">
        <button
          className={sortType === "latest" ? "active" : ""}
          onClick={() => setSortType("latest")}
        >
          최신순
        </button>
        <button
          className={sortType === "popular" ? "active" : ""}
          onClick={() => setSortType("popular")}
        >
          인기순
        </button>
      </div>

      <div className="diary-list">
        {diaries.map((diary, index) => (
          <div
            className="diary-item"
            onClick={() => handleDiaryClick(diary.id)}
          >
            <div className="rank-box">{index + 1}등</div>
            <div className="diary-img-wrapper">
              {diary.imagePreview ? (
                <img src={diary.imagePreview} alt="작물 이미지" />
              ) : (
                <div className="no-image">No Image</div>
              )}
            </div>

            <div className="diary-content">
              <h3>{diary.user || "익명"}</h3>
              <p>{diary.date}</p>
              <p>{diary.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
