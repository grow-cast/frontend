// components/Layout.jsx
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import "./Layout.css";
import logoImage from "../assets/mypage.png"; // 경로 주의
import LogoImage from "../assets/logo.PNG"; // 경로 주의

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("nickname");
    localStorage.removeItem("googleId");
    navigate("/"); // 로그아웃 시 랜딩 페이지로 이동
  };

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="logo" onClick={() => navigate("/main")}>
          <img src={LogoImage} alt="로고" className="logo-icon" />
          Growcast
        </div>

        <nav className="navbar">
          <NavLink
            to="/recommend-crop"
            className={({ isActive }) => {
              const isMatch =
                isActive ||
                location.pathname.startsWith("/loading") ||
                location.pathname.startsWith("/crop-result");
              return isMatch ? "nav-link active" : "nav-link";
            }}
          >
            작물 추천
          </NavLink>

          <NavLink
            to="/pest-check"
            className={({ isActive }) => {
              const isMatch =
                isActive ||
                location.pathname.startsWith("/pest-loading") ||
                location.pathname.startsWith("/pest-result");
              return isMatch ? "nav-link active" : "nav-link";
            }}
          >
            병해충 확인
          </NavLink>
          <NavLink
            to="/calendar"
            className={({ isActive }) => {
              const isMatch =
                isActive || location.pathname.startsWith("/workdiaryform");
              return isMatch ? "nav-link active" : "nav-link";
            }}
          >
            농장 일지
          </NavLink>
          <NavLink
            to="/other-farms"
            className={({ isActive }) => {
              const isMatch =
                isActive || location.pathname.startsWith("/workdiarydetail");
              return isMatch ? "nav-link active" : "nav-link";
            }}
          >
            남의 농장
          </NavLink>
        </nav>

        <div className="user-actions">
          <div className="nav-item">
            <span className="clickable-text" onClick={handleLogout}>
              로그아웃
            </span>
            <img
              src={logoImage}
              alt="사용자"
              className="user-icon"
              onClick={() => navigate("/my-page")}
            />
          </div>
        </div>
      </header>

      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
}
