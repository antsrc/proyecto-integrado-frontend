import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import UserDashboard from "../pages/user/UserDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import Layout from "../components/layout/Layout";
import InmueblesNuevo from "../pages/user/inmuebles/InmueblesNuevo";
import InmueblesEditar from "../pages/user/inmuebles/InmueblesEditar";

// Inmuebles y subpáginas
import Inmuebles from "../pages/user/inmuebles/Inmuebles";
import InmueblesLista from "../pages/user/inmuebles/InmueblesLista";

// Otros
import Clientes from "../pages/user/Clientes";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />

      <Route
        element={
          <PrivateRoute requiredRole="user">
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/inicio" element={<UserDashboard />} />

        <Route path="/inmuebles" element={<Inmuebles />}>
          <Route index element={<InmueblesLista />} />
          <Route path="nuevo" element={<InmueblesNuevo />} />
          <Route path="editar/:id" element={<InmueblesEditar />} />
        </Route>

        <Route path="/clientes" element={<Clientes />} />
      </Route>

      <Route
        path="/admin"
        element={
          <PrivateRoute requiredRole="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
