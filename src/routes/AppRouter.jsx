import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/user/dashboard/Dashboard";
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
import IncidenciasLista from "../pages/user/incidencias/IncidenciasLista";
import IncidenciasNuevo from "../pages/user/incidencias/IncidenciasNuevo";
import IncidenciasEditar from "../pages/user/incidencias/IncidenciasEditar";
import Reformas from "../pages/user/reformas/Reformas";
import ReformasLista from "../pages/user/reformas/ReformasLista";
import ReformasNuevo from "../pages/user/reformas/ReformasNuevo";
import ReformasEditar from "../pages/user/reformas/ReformasEditar";
import Document from "../pages/user/Document";
import MensualidadesLista from "../pages/user/mensualidades/MensualidadesLista";
import MensualidadesNuevo from "../pages/user/mensualidades/MensualidadesNuevo";
import MensualidadesEditar from "../pages/user/mensualidades/MensualidadesEditar";
import Reparaciones from "../pages/user/reparaciones/Reparaciones";
import ReparacionesLista from "../pages/user/reparaciones/ReparacionesLista";
import ReparacionesNuevo from "../pages/user/reparaciones/ReparacionesNuevo";
import ReparacionesEditar from "../pages/user/reparaciones/ReparacionesEditar";
import Seguros from "../pages/user/seguros/Seguros";
import Rentas from "../pages/user/rentas/Rentas";
import Ibis from "../pages/user/ibis/Ibis";

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
        <Route path="/inicio" element={<Dashboard />} />

        <Route path="/inmuebles" element={<Inmuebles />}>
          <Route index element={<InmueblesLista />} />
          <Route path="nuevo" element={<InmueblesNuevo />} />
          <Route path="editar/:id" element={<InmueblesEditar />} />
          <Route path="seguros" element={<Seguros />} />
          <Route path="rentas" element={<Rentas />} />
          <Route path="ibis" element={<Ibis />} />
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
          <Route path="mensualidades/*">
            <Route index element={<MensualidadesLista />} />
            <Route path="nuevo" element={<MensualidadesNuevo />} />
            <Route path="editar/:id" element={<MensualidadesEditar />} />
          </Route>
        </Route>

        <Route path="/proveedores" element={<Proveedores />}>
          <Route index element={<ProveedoresLista />} />
          <Route path="nuevo" element={<ProveedoresNuevo />} />
          <Route path="editar/:id" element={<ProveedoresEditar />} />
        </Route>
        
        <Route path="/incidencias" element={<Incidencias />}>
          <Route index element={<IncidenciasLista />} />
          <Route path="nuevo" element={<IncidenciasNuevo />} />
          <Route path="editar/:id" element={<IncidenciasEditar />} />
          <Route path="reparaciones/*">
            <Route index element={<ReparacionesLista />} />
            <Route path="nuevo" element={<ReparacionesNuevo />} />
            <Route path="editar/:id" element={<ReparacionesEditar />} />
          </Route>
        </Route>

        <Route path="/reformas" element={<Reformas />}>
          <Route index element={<ReformasLista />} />
          <Route path="nuevo" element={<ReformasNuevo />} />
          <Route path="editar/:id" element={<ReformasEditar />} />
        </Route>
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
