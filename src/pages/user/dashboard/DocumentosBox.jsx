import React from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export function DocumentosBox({ registrosSinDocumento }) {
  const navigate = useNavigate();
  if (!registrosSinDocumento) return null;
  const items = [
    {
      key: "alquileres",
      label: (n) => `${n} alquiler${n === 1 ? '' : 'es'} sin contrato`,
      count: registrosSinDocumento.alquileres || 0,
      path: "/alquileres",
      docType: "without"
    },
    {
      key: "mensualidades",
      label: (n) => `${n} mensualidad${n === 1 ? '' : 'es'} sin factura`,
      count: registrosSinDocumento.mensualidades || 0,
      path: "/alquileres/mensualidades",
      docType: "without"
    },
    {
      key: "reparaciones",
      label: (n) => `${n} reparación${n === 1 ? '' : 'es'} sin factura`,
      count: registrosSinDocumento.reparaciones || 0,
      path: "/incidencias/reparaciones",
      docType: "without"
    },
    {
      key: "reformas",
      label: (n) => `${n} reforma${n === 1 ? '' : 's'} sin factura`,
      count: registrosSinDocumento.reformas || 0,
      path: "/reformas",
      docType: "without"
    },
  ];
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Registros sin documento</h2>
      <ul className="divide-y divide-gray-100">
        {items.map((item) =>
          item.count > 0 ? (
            <li key={item.key} className="py-2 flex items-center gap-4">
              <button
                className="text-gray-500 hover:text-blue-600 focus:outline-none"
                title="Filtrar sin documento"
                onClick={() => navigate(item.path, { state: { docSearchDefault: "without" } })}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Search size={18} className="mr-1" />
              </button>
              <span className="text-sm text-gray-700">{item.label(item.count)}</span>
            </li>
          ) : null
        )}
        {items.every(item => item.count === 0) && (
          <li className="py-2 text-gray-500 text-sm">No hay registros pendientes.</li>
        )}
      </ul>
    </div>
  );
}
