import { useEffect, useState } from "react";
import EntityTable from "../../../components/template/EntityTable";
import { getProveedores } from "../../../services/proveedoresService";
import { proveedoresColumns } from "../../../schemas/proveedoresSchema";

export default function ProveedoresLista() {
  const [proveedores, setProveedores] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setStatus("loading");
      setError(null);
      try {
        const data = await getProveedores();
        setProveedores(data);
        setStatus("ok");
      } catch (err) {
        console.error("Error al cargar proveedores:", err);
        setError(err?.message || "Ocurrió un error inesperado");
        setStatus("error");
      }
    };
    fetchData();
  }, []);

  return (
    <EntityTable
      title="Proveedores"
      columns={proveedoresColumns}
      data={proveedores}
      status={status}
      error={error}
    />
  );
}
