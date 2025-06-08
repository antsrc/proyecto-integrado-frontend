import Layout from "./Layout";
import { UserCog, ClipboardList, AlertTriangle } from "lucide-react";

const adminPathToTitle = {
  "/usuarios": "Usuarios",
  "/audit-logs": "Log de Auditoría",
  "/error-logs": "Log de Errores",
};

const adminSidebarItems = [
  { name: "Usuarios", icon: UserCog, path: "/usuarios" },
  { name: "Log Auditoría", icon: ClipboardList, path: "/audit-logs" },
  { name: "Log Errores", icon: AlertTriangle, path: "/error-logs" },
];

export default function AdminLayout() {
  return (
    <Layout
      pathToTitle={adminPathToTitle}
      sidebarItems={adminSidebarItems}
      sidebarProps={{ showDivider: false }}
    />
  );
}
