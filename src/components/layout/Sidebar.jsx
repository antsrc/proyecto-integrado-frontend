import { NavLink, useLocation } from 'react-router-dom'
import { Building2, Users, Home } from 'lucide-react'

const navItems = [
  { name: 'Inicio', icon: Home, path: '/inicio', isHome: true },
  { name: 'Inmuebles', icon: Building2, path: '/inmuebles' },
  { name: 'Clientes', icon: Users, path: '/clientes' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-purple-600">Logotipo</h1>
      </div>

      <div className="border-b border-gray-200 mx-4" />

      <nav className="flex-1 overflow-y-auto pb-4 pt-4">
        {/* Inicio */}
        <div className="px-4">
          <NavLink
            to="/inicio"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-gray-700 rounded transition text-base font-medium ${
                isActive ? 'bg-gray-100 text-gray-700' : 'hover:bg-gray-100'
              }`
            }
          >
            <Home className="w-4 h-4 mr-3" />
            Inicio
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
                  `flex items-center px-4 py-2 text-gray-700 rounded transition text-base font-medium ${
                    location.pathname.startsWith(item.path) || isActive
                      ? 'bg-gray-100 text-gray-700'
                      : 'hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.name}
              </NavLink>
            ))}
        </div>
      </nav>
    </aside>
  )
}
