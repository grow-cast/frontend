import "./WorkDiaryDetail.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/mypage.png";
import CommentList from "../components/CommentList"; // 추가

export default function PublicDiaryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [diary, setDiary] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const diaries = JSON.parse(localStorage.getItem("diaries") || "[]");
    const entry = diaries.find(
      (d) => Number(d.id) === Number(id) && d.isPublic
    );

    if (entry) {
      setDiary(entry);
      setLikes(JSON.parse(localStorage.getItem(`likes-${id}`) || "[]").length);
      setLiked(localStorage.getItem(`liked-${id}`) === "true");
      setComments(JSON.parse(localStorage.getItem(`comments-${id}`)) || []);
    } else {
      alert("존재하지 않거나 비공개된 일지입니다.");
      navigate("/community");
    }
  }, [id, navigate]);

  const handleLike = () => {
    const likeKey = `likes-${id}`;
    let likeArray = JSON.parse(localStorage.getItem(likeKey) || "[]");

    if (liked) {
      // 좋아요 취소
      likeArray = likeArray.slice(0, -1);
    } else {
      likeArray.push("placeholder"); // 실제 유저 ID가 있다면 사용
    }

    localStorage.setItem(likeKey, JSON.stringify(likeArray));
    setLikes(likeArray.length);
    setLiked(!liked);
  };

  if (!diary) return <p>로딩 중...</p>;

  return (
    <div className="detail-container">
      <h2 className="diary-title">작업 일지</h2>
      <div className="diary-container">
        <div className="form-title">
          일지 제목 <span>{diary.title}</span>
        </div>
        <p>날짜: {diary.date}</p>
        <div className="date-weather">
          <p>최고 기온: {diary.weather.highTemp}°C</p>
          <p>최저 기온: {diary.weather.lowTemp}°C</p>
          <p>비: {diary.weather.rain}%</p>
          <p>습도: {diary.weather.humidity}%</p>
          <p>풍속: {diary.weather.wind} m/s</p>
        </div>

        <div className="form-title">생육 상태</div>
        {diary.imagePreview && (
          <img src={diary.imagePreview} alt="작물" className="image-preview" />
        )}
        <p>물 준 시간: {diary.weedTime}</p>
        <p>
          영양제: {diary.fertilizer.name} - {diary.fertilizer.time} -{" "}
          {diary.fertilizer.amount}
        </p>
        <p>
          농약: {diary.pesticide.name} - {diary.pesticide.time} -{" "}
          {diary.pesticide.amount}
        </p>
        <p>작물 성장 상태: {diary.growthNote}</p>

        <div className="form-title">작업 내용</div>
        <p>밭에 나간 횟수: {diary.fieldVisits}회</p>
        <p>오늘 한 일: {diary.todayWork}</p>
        <p>해야 할 일: {diary.todoWork}</p>

        <div className="form-title">수확 관련 정보</div>
        <p>수확 시기: {diary.harvest.time}</p>
        <p>수확량: {diary.harvest.amount}</p>
        <p>저장 방법: {diary.harvest.storage}</p>
        <p>품질 상태: {diary.harvest.quality}</p>
      </div>
      <div style={{ marginTop: "2rem", borderTop: "3px solid #FFDF61" }}></div>

      <button onClick={handleLike} className="like-button">
        {liked ? "❤️" : "🤍"} <span>{likes}</span>
      </button>

      <CommentList
        comments={comments}
        setComments={setComments}
        diaryUser={diary.user || "익명"} // OtherFarm에서 등록한 작성자 이름
        diaryId={id}
      />
    </div>
  );
}
