import React, { useState } from "react";
import "./CommentList.css";
import defaultProfile from "../assets/mypage.png";

export default function CommentList({ comments, setComments, diaryId }) {
  const [replyInputs, setReplyInputs] = useState({});
  const [activeReplyIndex, setActiveReplyIndex] = useState(null);
  const [commentInput, setCommentInput] = useState("");

  const nickname = localStorage.getItem("nickname") || "익명";

  const handleCommentSubmit = () => {
    if (!commentInput.trim()) return;
    const newComment = {
      text: commentInput,
      user: nickname,
      replies: [],
    };
    const newComments = [...comments, newComment];
    setComments(newComments);
    localStorage.setItem(`comments-${diaryId}`, JSON.stringify(newComments));
    setCommentInput("");
  };

  const handleReplySubmit = (index) => {
    const replyText = replyInputs[index];
    if (!replyText || !replyText.trim()) return;

    const newComments = [...comments];
    newComments[index].replies.push({
      text: replyText,
      user: nickname,
    });
    setComments(newComments);
    localStorage.setItem(`comments-${diaryId}`, JSON.stringify(newComments));

    setReplyInputs({ ...replyInputs, [index]: "" });
    setActiveReplyIndex(null); // 입력창 닫기
  };

  const toggleReplyInput = (index) => {
    setActiveReplyIndex(activeReplyIndex === index ? null : index);
  };

  return (
    <div className="comment-box">
      <h4 style={{ marginTop: "1rem" }}>댓글 ({comments.length})</h4>
      <ul className="comment-list">
        {comments.map((c, idx) => (
          <li key={idx} className="comment-bubble">
            <div className="comment-left-line"></div>

            <div className="comment-main" onClick={() => toggleReplyInput(idx)}>
              <img src={defaultProfile} alt="프로필" className="profile-icon" />
              <div className="bubble-content">
                <div className="nickname">{c.user}</div>
                <div>{c.text}</div>
              </div>
            </div>

            {/* 대댓글 목록 */}
            {c.replies?.map((reply, rIdx) => (
              <div key={rIdx} className="reply-wrapper">
                <div className="reply-line"></div>
                <div className="reply-main">
                  <img
                    src={defaultProfile}
                    alt="프로필"
                    className="profile-icon"
                  />
                  <div className="bubble-content">
                    <div className="nickname">{reply.user}</div>
                    <div>{reply.text}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* 대댓글 입력창 (토글로 열기) */}
            {activeReplyIndex === idx && (
              <div className="reply-input-wrapper">
                <textarea
                  placeholder="답글을 입력하세요..."
                  value={replyInputs[idx] || ""}
                  onChange={(e) =>
                    setReplyInputs({ ...replyInputs, [idx]: e.target.value })
                  }
                  rows={1}
                />
                <button
                  onClick={() => handleReplySubmit(idx)}
                  className="reply-button"
                >
                  답글 작성
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <textarea
        placeholder="댓글을 입력하세요..."
        value={commentInput}
        onChange={(e) => setCommentInput(e.target.value)}
        rows={2}
      />
      <button onClick={handleCommentSubmit} className="submit-button">
        댓글 작성
      </button>
    </div>
  );
}
