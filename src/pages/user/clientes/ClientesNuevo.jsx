import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCliente } from "../../../services/clientesService";
import EntityForm from "../../../components/template/EntityForm";
import { clientesFields } from "../../../schemas/clientesSchema";

export default function ClientesNuevo() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await createCliente(data);
      navigate("/clientes", {
        state: { success: "Cliente creado con éxito" },
      });
    } catch (error) {
      const backendError = error?.response?.data;
      if (backendError) {
        setError(backendError);
      } else {
        setError({ message: error.message || "Hubo un error al guardar el cliente" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EntityForm
      entityName="cliente"
      fields={clientesFields}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/clientes")}
      error={error}
      onErrorClose={() => setError(null)}
      isSubmitting={isSubmitting}
    />
  );
}
