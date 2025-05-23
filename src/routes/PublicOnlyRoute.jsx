import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SessionLoading from "../pages/SessionLoading";

export default function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <SessionLoading />;

  if (user) {
    const redirectPath = user.rol === "user" ? "/inicio" : "/admin";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
