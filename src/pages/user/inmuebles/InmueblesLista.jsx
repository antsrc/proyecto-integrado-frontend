import { useEffect, useState } from "react";
import EntityTable from "../../../components/template/EntityTable";
import { getInmuebles } from "../../../services/inmueblesService";
import { inmueblesColumns } from "../../../schemas/inmueblesSchema";

export default function InmueblesLista() {
  const [inmuebles, setInmuebles] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setStatus("loading");
      setError(null);
      try {
        const data = await getInmuebles();
        setInmuebles(data);
        setStatus("ok");
      } catch (err) {
        console.error("Error al cargar inmuebles:", err);
        setError(err?.message || "Ocurrió un error inesperado");
        setStatus("error");
      }
    };

    fetchData();
  }, []);

  return (
    <EntityTable
      title="Inmuebles"
      columns={inmueblesColumns}
      data={inmuebles}
      status={status}
      error={error}
    />
  );
}
