import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInmuebleById, updateInmueble } from "../../../services/inmueblesService";
import InmueblesForm from "./InmueblesForm";

export default function InmueblesEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInmuebleById(id);
        setInitialValues(data);
      } catch (error) {
        console.error("Error al cargar inmueble:", error);
        alert("No se pudo cargar el inmueble");
        navigate("/inmuebles");
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    try {
      await updateInmueble(id, data);
      alert("Inmueble actualizado con éxito");
      navigate("/inmuebles");
    } catch (error) {
      console.error("Error al actualizar inmueble:", error.message);
      alert("Hubo un error al actualizar el inmueble");
    }
  };

  if (!initialValues) return <p>Cargando...</p>;

  return (
    <InmueblesForm
      title="Editar inmueble"
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  );
}
