import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createIncidencia } from "../../../services/incidenciasService";
import { getAlquileresIdCodigo } from "../../../services/alquileresService";
import EntityForm from "../../../components/template/EntityForm";
import { incidenciasFields } from "../../../schemas/incidenciasSchema";

export default function IncidenciasNuevo() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fields, setFields] = useState(incidenciasFields);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const alquileres = await getAlquileresIdCodigo();
        setFields((prev) =>
          prev.map((field) => {
            if (field.name === "alquilerId") {
              return {
                ...field,
                options: alquileres.map((a) => ({
                  value: a.id,
                  label: a.codigo,
                })),
              };
            }
            return field;
          })
        );
      } catch {
        throw new Error("No pudieron obtenerse los alquileres");
      }
    }
    fetchOptions();
  }, []);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await createIncidencia(data);
      navigate("/incidencias", {
        state: { success: "Incidencia creada con éxito" },
      });
    } catch (error) {
      const backendError = error?.response?.data;
      if (backendError) {
        setError(backendError);
      } else {
        setError({
          message: error.message || "Hubo un error al guardar la incidencia",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EntityForm
      entityName="incidencia"
      fields={fields}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/incidencias")}
      error={error}
      onErrorClose={() => setError(null)}
      isSubmitting={isSubmitting}
    />
  );
}
