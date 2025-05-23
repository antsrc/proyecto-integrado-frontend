import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAlquilerById, updateAlquiler, deleteAlquiler, updateContrato, existsContrato } from "../../../services/alquileresService";
import EntityForm from "../../../components/template/EntityForm";
import { alquileresFields } from "../../../schemas/alquileresSchema";

export default function AlquileresEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);
  const [existsContract, setExistsContract] = useState(false);

  useEffect(() => {
    setIsNotFound(false);
    getAlquilerById(id)
      .then(async (data) => {
        setInitialValues({
          ...data,
          clienteId: "0",
          inmuebleId: "0",
        });
        const exists = await existsContrato(id);
        setExistsContract(exists);
      })
      .catch(() => {
        setIsNotFound(true);
      });
  }, [id]);

  const fields = alquileresFields.map(field => {
    if (field.name === "clienteId" && initialValues?.cliente?.codigo) {
      return {
        ...field,
        options: [{ value: "0", label: initialValues.cliente.codigo }],
        disabled: true,
      };
    }
    if (field.name === "inmuebleId" && initialValues?.inmueble?.codigo) {
      return {
        ...field,
        options: [{ value: "0", label: initialValues.inmueble.codigo }],
        disabled: true,
      };
    }
    return field;
  });

  const handleSubmit = async (data) => {
    if (data && data._noChanges_) {
      navigate("/alquileres", {
        state: { success: "Alquiler actualizado con éxito" },
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await updateAlquiler(id, data);
      navigate("/alquileres", {
        state: { success: "Alquiler actualizado con éxito" },
      });
    } catch (error) {
      const backendError = error?.response?.data;
      if (backendError) {
        setError(backendError);
      } else {
        setError({ message: error.message || "Hubo un error al actualizar el alquiler." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitDoc = async (file) => {
    if (!file) return;
    setIsSubmittingDoc(true);
    try {
      await updateContrato(id, file);
      navigate("/alquileres", {
        state: { success: "Contrato actualizado con éxito" },
      });
    } catch (error) {
      setError({ message: error?.response?.data?.message || "Hubo un error al subir el contrato." });
    } finally {
      setIsSubmittingDoc(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAlquiler(id);
      navigate("/alquileres", {
        state: { success: "Alquiler eliminado con éxito" },
      });
    } catch {
      setError({ message: "Hubo un error al eliminar el alquiler" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <EntityForm
      entityName="alquiler"
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/alquileres")}
      error={error}
      onErrorClose={() => setError(null)}
      isSubmitting={isSubmitting}
      isSubmittingDoc={isSubmittingDoc}
      isNotFound={isNotFound}
      onDelete={handleDelete}
      isDeleting={isDeleting}
      docName="contrato"
      onSubmitDoc={handleSubmitDoc}
      existsDoc={existsContract}
    />
  );
}
