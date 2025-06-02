import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProveedorById, updateProveedor, deleteProveedor } from "../../../services/proveedoresService";
import EntityForm from "../../../components/template/EntityForm";
import { proveedoresFields } from "../../../schemas/proveedoresSchema";

export default function ProveedoresEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsNotFound(false);
      try {
        const data = await getProveedorById(id);
        setInitialValues(data);
      } catch {
        setIsNotFound(true);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (data) => {
    if (data && data._noChanges_) {
      navigate("/proveedores", {
        state: { success: "Proveedor actualizado con éxito" },
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await updateProveedor(id, data);
      navigate("/proveedores", {
        state: { success: "Proveedor actualizado con éxito" },
      });
    } catch (error) {
      const backendError = error?.response?.data;
      if (backendError) {
        setError(backendError);
      } else {
        setError({ message: error.message || "Hubo un error al actualizar el proveedor." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProveedor(id);
      navigate("/proveedores", {
        state: { success: "Proveedor eliminado con éxito" },
      });
    } catch (error) {
      if (error?.response?.status === 409) {
        setError({ message: "No se puede eliminar el proveedor porque hay registros relacionados", statusCode: 400 });
      } else {
        setError({ message: "Hubo un error al eliminar el proveedor" });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <EntityForm
      entityName="proveedor"
      fields={proveedoresFields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/proveedores")}
      error={error}
      onErrorClose={() => setError(null)}
      isSubmitting={isSubmitting}
      isNotFound={isNotFound}
      onDelete={handleDelete}
      isDeleting={isDeleting}
    />
  );
}
