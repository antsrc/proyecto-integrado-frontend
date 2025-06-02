import { Outlet } from "react-router-dom";
import EntitySubnav from "../../../components/template/EntitySubnav";

export default function Mensualidades() {
  return (
    <>
      <EntitySubnav entity="mensualidades" />
      <Outlet />
    </>
  );
}
