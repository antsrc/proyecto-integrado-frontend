import { Outlet } from "react-router-dom";
import EntitySubnav from "../../../components/template/EntitySubnav";
import { Home, Plus, FileText } from "lucide-react";

const items = [
  { label: "Listado", to: "." },
  { label: "Mensualidades", to: "mensualidades"},
];

export default function Alquileres() {
  return (
    <>
      <EntitySubnav items={items} />
      <Outlet />
    </>
  );
}
