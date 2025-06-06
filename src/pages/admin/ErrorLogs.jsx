import LogDisplay from "../../components/template/LogDisplay";
import { getErrorLog } from "../../services/logsService";

export default function ErrorLogs() {
  return <LogDisplay title="Log de Errores" fetchLog={getErrorLog} />;
}
