import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAlquiler } from "../../../services/alquileresService";
import { getClientesIdCodigo } from "../../../services/clientesService";
import { getInmueblesIdCodigo } from "../../../services/inmueblesService";
import EntityForm from "../../../components/template/EntityForm";
import { alquileresFields } from "../../../schemas/alquileresSchema";

export default function AlquileresNuevo() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fields, setFields] = useState(alquileresFields);

  useEffect(() => {
  async function fetchOptions() {
    try {
      const [clientes, inmuebles] = await Promise.all([
        getClientesIdCodigo(),
        getInmueblesIdCodigo(),
      ]);
      setFields((prev) =>
        prev.map((field) => {
          if (field.name === "clienteId") {
            return {
              ...field,
              options: clientes.map((c) => ({ value: c.id, label: c.codigo })),
            };
          }
          if (field.name === "inmuebleId") {
            return {
              ...field,
              options: inmuebles.map((i) => ({ value: i.id, label: i.codigo })),
            };
          }
          return field;
        })
      );
    } catch {
      // Opcional: mostrar error de carga de opciones
    }
  }
  fetchOptions();
}, []);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await createAlquiler(data);
      navigate("/alquileres", {
        state: { success: "Alquiler creado con éxito" },
      });
    } catch (error) {
      const backendError = error?.response?.data;
      if (backendError) {
        setError(backendError);
      } else {
        setError({ message: error.message || "Hubo un error al guardar el alquiler" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EntityForm
      entityName="alquiler"
      fields={fields}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/alquileres")}
      error={error}
      onErrorClose={() => setError(null)}
      isSubmitting={isSubmitting}
    />
  );
}
