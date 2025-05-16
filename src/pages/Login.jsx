import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // 이메일/비밀번호 로그인 로직은 추후 구현
    localStorage.setItem("isAuthenticated", "true");
    navigate("/main");
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      const res = await axios.post("http://34.47.85.36:3030/auth/google", {
        idToken: idToken,
      });

      const accessToken = res.data.accessToken;
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("nickname", res.data.nickname);
      localStorage.setItem("token", accessToken); // 백엔드에서 받은 JWT 저장
      localStorage.setItem("isAuthenticated", "true");

      navigate("/main");
    } catch (err) {
      console.error("Google 로그인 실패", err);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  const handleGoogleLoginError = () => {
    alert("구글 로그인에 실패했습니다. 다시 시도해 주세요.");
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>

      <form className="login-form" onSubmit={handleLogin}>
        <input type="email" placeholder="이메일" />
        <input type="password" placeholder="비밀번호" />
        <button type="submit" className="login-button">
          로그인
        </button>
      </form>

      <div className="divider">or</div>

      {/* 구글 로그인 버튼 */}
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={handleGoogleLoginError}
      />

      <p className="signup-link">
        계정이 없으신가요? <Link to="/signup">회원가입</Link>
      </p>
    </div>
  );
}
