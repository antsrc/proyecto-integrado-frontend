import { Outlet } from "react-router-dom";
import EntitySubnav from "../../../components/template/EntitySubnav";

const items = [
  { label: "Inmuebles", to: "." },
  { label: "IBIs", to: "ibis" },
  { label: "Rentas", to: "rentas" },
  { label: "Seguros", to: "seguros" },
];

export default function Inmuebles() {
  return (
    <div>
      <EntitySubnav items={items} />
      <Outlet />
    </div>
  );
}
