import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createInmueble } from "../../../services/inmueblesService";
import EntityForm from "../../../components/template/EntityForm";
import { inmueblesFields } from "../../../schemas/inmueblesSchema";

export default function InmueblesNuevo() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await createInmueble(data);
      navigate("/inmuebles", {
        state: { success: "Inmueble creado con éxito" },
      });
    } catch (error) {
      const backendError = error?.response?.data;
      if (backendError) {
        setError(backendError);
      } else {
        setError({ message: error.message || "Hubo un error al guardar el inmueble" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EntityForm
      entityName="inmueble"
      fields={inmueblesFields}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/inmuebles")}
      error={error}
      onErrorClose={() => setError(null)}
      isSubmitting={isSubmitting}
    />
  );
}
