import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getInmuebleById,
  updateInmueble,
  deleteInmueble,
} from "../../../services/inmueblesService";
import EntityForm from "../../../components/template/EntityForm";
import { inmueblesFields } from "../../../schemas/inmueblesSchema";

export default function InmueblesEditar() {
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
        const data = await getInmuebleById(id);
        setInitialValues(data);
      } catch {
        setIsNotFound(true);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (data) => {
    if (data && data._noChanges_) {
      navigate("/inmuebles", {
        state: { success: "Inmueble actualizado con éxito" },
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await updateInmueble(id, data);
      navigate("/inmuebles", {
        state: { success: "Inmueble actualizado con éxito" },
      });
    } catch (error) {
      console.error("Error al actualizar inmueble:", error);
      const backendError = error?.response?.data;
      if (backendError) {
        setError(backendError);
      } else {
        setError({ message: error.message || "Hubo un error al actualizar el inmueble." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteInmueble(id);
      navigate("/inmuebles", {
        state: { success: "Inmueble eliminado con éxito" },
      });
    } catch (error) {
      if (error?.response?.status === 409) {
        setError({ message: "No se puede eliminar el inmueble porque hay registros relacionados", statusCode: 400 });
      } else {
        setError({ message: "Hubo un error al eliminar el inmueble" });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <EntityForm
      entityName="inmueble"
      fields={inmueblesFields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/inmuebles")}
      error={error}
      onErrorClose={() => setError(null)}
      isSubmitting={isSubmitting}
      isNotFound={isNotFound}
      onDelete={handleDelete}
      isDeleting={isDeleting}
    />
  );
}