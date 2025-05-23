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
import Inmuebles from "../pages/user/inmuebles/Inmuebles";
import InmueblesLista from "../pages/user/inmuebles/InmueblesLista";
import Clientes from "../pages/user/clientes/Clientes";
import ClientesLista from "../pages/user/clientes/ClientesLista";
import ClientesNuevo from "../pages/user/clientes/ClientesNuevo";
import ClientesEditar from "../pages/user/clientes/ClientesEditar";
import Alquileres from "../pages/user/alquileres/Alquileres";
import AlquileresLista from "../pages/user/alquileres/AlquileresLista";
import AlquileresNuevo from "../pages/user/alquileres/AlquileresNuevo";
import AlquileresEditar from "../pages/user/alquileres/AlquileresEditar";
import Proveedores from "../pages/user/proveedores/Proveedores";
import ProveedoresLista from "../pages/user/proveedores/ProveedoresLista";
import ProveedoresNuevo from "../pages/user/proveedores/ProveedoresNuevo";
import ProveedoresEditar from "../pages/user/proveedores/ProveedoresEditar";
import Incidencias from "../pages/user/incidencias/Incidencias";
import Reformas from "../pages/user/reformas/Reformas";
import Document from "../pages/user/Document";

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

        <Route path="/clientes" element={<Clientes />}>
          <Route index element={<ClientesLista />} />
          <Route path="nuevo" element={<ClientesNuevo />} />
          <Route path="editar/:id" element={<ClientesEditar />} />
        </Route>

        <Route path="/alquileres" element={<Alquileres />}>
          <Route index element={<AlquileresLista />} />
          <Route path="nuevo" element={<AlquileresNuevo />} />
          <Route path="editar/:id" element={<AlquileresEditar />} />
        </Route>

        <Route path="/proveedores" element={<Proveedores />}>
          <Route index element={<ProveedoresLista />} />
          <Route path="nuevo" element={<ProveedoresNuevo />} />
          <Route path="editar/:id" element={<ProveedoresEditar />} />
        </Route>
        
        <Route path="/incidencias" element={<Incidencias />} />
        <Route path="/reformas" element={<Reformas />} />
      </Route>

      <Route path="/documentos/:type/:id.pdf" element={<Document />} />

      <Route
        path="/admin"
        element={
          <PrivateRoute requiredRole="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="*"
        element={
          <PrivateRoute>
            <NotFound />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
