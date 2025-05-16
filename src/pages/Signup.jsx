import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

// 시도 → regionCode 매핑
const REGION_CODE_MAP = {
  서울특별시: "11",
  부산광역시: "26",
  대구광역시: "27",
  인천광역시: "28",
  광주광역시: "29",
  대전광역시: "30",
  울산광역시: "31",
  세종특별자치시: "36",
  경기도: "41",
  강원특별자치도: "42",
  충청북도: "43",
  충청남도: "44",
  전라북도: "45",
  전라남도: "46",
  경상북도: "47",
  경상남도: "48",
  제주특별자치도: "50",
};

export default function Signup() {
  const navigate = useNavigate();
  const [selectedSido, setSelectedSido] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const googleId = localStorage.getItem("googleId");

    if (!googleId) {
      alert("Google 인증 정보가 없습니다. 다시 로그인 해주세요.");
      navigate("/");
      return;
    }

    const regionCode = REGION_CODE_MAP[selectedSido];

    if (!regionCode) {
      alert("선택한 지역 정보가 올바르지 않습니다.");
      return;
    }

    try {
      const payload = {
        googleId: googleId,
        nickname: nickname.trim(),
        region: regionCode.toString(),
      };

      console.log("보내는 데이터", payload);

      const response = await axios.post(
        "http://34.47.85.36:3030/auth/signup",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // 서버 닉네임과 상태 변수 닉네임 충돌 방지
      const {
        userId,
        nickname: nicknameFromServer,
        accessToken,
        refreshToken,
      } = response.data;

      localStorage.setItem("userId", userId);
      localStorage.setItem("nickname", nicknameFromServer);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      alert("회원가입 성공!");
      navigate("/main");
    } catch (err) {
      console.error("회원가입 실패", err.response?.data || err.message);
      alert(err.response?.data?.error || "회원가입 실패");
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>

      <form className="signup-form" onSubmit={handleSignup}>
        {/* 닉네임 입력 */}
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />

        {/* 시/도 선택 */}
        <select
          value={selectedSido}
          onChange={(e) => {
            setSelectedSido(e.target.value);
          }}
          required
        >
          <option value="">-- 시/도 선택 --</option>
          {Object.keys(REGION_CODE_MAP).map((sido) => (
            <option key={sido} value={sido}>
              {sido}
            </option>
          ))}
        </select>

        <button type="submit" className="signup-button">
          가입하기
        </button>
      </form>

      <p className="login-link">
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </p>
    </div>
  );
}
