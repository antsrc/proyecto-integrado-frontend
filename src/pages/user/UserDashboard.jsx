import Layout from "../../components/layout/Layout";
import { useAuth } from "../../hooks/useAuth";

export default function UserDashboard() {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando sesión...</p>;
  if (!user) return <p>No estás autenticado</p>;

  return (
    <h1 className="text-2xl font-bold text-gray-800">
      Bienvenido al Dashboard 👋
    </h1>
  );
}
