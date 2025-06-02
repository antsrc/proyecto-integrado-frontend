import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMensualidad } from "../../../services/mensualidadesService";
import { getAlquileresIdCodigo } from "../../../services/alquileresService";
import EntityForm from "../../../components/template/EntityForm";
import { mensualidadesFields } from "../../../schemas/mensualidadesSchema";

export default function MensualidadesNuevo() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fields, setFields] = useState(mensualidadesFields);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const alquileres = await getAlquileresIdCodigo();
        setFields((prev) =>
          prev.map((field) => {
            if (field.name === "alquilerId") {
              return {
                ...field,
                options: alquileres.map((a) => ({ value: a.id, label: a.codigo })),
              };
            }
            return field;
          })
        );
      } catch {
        // Opcional: mostrar error de carga de opciones
      }
    }
    fetchOptions();
  }, []);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await createMensualidad(data);
      navigate("/alquileres/mensualidades", {
        state: { success: "Mensualidad creada con éxito" },
      });
    } catch (error) {
      const backendError = error?.response?.data;
      if (backendError) {
        setError(backendError);
      } else {
        setError({ message: error.message || "Hubo un error al guardar la mensualidad" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EntityForm
      entityName="mensualidad"
      fields={fields}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/alquileres/mensualidades")}
      error={error}
      onErrorClose={() => setError(null)}
      isSubmitting={isSubmitting}
    />
  );
}
