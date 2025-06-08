import React from "react";
import NotificationBox from "../../../components/template/NotificationBox";

export function MensualidadesBox({ mensualidadesSinPagar }) {
  const ordenadas = [...(mensualidadesSinPagar || [])]
    .filter(m => m.codigo)
    .sort((a, b) => b.count - a.count);
  const total = ordenadas.reduce((acc, m) => acc + (m.count || 0), 0);
  return (
    <NotificationBox
      title="Mensualidades sin pagar"
      items={ordenadas}
      emptyText={<div className="text-gray-400 text-sm py-8 text-center">En estos momentos no hay mensualidades sin pagar</div>}
      getCode={m => m.codigo}
      getSecondary={m => `${m.count} mensualidad${m.count === 1 ? '' : 'es'}`}
      getNavigateTo={() => "/alquileres/mensualidades"}
      getNavigateState={m => ({ state: { searchDefault: m.codigo, booleanSearchDefault: { pagada: false } } })}
      getButtonTitle={() => "Ver en lista de mensualidades"}
      notificationCount={total}
    />
  );
}
