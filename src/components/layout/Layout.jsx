import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const pathToTitle = {
  '/inicio': 'Inicio',
  '/inmuebles': 'Inmuebles',
  '/clientes': 'Clientes',
}

const Layout = () => {
  const location = useLocation()

  const matchedPath = Object.keys(pathToTitle).find((key) =>
    location.pathname.startsWith(key)
  )
  const title = pathToTitle[matchedPath] || ''

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header title={title} />
        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout