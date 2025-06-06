import Layout from "./Layout";
import { UserCog, Home, FileText, AlertTriangle } from "lucide-react";

const adminPathToTitle = {
  "/admin": "Panel de administración",
  "/usuarios": "Usuarios",
  "/audit-logs": "Log de Auditoría",
  "/error-logs": "Log de Errores",
};

const adminSidebarItems = [
  { name: "Panel", icon: Home, path: "/admin", isHome: true },
  { name: "Usuarios", icon: UserCog, path: "/usuarios" },
  { name: "Log Auditoría", icon: FileText, path: "/audit-logs" },
  { name: "Log Errores", icon: AlertTriangle, path: "/error-logs" },
];

export default function AdminLayout() {
  return <Layout pathToTitle={adminPathToTitle} sidebarItems={adminSidebarItems} />;
}
