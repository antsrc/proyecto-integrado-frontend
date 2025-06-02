import EntitySubnav from "../../../components/template/EntitySubnav";
import { Home, Hammer } from "lucide-react";
import { Outlet } from "react-router-dom";

const items = [
  { label: "Incidencias", to: "."},
  { label: "Reparaciones", to: "reparaciones" },
];

export default function Incidencias() {
  return (
    <>
      <EntitySubnav items={items} />
      <Outlet />
    </>
  );
}
