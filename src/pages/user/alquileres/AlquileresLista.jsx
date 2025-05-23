import { useEffect, useState } from "react";
import EntityTable from "../../../components/template/EntityTable";
import { getAlquileres, getIdsConContrato } from "../../../services/alquileresService";
import { alquileresColumns } from "../../../schemas/alquileresSchema";
import DocumentButton from "../../../components/utils/DocumentButton";

export default function AlquileresLista() {
  const [alquileres, setAlquileres] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [idsConContrato, setIdsConContrato] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setStatus("loading");
      setError(null);
      try {
        const [data, idsContrato] = await Promise.all([
          getAlquileres(),
          getIdsConContrato(),
        ]);
        setAlquileres(data);
        setIdsConContrato(idsContrato);
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
      data={alquileres.map((alquiler) => ({
        ...alquiler,
        contrato: idsConContrato.includes(alquiler.id)
          ? <DocumentButton id={alquiler.id} tipo="contrato" />
          : null,
        cliente: typeof alquiler.cliente === 'object' && alquiler.cliente !== null ? (alquiler.cliente.codigo) : alquiler.cliente,
        inmueble: typeof alquiler.inmueble === 'object' && alquiler.inmueble !== null ? (alquiler.inmueble.codigo || alquiler.inmueble.direccion) : alquiler.inmueble,
      }))}
      status={status}
      error={error}
    />
  );
}
