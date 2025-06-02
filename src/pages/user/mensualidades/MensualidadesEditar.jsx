import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMensualidadById, updateMensualidad, deleteMensualidad, updateFacturaMensualidad, existsFacturaMensualidad } from "../../../services/mensualidadesService";
import EntityForm from "../../../components/template/EntityForm";
import { mensualidadesFields } from "../../../schemas/mensualidadesSchema";

export default function MensualidadesEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);
  const [existsDoc, setExistsDoc] = useState(false);
  const [fields] = useState(mensualidadesFields);

  useEffect(() => {
    setIsNotFound(false);
    getMensualidadById(id)
      .then(async (data) => {
        setInitialValues({
          ...data,
          alquilerId: "0",
        });
        const exists = await existsFacturaMensualidad(id);
        setExistsDoc(exists);
      })
      .catch(() => {
        setIsNotFound(true);
      });
  }, [id]);

  const mappedFields = fields.map(field => {
    if (field.name === "alquilerId" && initialValues?.alquiler?.codigo) {
      return {
        ...field,
        options: [{ value: "0", label: initialValues.alquiler.codigo }],
        disabled: true,
      };
    }
    if ((field.name === "fechaPago" || field.name === "formaPago") && initialValues?.[field.name] != null) {
      return {
        ...field,
        disabled: true,
      };
    }
    return field;
  });

  const handleSubmit = async (data) => {
    if (data && data._noChanges_) {
      navigate("/alquileres/mensualidades", {
        state: { success: "Mensualidad actualizada con éxito" },
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await updateMensualidad(id, data);
      navigate("/alquileres/mensualidades", {
        state: { success: "Mensualidad actualizada con éxito" },
      });
    } catch (error) {
      const backendError = error?.response?.data;
      if (backendError) {
        setError(backendError);
      } else {
        setError({ message: error.message || "Hubo un error al actualizar la mensualidad." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitDoc = async (file) => {
    if (!file) return;
    setIsSubmittingDoc(true);
    try {
      await updateFacturaMensualidad(id, file);
      navigate("/alquileres/mensualidades", {
        state: { success: "Factura actualizada con éxito" },
      });
    } catch (error) {
      setError({ message: error?.response?.data?.message || "Hubo un error al subir la factura." });
    } finally {
      setIsSubmittingDoc(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMensualidad(id);
      navigate("/alquileres/mensualidades", {
        state: { success: "Mensualidad eliminada con éxito" },
      });
    } catch {
      setError({ message: "Hubo un error al eliminar la mensualidad" });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!initialValues && !isNotFound) return null;

  return (
    <EntityForm
      entityName="mensualidad"
      fields={mappedFields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/alquileres/mensualidades")}
      error={error}
      onErrorClose={() => setError(null)}
      isSubmitting={isSubmitting}
      isSubmittingDoc={isSubmittingDoc}
      isNotFound={isNotFound}
      onDelete={handleDelete}
      isDeleting={isDeleting}
      docName="factura"
      onSubmitDoc={handleSubmitDoc}
      existsDoc={existsDoc}
    />
  );
}
