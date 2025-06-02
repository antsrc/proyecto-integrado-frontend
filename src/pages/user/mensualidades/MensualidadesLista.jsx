import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import EntityTable from "../../../components/template/EntityTable";
import { getMensualidades, getIdsConFactura } from "../../../services/mensualidadesService";
import { mensualidadesColumns } from "../../../schemas/mensualidadesSchema";

export default function MensualidadesLista() {
  const location = useLocation();
  const [mensualidades, setMensualidades] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setStatus("loading");
      setError(null);
      try {
        const [data, idsFactura] = await Promise.all([
          getMensualidades(),
          getIdsConFactura(),
        ]);
        setMensualidades(
          data.map((mensualidad) => ({
            ...mensualidad,
            alquiler: mensualidad.alquiler?.codigo || "",
            factura: idsFactura.includes(mensualidad.id)
              ? { id: mensualidad.id, type: "mensualidades" }
              : null,
            pagada: mensualidad.fechaPago != null,
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
      title="Mensualidades"
      columns={mensualidadesColumns}
      data={mensualidades}
      status={status}
      error={error}
      searchDefault={location.state?.searchDefault || ""}
      booleanSearchDefault={location.state?.booleanSearchDefault}
      docSearchDefault={location.state?.docSearchDefault}
    />
  );
}
