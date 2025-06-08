import React from "react";
import NotificationBox from "../../../components/template/NotificationBox";

export function DocumentosBox({ registrosSinDocumento }) {
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
  const filtered = items.filter(item => item.count > 0);
  const total = filtered.reduce((acc, item) => acc + (item.count || 0), 0);
  return (
    <NotificationBox
      title="Registros sin documento"
      items={filtered}
      emptyText={<div className="text-gray-400 text-sm py-8 text-center">En estos momentos no hay registros sin documento</div>}
      getCode={item => item.label(item.count).replace(/\d+ (alquiler(es)?|mensualidad(es)?|reparaci[oó]n(es)?|reforma(s)?)/i, item.key.charAt(0).toUpperCase() + item.key.slice(1))}
      getSecondary={item => `${item.count} ${item.label(item.count).match(/sin (contrato|factura)/)?.[0] || ''}`}
      getNavigateTo={item => item.path}
      getNavigateState={() => ({ state: { docSearchDefault: "without" } })}
      getButtonTitle={() => "Filtrar sin documento"}
      notificationCount={total}
    />
  );
}
