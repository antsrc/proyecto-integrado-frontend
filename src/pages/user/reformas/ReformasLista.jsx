import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import EntityTable from "../../../components/template/EntityTable";
import { getReformas, getIdsConFactura } from "../../../services/reformasService";
import { reformasColumns } from "../../../schemas/reformasSchema";

export default function ReformasLista() {
  const location = useLocation();
  const [reformas, setReformas] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setStatus("loading");
      setError(null);
      try {
        const [data, idsFactura] = await Promise.all([
          getReformas(),
          getIdsConFactura(),
        ]);
        setReformas(data.map((reforma) => ({
          ...reforma,
          inmueble: reforma.inmueble?.codigo || "",
          proveedor: reforma.proveedor?.codigo || "",
          factura: idsFactura.includes(reforma.id)
            ? { id: reforma.id, type: "reformas" }
            : null,
        })));
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
      title="Reformas"
      columns={reformasColumns}
      data={reformas}
      status={status}
      error={error}
      docSearchDefault={location.state?.docSearchDefault}
    />
  );
}
