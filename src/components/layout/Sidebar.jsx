import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Building2,
  Users,
  Home,
  ChevronsLeft,
  ChevronsRight,
  Key,
  Truck,
  CircleAlert,
  Hammer
} from "lucide-react";

const navItems = [
  { name: "Inicio", icon: Home, path: "/inicio", isHome: true },
  { name: "Inmuebles", icon: Building2, path: "/inmuebles" },
  { name: "Clientes", icon: Users, path: "/clientes" },
  { name: "Alquileres", icon: Key, path: "/alquileres" },
  { name: "Proveedores", icon: Truck, path: "/proveedores" }, 
  { name: "Incidencias", icon: CircleAlert, path: "/incidencias" },
  { name: "Reformas", icon: Hammer, path: "/reformas" }
];

export default function Sidebar() {
  const location = useLocation();
  const [hideText, setHideText] = useState(false);

  return (
    <aside
      className={`${
        hideText ? "min-w-[64px]" : "w-56"
      } bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}
    >
      <div
        className={`h-20 px-4 flex items-center ${
          hideText ? "justify-center" : "justify-between"
        }`}
      >
        {!hideText && (
          <h1 className="text-2xl font-bold text-purple-600">Logotipo</h1>
        )}
        <button
          onClick={() => setHideText((prev) => !prev)}
          className="text-gray-500 hover:text-purple-600 transition"
        >
          {hideText ? (
            <ChevronsRight className="w-5 h-5" />
          ) : (
            <ChevronsLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="border-b border-gray-200 mx-4" />

      <nav className="flex-1 overflow-y-auto pb-4 pt-4">
        {/* Inicio */}
        <div className="px-4">
          <NavLink
            to="/inicio"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 h-[40px] w-full text-gray-700 rounded transition text-base font-medium ${
                isActive ? "bg-gray-100 text-gray-700" : "hover:bg-gray-100"
              }`
            }
          >
            <Home className={`w-4 h-4 shrink-0 ${hideText ? "" : "mr-3"}`} />
            {!hideText && "Inicio"}
          </NavLink>
        </div>

        {/* Separador */}
        <div className="h-[1px] bg-gray-200 mx-4 my-3" />

        {/* Resto de las opciones */}
        <div className="space-y-[6px] px-4">
          {navItems
            .filter((item) => !item.isHome)
            .map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 h-[40px] w-full text-gray-700 rounded transition text-base font-medium ${
                    location.pathname.startsWith(item.path) || isActive
                      ? "bg-gray-100 text-gray-700"
                      : "hover:bg-gray-100"
                  }`
                }
              >
                <item.icon
                  className={`w-4 h-4 shrink-0 ${hideText ? "" : "mr-3"}`}
                />
                {!hideText && item.name}
              </NavLink>
            ))}
        </div>
      </nav>
    </aside>
  );
}
