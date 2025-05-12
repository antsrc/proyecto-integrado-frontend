import { NavLink, useLocation } from "react-router-dom"

export default function EntitySubnav({ items }) {
  const location = useLocation()

  return (
    <nav className="flex gap-4 border-b border-gray-200 mb-6">
      {items.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 text-sm font-medium transition rounded-t-md ${
              isActive || location.pathname.endsWith(to)
                ? "text-purple-600 border-b-2 border-purple-600 bg-gray-50"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`
          }
          end
        >
          <Icon className="w-4 h-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
