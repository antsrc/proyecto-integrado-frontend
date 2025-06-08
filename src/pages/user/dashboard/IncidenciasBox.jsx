import React, { useState, useEffect } from "react";
import { CircleAlert, Search } from "lucide-react";
import { getProveedoresIdCodigo } from "../../../services/proveedoresService";
import { updateIncidencia } from "../../../services/incidenciasService";
import Toast from "../../../components/utils/Toast";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/utils/Loading";

export function IncidenciasBox({ incidencias }) {
  const [incidenciasState, setIncidenciasState] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getProveedoresIdCodigo().then(setProveedores);
  }, []);

  useEffect(() => {
    setIncidenciasState(
      incidencias.map((inc) => ({
        ...inc,
        proveedorAvisadoId:
          inc.proveedorAvisadoId !== null ? inc.proveedorAvisadoId : null,
        checkboxChecked: inc.proveedorAvisadoId !== null,
      }))
    );
  }, [incidencias]);

  const handleCheckboxChange = async (index, checked) => {
    const incidencia = incidenciasState[index];

    if (!checked && incidencia.proveedorAvisadoId !== null) {
      try {
        await updateIncidencia(incidencia.id, { proveedorAvisadoId: null });
        const updated = [...incidenciasState];
        updated[index] = {
          ...incidencia,
          proveedorAvisadoId: null,
          checkboxChecked: false,
        };
        setIncidenciasState(updated);
      } catch {
        setToast({
          type: "error",
          message: "No se pudo desvincular el proveedor",
        });
      }
    } else if (checked && incidencia.proveedorAvisadoId === null) {
      const updated = [...incidenciasState];
      updated[index] = { ...incidencia, checkboxChecked: true };
      setIncidenciasState(updated);
    } else {
      const updated = [...incidenciasState];
      updated[index] = { ...incidencia, checkboxChecked: checked };
      setIncidenciasState(updated);
    }
  };

  const handleProveedorSelect = async (index, proveedorId) => {
    const incidencia = incidenciasState[index];
    try {
      await updateIncidencia(incidencia.id, { proveedorAvisadoId: proveedorId });
      const updated = [...incidenciasState];
      updated[index] = {
        ...incidencia,
        proveedorAvisadoId: proveedorId,
        checkboxChecked: proveedorId !== null,
      };
      setIncidenciasState(updated);
    } catch {
      setToast({ type: "error", message: "No se pudo asignar el proveedor" });
    }
  };

  if (!incidencias) {
    return <Loading texto="Cargando incidencias..." />;
  }

  return (
    <div className="bg-white rounded-lg px-6 py-6 shadow-sm">
      <div className="flex items-center mb-4 gap-2">
        <span className={`inline-flex items-center justify-center rounded-full font-semibold text-sm w-7 h-7
        ${incidenciasState.length > 0
          ? 'bg-yellow-300 text-yellow-700'
          : 'bg-green-100 text-green-600'}
      `}>
          {incidenciasState.length}
        </span>
        <h2 className="text-lg font-semibold ml-2">
          {`Incidencias abiertas`}
        </h2>
      </div>

      {incidenciasState.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {incidenciasState.map((incidencia, i) => (
            <div
              key={incidencia.codigo}
              className="flex items-center py-2.5 font-sans"
            >
              {/* Código alineado a la izquierda, ancho fijo para hasta 30 caracteres */}
              <span className="text-sm text-gray-700 flex items-center justify-start min-w-[18ch] max-w-[30ch] pr-4">
                {incidencia.codigo}
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-purple-700 focus:text-purple-700 cursor-pointer focus:outline-none transition-colors z-10 relative"
                  title="Ver en lista de incidencias"
                  tabIndex={0}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate("/incidencias", {
                      state: { searchDefault: incidencia.codigo },
                    });
                  }}
                >
                  <Search className="w-4 h-4 pointer-events-none" />
                </button>
              </span>
              <div className="flex-1 flex justify-end items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    checked={incidencia.checkboxChecked}
                    onChange={(e) => handleCheckboxChange(i, e.target.checked)}
                    className="w-4 h-4 accent-purple-600 border-gray-300 rounded focus:ring-purple-400"
                  />
                  ¿Proveedor avisado?
                </label>
                <select
                  className={`border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none transition-colors ${
                    !incidencia.checkboxChecked
                      ? "bg-gray-100 text-gray-400"
                      : "bg-white text-gray-800"
                  }`}
                  onChange={(e) => handleProveedorSelect(i, Number(e.target.value))}
                  value={incidencia.proveedorAvisadoId || ""}
                  disabled={!incidencia.checkboxChecked}
                  style={{ minWidth: 120 }}
                >
                  <option value="" disabled>
                    Seleccionar proveedor
                  </option>
                  {proveedores.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.codigo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-sm py-8 text-center">
          En estos momentos no hay incidencias abiertas
        </div>
      )}

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
