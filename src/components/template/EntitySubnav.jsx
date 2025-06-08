import { NavLink, useLocation } from "react-router-dom"

export default function Subnav({ items }) {
  const location = useLocation()

  const match = location.pathname.match(/^\/(\w+)/)
  const basePath = match ? `/${match[1]}` : ""

  const isTabActive = (to) => {
    if (to === ".") {
      return (
        location.pathname === basePath ||
        location.pathname === basePath + "/" ||
        location.pathname.startsWith(basePath + "/nuevo") ||
        location.pathname.startsWith(basePath + "/editar")
      )
    }
    const childPath = `${basePath}/${to}`.replace(/\/$/, "")
    return (
      location.pathname === childPath ||
      location.pathname.startsWith(childPath + "/")
    )
  }

  return (
    <nav className="border-b border-gray-200 mb-6">
      <ul className="flex justify-start space-x-10 text-sm font-medium text-gray-500">
        {items.map(({ label, to }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={() =>
                `relative inline-block pb-3 transition-colors duration-200 ${
                  isTabActive(to)
                    ? "text-purple-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-700"
                    : "hover:text-purple-700"
                }`
              }
              end
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
