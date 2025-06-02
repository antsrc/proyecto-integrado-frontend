import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReparacionById, updateReparacion, deleteReparacion, updateFactura, existsFactura } from "../../../services/reparacionesService";
import EntityForm from "../../../components/template/EntityForm";
import { reparacionesFields } from "../../../schemas/reparacionesSchema";

export default function ReparacionesEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);
  const [existsDoc, setExistsDoc] = useState(false);
  const [fields] = useState(reparacionesFields);

  useEffect(() => {
    setIsNotFound(false);
    getReparacionById(id)
      .then(async (data) => {
        setInitialValues({
          ...data,
          incidenciaId: "0",
          proveedorId: "0",
        });
        const exists = await existsFactura(id);
        setExistsDoc(exists);
      })
      .catch(() => {
        setIsNotFound(true);
      });
  }, [id]);

  const mappedFields = fields.map(field => {
    if (field.name === "incidenciaId" && initialValues?.incidencia?.codigo) {
      return {
        ...field,
        options: [{ value: "0", label: initialValues.incidencia.codigo }],
      };
    }
    if (field.name === "proveedorId" && initialValues?.proveedor?.codigo) {
      return {
        ...field,
        options: [{ value: "0", label: initialValues.proveedor.codigo }],
      };
    }
    return field;
  });

  const handleSubmit = async (data) => {
    if (data && data._noChanges_) {
      navigate("/incidencias/reparaciones", {
        state: { success: "Reparación actualizada con éxito" },
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await updateReparacion(id, data);
      navigate("/incidencias/reparaciones", {
        state: { success: "Reparación actualizada con éxito" },
      });
    } catch (error) {
      const backendError = error?.response?.data;
      if (backendError) {
        setError(backendError);
      } else {
        setError({ message: error.message || "Hubo un error al actualizar la reparación." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitDoc = async (file) => {
    if (!file) return;
    setIsSubmittingDoc(true);
    try {
      await updateFactura(id, file);
      navigate("/incidencias/reparaciones", {
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
      await deleteReparacion(id);
      navigate("/incidencias/reparaciones", {
        state: { success: "Reparación eliminada con éxito" },
      });
    } catch {
      setError({ message: "Hubo un error al eliminar la reparación" });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!initialValues && !isNotFound) return null;

  return (
    <EntityForm
      entityName="reparacion"
      fields={mappedFields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/incidencias/reparaciones")}
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
