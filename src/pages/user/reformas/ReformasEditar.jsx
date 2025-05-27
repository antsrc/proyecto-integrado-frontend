import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReformaById, updateReforma, deleteReforma, updateFactura, existsFactura } from "../../../services/reformasService";
import EntityForm from "../../../components/template/EntityForm";
import { reformasFields } from "../../../schemas/reformasSchema";

export default function ReformasEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);
  const [existsDoc, setExistsDoc] = useState(false);
  const [fields] = useState(reformasFields);

  useEffect(() => {
    setIsNotFound(false);
    getReformaById(id)
      .then(async (data) => {
        setInitialValues({
          ...data,
          inmuebleId: "0",
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
    if (field.name === "inmuebleId" && initialValues?.inmueble?.codigo) {
      return {
        ...field,
        options: [{ value: "0", label: initialValues.inmueble.codigo }],
        disabled: true,
      };
    }
    if (field.name === "proveedorId" && initialValues?.proveedor?.codigo) {
      return {
        ...field,
        options: [{ value: "0", label: initialValues.proveedor.codigo }],
        disabled: true,
      };
    }
    return field;
  });

  const handleSubmit = async (data) => {
    if (data && data._noChanges_) {
      navigate("/reformas", {
        state: { success: "Reforma actualizada con éxito" },
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await updateReforma(id, data);
      navigate("/reformas", {
        state: { success: "Reforma actualizada con éxito" },
      });
    } catch (error) {
      const backendError = error?.response?.data;
      if (backendError) {
        setError(backendError);
      } else {
        setError({ message: error.message || "Hubo un error al actualizar la reforma." });
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
      navigate("/reformas", {
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
      await deleteReforma(id);
      navigate("/reformas", {
        state: { success: "Reforma eliminada con éxito" },
      });
    } catch {
      setError({ message: "Hubo un error al eliminar la reforma" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <EntityForm
      entityName="reforma"
      fields={mappedFields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/reformas")}
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
