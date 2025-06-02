import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createReparacion } from "../../../services/reparacionesService";
import { getIncidenciasIdCodigo } from "../../../services/incidenciasService";
import { getProveedoresIdCodigo } from "../../../services/proveedoresService";
import EntityForm from "../../../components/template/EntityForm";
import { reparacionesFields } from "../../../schemas/reparacionesSchema";

export default function ReparacionesNuevo() {
  const navigate = useNavigate();
  const location = useLocation();
  const incidenciaPreseleccionada = location.state?.incidencia;
  const proveedorPreseleccionado = location.state?.proveedor;
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fields, setFields] = useState(reparacionesFields);
  const [initialValues, setInitialValues] = useState({});

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
              if (incidenciaPreseleccionada?.id) {
                return {
                  ...field,
                  options: [
                    {
                      value: incidenciaPreseleccionada.id,
                      label:
                        incidenciaPreseleccionada.codigo ||
                        incidenciaPreseleccionada.id,
                    },
                  ],
                  disabled: true,
                };
              }
              return {
                ...field,
                options: incidencias.map((i) => ({
                  value: i.id,
                  label: i.codigo,
                })),
              };
            }
            if (field.name === "proveedorId") {
              if (proveedorPreseleccionado?.id) {
                return {
                  ...field,
                  options: [
                    {
                      value: proveedorPreseleccionado.id,
                      label:
                        proveedorPreseleccionado.codigo ||
                        proveedorPreseleccionado.id,
                    },
                  ],
                  disabled: true,
                };
              }
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
        setInitialValues({
          ...(incidenciaPreseleccionada?.id && {
            incidenciaId: incidenciaPreseleccionada.id,
            incidenciaCodigo: incidenciaPreseleccionada.codigo,
          }),
          ...(proveedorPreseleccionado?.id && {
            proveedorId: proveedorPreseleccionado.id,
            proveedorCodigo: proveedorPreseleccionado.codigo,
          }),
        });
      } catch {
        setError({
          message: "No pudieron obtenerse las opciones para los campos",
        });
      }
    }
    fetchOptions();
  }, [incidenciaPreseleccionada, proveedorPreseleccionado]);

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
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/incidencias/reparaciones")}
      error={error}
      onErrorClose={() => setError(null)}
      isSubmitting={isSubmitting}
    />
  );
}
