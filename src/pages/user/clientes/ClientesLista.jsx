import { useEffect, useState } from "react";
import EntityTable from "../../../components/template/EntityTable";
import { getClientes } from "../../../services/clientesService";
import { clientesColumns } from "../../../schemas/clientesSchema";

export default function ClientesLista() {
  const [clientes, setClientes] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setStatus("loading");
      setError(null);
      try {
        const data = await getClientes();
        setClientes(data);
        setStatus("ok");
      } catch (err) {
        console.error("Error al cargar clientes:", err);
        setError(err?.message || "Ocurrió un error inesperado");
        setStatus("error");
      }
    };
    fetchData();
  }, []);

  return (
    <EntityTable
      title="Clientes"
      columns={clientesColumns}
      data={clientes}
      status={status}
      error={error}
    />
  );
}
