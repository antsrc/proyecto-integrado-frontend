import Layout from "./Layout";
import {
  Building2,
  Users,
  Home,
  Key,
  Truck,
  CircleAlert,
  Hammer
} from "lucide-react";

const userPathToTitle = {
  "/inicio": "Inicio",
  "/inmuebles": "Inmuebles",
  "/clientes": "Clientes",
  "/alquileres": "Alquileres",
  "/proveedores": "Proveedores",
  "/incidencias": "Incidencias",
  "/reformas": "Reformas",
};

const userSidebarItems = [
  { name: "Inicio", icon: Home, path: "/inicio", isHome: true },
  { name: "Inmuebles", icon: Building2, path: "/inmuebles" },
  { name: "Clientes", icon: Users, path: "/clientes" },
  { name: "Alquileres", icon: Key, path: "/alquileres" },
  { name: "Proveedores", icon: Truck, path: "/proveedores" },
  { name: "Incidencias", icon: CircleAlert, path: "/incidencias" },
  { name: "Reformas", icon: Hammer, path: "/reformas" }
];

export default function UserLayout() {
  return <Layout pathToTitle={userPathToTitle} sidebarItems={userSidebarItems} />;
}
