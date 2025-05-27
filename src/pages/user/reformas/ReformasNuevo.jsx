import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReforma } from "../../../services/reformasService";
import { getInmueblesIdCodigo } from "../../../services/inmueblesService";
import { getProveedoresIdCodigo } from "../../../services/proveedoresService";
import EntityForm from "../../../components/template/EntityForm";
import { reformasFields } from "../../../schemas/reformasSchema";

export default function ReformasNuevo() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fields, setFields] = useState(reformasFields);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [inmuebles, proveedores] = await Promise.all([
          getInmueblesIdCodigo(),
          getProveedoresIdCodigo(),
        ]);
        setFields((prev) =>
          prev.map((field) => {
            if (field.name === "inmuebleId") {
              return {
                ...field,
                options: inmuebles.map((i) => ({ value: i.id, label: i.codigo })),
              };
            }
            if (field.name === "proveedorId") {
              return {
                ...field,
                options: proveedores.map((p) => ({ value: p.id, label: p.codigo })),
              };
            }
            return field;
          })
        );
      } catch {
        throw new Error("No pudieron obtenerse las opciones para los campos");
      }
    }
    fetchOptions();
  }, []);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await createReforma(data);
      navigate("/reformas", {
        state: { success: "Reforma creada con éxito" },
      });
    } catch (error) {
      const backendError = error?.response?.data;
      if (backendError) {
        setError(backendError);
      } else {
        setError({ message: error.message || "Hubo un error al guardar la reforma" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EntityForm
      entityName="reforma"
      fields={fields}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/reformas")}
      error={error}
      onErrorClose={() => setError(null)}
      isSubmitting={isSubmitting}
    />
  );
}
