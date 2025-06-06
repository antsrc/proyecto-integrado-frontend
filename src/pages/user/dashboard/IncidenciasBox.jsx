import React, { useState, useEffect } from "react";
import { CircleAlert, Search } from "lucide-react";
import { getProveedoresIdCodigo } from "../../../services/proveedoresService";
import { updateIncidencia } from "../../../services/incidenciasService";
import Toast from "../../../components/utils/Toast";
import { useNavigate } from "react-router-dom";

export function IncidenciasBox({ incidencias }) {
  const [incidenciasState, setIncidenciasState] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getProveedoresIdCodigo().then(setProveedores);
  }, []);

  useEffect(() => {
    // Clonar incidencias para manejar localmente sin modificar prop directo
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

    // Solo update si cambia el valor real
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
      // Si el checkbox se activa y no hay proveedor asignado,
      // lo dejamos checked pero sin proveedor seleccionado (a elegir)
      const updated = [...incidenciasState];
      updated[index] = { ...incidencia, checkboxChecked: true };
      setIncidenciasState(updated);
    } else {
      // Solo actualizar checkbox local (por si cambia desde true a true o false a false)
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

  return (
    <div className="bg-white rounded-lg px-6 py-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`rounded-full flex items-center justify-center w-10 h-10 ${
            incidenciasState.length > 0
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          <CircleAlert size={28} />
        </div>
        <h2 className="text-lg font-semibold">
          {incidenciasState.length > 0
            ? `Incidencias abiertas (${incidenciasState.length})`
            : "No hay incidencias abiertas"}
        </h2>
      </div>

      {incidenciasState.length > 0 && (
        <div className="divide-y divide-gray-100">
          {incidenciasState.map((incidencia, i) => {
            const proveedorSeleccionado =
              proveedores.find(
                (p) => p.id === incidencia.proveedorAvisadoId
              ) || null;

            return (
              <div
                key={incidencia.codigo}
                className="flex items-center justify-between py-3"
              >
                <div className="font-mono text-sm text-gray-700 flex items-center gap-2">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    title="Ver en lista de incidencias"
                    onClick={() =>
                      navigate("/incidencias", {
                        state: { searchDefault: incidencia.codigo },
                      })
                    }
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  {incidencia.codigo}
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-gray-500">
                    <input
                      type="checkbox"
                      checked={incidencia.checkboxChecked}
                      onChange={(e) =>
                        handleCheckboxChange(i, e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    ¿Proveedor avisado?
                  </label>
                  <select
                    className={`border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      !incidencia.checkboxChecked
                        ? "bg-gray-100 text-gray-400"
                        : "bg-white text-gray-800"
                    }`}
                    onChange={(e) =>
                      handleProveedorSelect(i, Number(e.target.value))
                    }
                    value={incidencia.proveedorAvisadoId || ""}
                    disabled={!incidencia.checkboxChecked}
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
                  <button
                    className={`ml-2 px-3 py-1 rounded text-xs font-medium transition-colors ${
                      incidencia.proveedorAvisadoId !== null
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={incidencia.proveedorAvisadoId === null}
                    onClick={() => {
                      if (!proveedorSeleccionado) {
                        setToast({
                          type: "error",
                          message:
                            "Seleccione un proveedor válido antes de continuar",
                        });
                        return;
                      }
                      navigate("/incidencias/reparaciones/nuevo", {
                        state: {
                          incidencia: {
                            id: incidencia.id,
                            codigo: incidencia.codigo,
                          },
                          proveedor: proveedorSeleccionado,
                        },
                      });
                    }}
                  >
                    Crear reparación
                  </button>
                </div>
              </div>
            );
          })}
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
