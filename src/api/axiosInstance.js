import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://34.47.85.36:3030", // 서버 주소에 따라 수정
  timeout: 2000,
});

export default axiosInstance;
