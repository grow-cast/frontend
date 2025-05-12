import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // 로그인 성공 처리
    localStorage.setItem("isAuthenticated", "true");
    navigate("/main");
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>

      {/* 로그인 폼 */}
      <form className="login-form" onSubmit={handleLogin}>
        <input type="email" placeholder="이메일" />
        <input type="password" placeholder="비밀번호" />
        <button type="submit" className="login-button">
          로그인
        </button>
      </form>

      <div className="divider">or</div>

      {/* 구글 로그인 버튼 */}
      <button className="google-button">Sign in with Google</button>

      {/* 회원가입 페이지로 링크 */}
      <p className="signup-link">
        계정이 없으신가요? <Link to="/signup">회원가입</Link>
      </p>
    </div>
  );
}
