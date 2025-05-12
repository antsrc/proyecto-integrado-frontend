import { useAuth } from '../../hooks/useAuth';

export default function AdminDashboard() {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando sesión...</p>;
  if (!user) return <p>No estás autenticado</p>;

  return (
    <div>
      <h1>Bienvenido, admin {user.nombre} 👋</h1>
    </div>
  );
}