import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ component: Component, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />;

  if (roles && !roles.includes(user.user.role)) {
    return <Navigate to="/403" />;
  }

  return <Component />;
}
