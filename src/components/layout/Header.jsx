import { useState, useRef, useEffect } from "react"
import { useAuth } from "../../hooks/useAuth"
import { User, ChevronDown, LogOut } from "lucide-react"

export default function Header({ title }) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleLogout = async () => {
    await logout()
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200 relative">
      <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center space-x-2 text-sm text-gray-700 hover:text-purple-600 transition"
        >
          <User className="w-5 h-5" />
          <span>{user?.nombre || "Usuario"}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-md z-10 overflow-hidden">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
