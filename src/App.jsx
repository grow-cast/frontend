import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import RegisterCrop from "./pages/RegisterCrop";
import CropRecommendation from "./pages/CropRecommendation";
import Loading from "./pages/CropLoading";
import CropResult from "./pages/CropResult";
import PestCheck from "./pages/PestCheck";
import PestLoading from "./pages/PestLoading";
import PestResult from "./pages/PestResult";
import MyPage from "./pages/MyPage";
import CalendarPage from "./pages/Calendar";
import WorkDiaryForm from "./pages/WorkDiaryForm";
import OtherFarms from "./pages/OtherFarms";
import WorkDiaryDetail from "./pages/WorkDiaryDetail";

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/main" element={<Home />} />
            <Route path="/register-crop" element={<RegisterCrop />} />
            <Route path="/recommend-crop" element={<CropRecommendation />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/crop-result" element={<CropResult />} />
            <Route path="/pest-check" element={<PestCheck />} />
            <Route path="/pest-loading" element={<PestLoading />} />
            <Route path="/pest-result" element={<PestResult />} />
            <Route path="/my-page" element={<MyPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/workdiaryform" element={<WorkDiaryForm />} />
            <Route path="/workdiaryform/:id" element={<WorkDiaryForm />} />
            <Route path="/other-farms" element={<OtherFarms />} />
            <Route path="/workdiarydetail" element={<WorkDiaryDetail />} />
            <Route path="/workdiarydetail/:id" element={<WorkDiaryDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
