import { useEffect, useState } from "react";
import EntityTable from "../../../components/template/EntityTable";
import { getAlquileres, getIdsConContrato } from "../../../services/alquileresService";
import { alquileresColumns } from "../../../schemas/alquileresSchema";

export default function AlquileresLista() {
  const [alquileres, setAlquileres] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setStatus("loading");
      setError(null);
      try {
        const [data, idsContrato] = await Promise.all([
          getAlquileres(),
          getIdsConContrato(),
        ]);
        setAlquileres(
          data.map((alquiler) => {
            const hoy = new Date();
            let activo = false;
            if (!alquiler.fechaBaja) {
              activo = true;
            } else {
              const fechaBaja = new Date(alquiler.fechaBaja);
              activo = fechaBaja >= new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
            }
            return {
              ...alquiler,
              contrato: idsContrato.includes(alquiler.id)
                ? { id: alquiler.id, type: "alquileres" }
                : null,
              cliente: alquiler.cliente?.codigo || "",
              inmueble: alquiler.inmueble?.codigo || "",
              activo,
            };
          })
        );
        setStatus("ok");
      } catch (err) {
        console.error("Error al cargar alquileres:", err);
        setError(err?.message || "Ocurrió un error inesperado");
        setStatus("error");
      }
    };
    fetchData();
  }, []);

  return (
    <EntityTable
      title="Alquileres"
      columns={alquileresColumns}
      data={alquileres}
      status={status}
      error={error}
    />
  );
}
