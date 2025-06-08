import React from "react";
import NotificationBox from "../../../components/template/NotificationBox";

function diasHasta(fechaBaja) {
  const hoy = new Date();
  const fecha = new Date(fechaBaja);
  hoy.setHours(0,0,0,0);
  fecha.setHours(0,0,0,0);
  const diffMs = fecha - hoy;
  const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDias === 0) return "Termina hoy";
  if (diffDias === 1) return "Termina en 1 día";
  if (diffDias > 1) return `Termina en ${diffDias} días`;
  if (diffDias < 0) return "Finalizado";
}

export function AlquileresBox({ alquileresFinalizando }) {
  const ordenados = [...(alquileresFinalizando || [])].sort((a, b) => {
    const fechaA = new Date(a.fechaBaja);
    const fechaB = new Date(b.fechaBaja);
    return fechaA - fechaB;
  });
  return (
    <NotificationBox
      title="Alquileres finalizando"
      items={ordenados}
      emptyText={<div className="text-gray-400 text-sm py-8 text-center">En estos momentos no hay alquileres finalizando</div>}
      getCode={a => a.codigo || '-'}
      getSecondary={a => diasHasta(a.fechaBaja)}
      getNavigateTo={() => "/alquileres"}
      getNavigateState={a => ({ state: { searchDefault: a.codigo } })}
      getButtonTitle={() => "Buscar este alquiler"}
    />
  );
}
