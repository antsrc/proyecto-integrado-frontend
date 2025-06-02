import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";

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
  const [sidebarState, setSidebarState] = useState("open");

  const matchedPath = Object.keys(pathToTitle).find((key) =>
    location.pathname.startsWith(key)
  );
  const title = pathToTitle[matchedPath] || "";

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header
        onToggleSidebar={(state) => setSidebarState(state)}
        sidebarState={sidebarState}
        title={title}
      />
      <div className="flex flex-1 min-h-0">
        {sidebarState !== "closed" && <Sidebar collapsed={sidebarState === "collapsed"} />}
        <div className="flex flex-col flex-1 min-w-0 overflow-x-auto">
          <main className="p-6 min-w-[576px]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
