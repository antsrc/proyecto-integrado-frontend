import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import NotFound from "../pages/NotFound";
import SessionLoading from "../pages/SessionLoading";

export default function PrivateRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) return <SessionLoading />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!requiredRole || user.rol !== requiredRole) {
    return <NotFound />;
  }

  return children;
}
