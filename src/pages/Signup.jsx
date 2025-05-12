import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import { useState } from "react";
import { REGION_LIST } from "../constants/regions";

export default function Signup() {
  const navigate = useNavigate();
  const [region, setRegion] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("선택된 지역:", region);
    navigate("/login");
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>

      {/* 지역 선택 드롭다운 */}
      <select
        className="region-select"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        required
      >
        <option value="">-- 지역을 선택하세요 --</option>
        {REGION_LIST.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      {/* 구글 로그인 버튼 */}
      <button className="google-button">Sign in with Google</button>

      <div className="divider">or</div>

      {/* 일반 회원가입 폼 */}
      <form className="signup-form" onSubmit={handleSignup}>
        <input type="text" placeholder="이름" />
        <input type="email" placeholder="이메일" />
        <input type="password" placeholder="비밀번호" />
        <button type="submit" className="signup-button">
          가입하기
        </button>
      </form>

      {/* 로그인 링크 */}
      <p className="login-link">
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </p>
    </div>
  );
}
