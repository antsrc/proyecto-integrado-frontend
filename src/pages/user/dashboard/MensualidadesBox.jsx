import React from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export function MensualidadesBox({ mensualidadesSinPagar }) {
  const navigate = useNavigate();
  // Ordenar de mayor a menor número de mensualidades sin pagar
  const ordenadas = [...(mensualidadesSinPagar || [])]
    .filter(m => m.codigo)
    .sort((a, b) => b.count - a.count);
  return (
    <div className="bg-white rounded-lg px-6 py-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Mensualidades sin pagar</h2>
      {ordenadas.length > 0 ? (
        <ul className="divide-y divide-gray-100">
          {ordenadas.map((m, i) => (
            <li key={i} className="py-2 flex items-center gap-4">
              <button
                type="button"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                title="Ver en lista de mensualidades"
                onClick={() => navigate("/alquileres/mensualidades", { state: { searchDefault: m.codigo, booleanSearchDefault: { pagada: false } } })}
              >
                <Search className="w-4 h-4" />
              </button>
              <span className="font-mono text-sm text-gray-700">{m.codigo}</span>
              <span className="text-xs text-gray-500">
                {m.count} mensualidad{m.count === 1 ? '' : 'es'}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No hay mensualidades pendientes.</p>
      )}
    </div>
  );
}
