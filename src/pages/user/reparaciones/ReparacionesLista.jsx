import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import EntityTable from "../../../components/template/EntityTable";
import { getReparaciones, getIdsConFactura } from "../../../services/reparacionesService";
import { reparacionesColumns } from "../../../schemas/reparacionesSchema";

export default function ReparacionesLista() {
  const location = useLocation();
  const [reparaciones, setReparaciones] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setStatus("loading");
      setError(null);
      try {
        const [data, idsConFactura] = await Promise.all([
          getReparaciones(),
          getIdsConFactura()
        ]);
        setReparaciones(
          data.map((reparacion) => ({
            ...reparacion,
            incidencia: reparacion.incidencia?.codigo || "",
            proveedor: reparacion.proveedor?.codigo || "",
            factura: idsConFactura.includes(reparacion.id)
              ? { id: reparacion.id, type: "reparaciones" }
              : null,
          }))
        );
        setStatus("ok");
      } catch (err) {
        setError(err?.message || "Ocurrió un error inesperado");
        setStatus("error");
      }
    };
    fetchData();
  }, []);

  return (
    <EntityTable
      title="Reparaciones"
      columns={reparacionesColumns}
      data={reparaciones}
      status={status}
      error={error}
      docSearchDefault={location.state?.docSearchDefault}
    />
  );
}
