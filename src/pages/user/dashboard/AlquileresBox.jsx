import React from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

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
  const navigate = useNavigate();
  // Ordenar de los que terminan antes a los que terminan después
  const ordenados = [...(alquileresFinalizando || [])].sort((a, b) => {
    const fechaA = new Date(a.fechaBaja);
    const fechaB = new Date(b.fechaBaja);
    return fechaA - fechaB;
  });
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Alquileres finalizando</h2>
      {ordenados.length > 0 ? (
        <ul className="divide-y divide-gray-100">
          {ordenados.map((a, i) => (
            <li key={i} className="py-2 flex items-center gap-4">
              <button
                className="text-gray-500 hover:text-blue-600 focus:outline-none"
                title="Buscar este alquiler"
                onClick={() => navigate("/alquileres", { state: { searchDefault: a.codigo } })}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Search size={18} className="mr-1" />
              </button>
              <span className="font-mono text-sm text-gray-700">{a.codigo || '-'}</span>
              <span className="text-xs text-gray-500">{diasHasta(a.fechaBaja)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No hay alquileres finalizando.</p>
      )}
    </div>
  );
}
