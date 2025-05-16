// src/pages/Landing.jsx
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "./Landing.css";
import logoImage from "../assets/logo.PNG"; // 경로 주의

export default function Landing() {
  const navigate = useNavigate();

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      console.log("받은 토큰:", idToken);

      const res = await axios.post("http://34.47.85.36:3030/auth/google", {
        idToken: idToken,
      });
      console.log("전체 응답 객체:", res);
      console.log("res.data:", res.data);
      console.log("res.data.accessToken:", res?.data?.accessToken);
      console.log("res.data.googleId:", res?.data?.googleId);

      if (res?.data?.accessToken) {
        // 기존 회원
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("nickname", res.data.nickname);
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("isAuthenticated", "true");
        navigate("/main");
      } else if (res?.data?.googleId) {
        // 신규 회원
        localStorage.setItem("googleId", res.data.googleId);
        navigate("/signup");
      } else {
        console.error("예상치 못한 응답 형식:", res.data);
        alert("서버 응답 형식이 올바르지 않습니다.");
      }
    } catch (err) {
      console.error("Google 로그인 실패", err);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  const handleGoogleLoginError = () => {
    alert("구글 로그인에 실패했습니다. 다시 시도해 주세요.");
  };

  return (
    <div className="landing-container">
      <img src={logoImage} alt="로고" className="logo-icon" />
      <h1>Growcast</h1>
      <div style={{ marginTop: "20px" }}>
        <div className="button-group">
          {/* 구글 로그인 버튼 */}
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
          />

          <Link to="/signup">
            <button className="landing-button signup-button">회원가입</button>
          </Link>
          <Link to="/login">
            <button className="landing-button login-button">로그인</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
