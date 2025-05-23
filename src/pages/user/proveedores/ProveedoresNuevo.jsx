import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProveedor } from "../../../services/proveedoresService";
import EntityForm from "../../../components/template/EntityForm";
import { proveedoresFields } from "../../../schemas/proveedoresSchema";

export default function ProveedoresNuevo() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await createProveedor(data);
      navigate("/proveedores", {
        state: { success: "Proveedor creado con éxito" },
      });
    } catch (error) {
      const backendError = error?.response?.data;
      if (backendError) {
        setError(backendError);
      } else {
        setError({ message: error.message || "Hubo un error al guardar el proveedor" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EntityForm
      entityName="proveedor"
      fields={proveedoresFields}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/proveedores")}
      error={error}
      onErrorClose={() => setError(null)}
      isSubmitting={isSubmitting}
    />
  );
}
