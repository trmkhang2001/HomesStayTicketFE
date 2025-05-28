import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import UpdateProfile from "../pages/UpdateProfile";
import AdminLayout from "../admin/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/NotFound";
import Forbidden from "../pages/Forbidden";
import { adminRoutes } from "../admin/routes";
import LoginPage from "../pages/LoginPage";
import OTPPage from "../pages/OTPPage";
import BookingPage from "../pages/BookingPage";
import RegisterPage from "../pages/RegisterPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/profile" element={<UpdateProfile />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          {adminRoutes.map((route, i) => (
            <Route
              key={i}
              path={route.path.replace("/admin/", "")}
              element={
                <ProtectedRoute
                  component={route.component}
                  roles={route.roles}
                />
              }
            />
          ))}
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/403" element={<Forbidden />} />
      </Routes>
    </BrowserRouter>
  );
}
