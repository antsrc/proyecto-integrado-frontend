import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReparacion } from "../../../services/reparacionesService";
import { getIncidenciasIdCodigo } from "../../../services/incidenciasService";
import { getProveedoresIdCodigo } from "../../../services/proveedoresService";
import EntityForm from "../../../components/template/EntityForm";
import { reparacionesFields } from "../../../schemas/reparacionesSchema";

export default function ReparacionesNuevo() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fields, setFields] = useState(reparacionesFields);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [incidencias, proveedores] = await Promise.all([
          getIncidenciasIdCodigo(),
          getProveedoresIdCodigo(),
        ]);
        setFields((prev) =>
          prev.map((field) => {
            if (field.name === "incidenciaId") {
              return {
                ...field,
                options: incidencias.map((i) => ({
                  value: i.id,
                  label: i.codigo,
                })),
              };
            }
            if (field.name === "proveedorId") {
              return {
                ...field,
                options: proveedores.map((p) => ({
                  value: p.id,
                  label: p.codigo,
                })),
              };
            }
            if (field.name === "fechaFin" || field.name === "importe") {
              return { ...field, disabled: false };
            }
            return field;
          })
        );
      } catch {
        setError({
          message: "No pudieron obtenerse las opciones para los campos",
        });
      }
    }
    fetchOptions();
  }, []);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await createReparacion(data);
      navigate("/incidencias/reparaciones", {
        state: { success: "Reparación creada con éxito" },
      });
    } catch (error) {
      const backendError = error?.response?.data;
      if (backendError) {
        setError(backendError);
      } else {
        setError({
          message: error.message || "Hubo un error al guardar la reparación",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EntityForm
      entityName="reparacion"
      fields={fields}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/incidencias/reparaciones")}
      error={error}
      onErrorClose={() => setError(null)}
      isSubmitting={isSubmitting}
    />
  );
}
