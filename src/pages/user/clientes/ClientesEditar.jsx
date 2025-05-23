import EntityForm from "../../../components/template/EntityForm";
import { clientesFields } from "../../../schemas/clientesSchema";
import { getClienteById, updateCliente, deleteCliente } from "../../../services/clientesService";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ClientesEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    setIsNotFound(false);
    getClienteById(id)
      .then((data) => {
        setInitialValues(data);
      })
      .catch(() => {
        setIsNotFound(true);
      });
  }, [id]);

  const handleSubmit = async (data) => {
    if (data && data._noChanges_) {
      navigate("/clientes", {
        state: { success: "Cliente actualizado con éxito" },
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await updateCliente(id, data);
      navigate("/clientes", {
        state: { success: "Cliente actualizado con éxito" },
      });
    } catch (error) {
      const backendError = error?.response?.data;
      if (backendError) {
        setError(backendError);
      } else {
        setError({ message: error.message || "Hubo un error al actualizar el cliente." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCliente(id);
      navigate("/clientes", {
        state: { success: "Cliente eliminado con éxito" },
      });
    } catch {
      setError({ message: "Hubo un error al eliminar el cliente" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <EntityForm
      fields={clientesFields}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/clientes")}
      isSubmitting={isSubmitting}
      initialValues={initialValues}
      error={error}
      onErrorClose={() => setError(null)}
      isNotFound={isNotFound}
      onDelete={handleDelete}
      isDeleting={isDeleting}
      entityName="cliente"
    />
  );
}
