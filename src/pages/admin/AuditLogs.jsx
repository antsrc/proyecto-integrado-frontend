import LogDisplay from "../../components/template/LogDisplay";
import { getAuditLog } from "../../services/logsService";

export default function AuditLogs() {
  return <LogDisplay title="Log de Auditoría" fetchLog={getAuditLog} />;
}
