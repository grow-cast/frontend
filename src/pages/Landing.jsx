// src/pages/Landing.jsx
import { Link } from "react-router-dom";
import "./Landing.css";
import logoImage from "../assets/logo.PNG"; // 경로 주의

export default function Landing() {
  return (
    <div className="landing-container">
      <img src={logoImage} alt="로고" className="logo-icon" />
      <h1>Growcast</h1>
      <div style={{ marginTop: "20px" }}>
        <div className="button-group">
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
