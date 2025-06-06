import { NavLink, useLocation } from "react-router-dom";
import {
  Building2,
  Users,
  Home,
  Key,
  Truck,
  CircleAlert,
  Hammer
} from "lucide-react";

const defaultNavItems = [
  { name: "Inicio", icon: Home, path: "/inicio", isHome: true },
  { name: "Inmuebles", icon: Building2, path: "/inmuebles" },
  { name: "Clientes", icon: Users, path: "/clientes" },
  { name: "Alquileres", icon: Key, path: "/alquileres" },
  { name: "Proveedores", icon: Truck, path: "/proveedores" }, 
  { name: "Incidencias", icon: CircleAlert, path: "/incidencias" },
  { name: "Reformas", icon: Hammer, path: "/reformas" }
];

export default function Sidebar({ collapsed, navItems }) {
  const location = useLocation();
  const items = navItems || defaultNavItems;
  const homeItem = items.find(i => i.isHome);
  const HomeIcon = homeItem?.icon;

  return (
    <aside
      className={`$ {
        collapsed ? "min-w-[64px] w-[64px]" : "w-56"
      } bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}
    >
      <nav className="flex-1 overflow-y-auto pb-4 pt-4">
        <div className="px-4">
          {homeItem && (
            <NavLink
              to={homeItem.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 h-[40px] w-full text-gray-700 rounded transition text-base font-medium ${
                  isActive ? "bg-gray-100 text-gray-700" : "hover:bg-gray-100"
                }`
              }
            >
              {HomeIcon && <HomeIcon className={`w-4 h-4 shrink-0${collapsed ? "" : " mr-3"}`} />}
              {!collapsed && homeItem.name}
            </NavLink>
          )}
        </div>
        <div className="h-[1px] bg-gray-200 mx-4 my-3" />
        <div className="space-y-[6px] px-4">
          {items
            .filter((item) => !item.isHome)
            .map((item) => {
              const Icon = item.icon;
              return (
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
                  {Icon && <Icon className={`w-4 h-4 shrink-0${collapsed ? "" : " mr-3"}`} />}
                  {!collapsed && item.name}
                </NavLink>
              );
            })}
        </div>
      </nav>
    </aside>
  );
}
