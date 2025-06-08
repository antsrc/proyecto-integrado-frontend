import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { User, ShieldUser, ChevronDown, LogOut, PanelLeftClose, PanelLeft, PanelLeftOpen } from "lucide-react";

export default function Header({ onToggleSidebar, sidebarState }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white px-6 py-3 flex items-center justify-between border-b border-gray-200 relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggleSidebar("closed")}
          className={`text-gray-400 hover:text-gray-600 transition focus:outline-none cursor-pointer rounded-md ${sidebarState === "closed" ? "text-gray-700 shadow-inner" : ""}`}
          aria-label="Cerrar completamente menú lateral"
        >
          <PanelLeftClose className="w-5 h-5" />
        </button>
        <button
          onClick={() => onToggleSidebar("collapsed")}
          className={`text-gray-400 hover:text-gray-600 transition focus:outline-none cursor-pointer rounded-md ${sidebarState === "collapsed" ? "text-gray-700 shadow-inner" : ""}`}
          aria-label="Colapsar menú lateral a iconos"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => onToggleSidebar("open")}
          className={`text-gray-400 hover:text-gray-600 transition focus:outline-none cursor-pointer rounded-md ${sidebarState === "open" ? "text-gray-700 shadow-inner" : ""}`}
          aria-label="Abrir menú lateral con texto"
        >
          <PanelLeftOpen className="w-5 h-5" />
        </button>
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[70vw] whitespace-nowrap overflow-hidden text-ellipsis hidden md:flex items-center gap-2">
        <img src="/finalicon.svg" alt="Logo" className="h-7 w-7 object-contain" />
        <h1 className="text-2xl font-bold text-purple-600">Gestión Inmobiliaria S.L.</h1>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer transition"
        >
          {user?.rol === "admin" ? (
            <ShieldUser className="w-5 h-5" />
          ) : (
            <User className="w-5 h-5" />
          )}
          <span>{user?.nombre || "Usuario"}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-sm z-10 overflow-hidden">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
