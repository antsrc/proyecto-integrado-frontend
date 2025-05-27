import { useEffect, useState } from "react";
import EntityTable from "../../../components/template/EntityTable";
import { incidenciasColumns } from "../../../schemas/incidenciasSchema";
import { getIncidencias } from "../../../services/incidenciasService";

export default function IncidenciasLista() {
  const [incidencias, setIncidencias] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setStatus("loading");
      setError(null);
      try {
        const data = await getIncidencias();
setIncidencias(
  data.map((incidencia) => ({
    ...incidencia,
    alquiler: incidencia.alquiler?.codigo || "",
    cliente: incidencia.alquiler?.cliente?.codigo || "",
    inmueble: incidencia.alquiler?.inmueble?.codigo || "",
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
      title="Incidencias"
      columns={incidenciasColumns}
      data={incidencias}
      status={status}
      error={error}
    />
  );
}
