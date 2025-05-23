import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const pathToTitle = {
  "/inicio": "Inicio",
  "/inmuebles": "Inmuebles",
  "/clientes": "Clientes",
  "/alquileres": "Alquileres",
  "/proveedores": "Proveedores",
  "/incidencias": "Incidencias",
  "/reformas": "Reformas",
};

const Layout = () => {
  const location = useLocation();

  const matchedPath = Object.keys(pathToTitle).find((key) =>
    location.pathname.startsWith(key)
  );
  const title = pathToTitle[matchedPath] || "";

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header title={title} />
        <div className="overflow-x-auto">
          <main className="p-6 min-w-[768px]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
