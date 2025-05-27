import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getIncidenciaById, updateIncidencia, deleteIncidencia } from "../../../services/incidenciasService";
import EntityForm from "../../../components/template/EntityForm";
import { incidenciasFields } from "../../../schemas/incidenciasSchema";

export default function IncidenciasEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fields, setFields] = useState(incidenciasFields);

  useEffect(() => {
    setIsNotFound(false);
    getIncidenciaById(id)
      .then((data) => {
        setInitialValues({
          ...data,
          alquilerId: "0",
        });
        setFields((prev) =>
          prev.map((field) => {
            if (field.name === "alquilerId" && data.alquiler?.codigo) {
              return {
                ...field,
                options: [{ value: "0", label: data.alquiler.codigo }],
                disabled: true,
              };
            }
            return field;
          })
        );
      })
      .catch(() => {
        setIsNotFound(true);
      });
  }, [id]);

  const handleSubmit = async (data) => {
    if (data && data._noChanges_) {
      navigate("/incidencias", {
        state: { success: "Incidencia actualizada con éxito" },
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await updateIncidencia(id, data);
      navigate("/incidencias", {
        state: { success: "Incidencia actualizada con éxito" },
      });
    } catch (error) {
      const backendError = error?.response?.data;
      if (backendError) {
        setError(backendError);
      } else {
        setError({ message: error.message || "Hubo un error al actualizar la incidencia." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteIncidencia(id);
      navigate("/incidencias", {
        state: { success: "Incidencia eliminada con éxito" },
      });
    } catch {
      setError({ message: "Hubo un error al eliminar la incidencia" });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!initialValues && !isNotFound) return null;

  return (
    <EntityForm
      entityName="incidencia"
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/incidencias")}
      error={error}
      onErrorClose={() => setError(null)}
      isSubmitting={isSubmitting}
      isNotFound={isNotFound}
      onDelete={handleDelete}
      isDeleting={isDeleting}
    />
  );
}
