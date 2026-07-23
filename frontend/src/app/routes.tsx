import { Routes, Route } from "react-router-dom";

import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import LandingPage from "../features/LandingPage/Pages/LandingPage";
import VerifyOtp from "../features/auth/pages/VerifyOtp";
import CommonLayout from "../features/Layouts/CommonLayout";
import GoogleSuccess from "../features/auth/pages/GoogleSuccess";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";
import ProtectedLayout from "../features/Layouts/ProtectedLayout";
import ChangePassword from "../features/auth/pages/ChangePassword";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <CommonLayout>
            <LandingPage />
          </CommonLayout>
        }
      />
      {/* --- Auth Routes --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verifyOtp" element={<VerifyOtp />} />
      <Route path="/auth/google/success" element={<GoogleSuccess />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/change-password" element={<ProtectedLayout >
        <ChangePassword/>
      </ProtectedLayout>} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route
        path="*"
        element={
          <>
            <h1>404 </h1>
            <a href="/">Go to home Page</a>
          </>
        }
      />
    </Routes>
  );
}
