import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import NotFound from "../pages/NotFound";

export default function PrivateRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando sesión...</p>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!requiredRole || user.rol !== requiredRole) {
    return <NotFound />;
  }

  return children;
}
