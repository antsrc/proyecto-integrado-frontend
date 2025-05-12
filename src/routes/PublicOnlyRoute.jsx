import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando sesión...</p>;

  if (user) {
    const redirectPath = user.rol === "user" ? "/inicio" : "/admin";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
