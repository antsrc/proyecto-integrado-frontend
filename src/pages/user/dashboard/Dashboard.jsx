import Layout from "../../../components/layout/Layout";
import { useAuth } from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import { getResumenNotificaciones } from "../../../services/dashboardService";
import { IncidenciasBox } from "./IncidenciasBox";
import { MensualidadesBox } from "./MensualidadesBox";
import { AlquileresBox } from "./AlquileresBox";
import { DocumentosBox } from "./DocumentosBox";
import Loading from "../../../components/utils/Loading";

export default function UserDashboard() {
  const { user, loading } = useAuth();
  const [incidencias, setIncidencias] = useState([]);
  const [mensualidadesSinPagar, setMensualidadesSinPagar] = useState([]);
  const [alquileresFinalizando, setAlquileresFinalizando] = useState([]);
  const [registrosSinDocumento, setRegistrosSinDocumento] = useState(null);
  const [loadingIncidencias, setLoadingIncidencias] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getResumenNotificaciones()
      .then((res) => {
        setIncidencias(res.incidenciasActivas || []);
        setMensualidadesSinPagar(res.mensualidadesSinPagar || []);
        setAlquileresFinalizando(res.alquileresFinalizando || []);
        setRegistrosSinDocumento(res.registrosSinDocumento || null);
        setLoadingIncidencias(false);
      })
      .catch(() => {
        setError("Error cargando los datos");
        setLoadingIncidencias(false);
      });
  }, []);

  if (loading) return <Loading texto="Cargando..." />;
  if (!user) return <p>No estás autenticado</p>;

  return (
    <div>
      {loadingIncidencias ? (
        <Loading texto="Cargando..." />
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          <IncidenciasBox incidencias={incidencias} />
          <div className="flex flex-col md:flex-row gap-6 mt-6">
            <div className="flex-1 min-w-0">
              <AlquileresBox alquileresFinalizando={alquileresFinalizando} />
            </div>
            <div className="flex-1 min-w-0">
              <MensualidadesBox mensualidadesSinPagar={mensualidadesSinPagar} />
            </div>
            <div className="flex-1 min-w-0">
              <DocumentosBox registrosSinDocumento={registrosSinDocumento} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
