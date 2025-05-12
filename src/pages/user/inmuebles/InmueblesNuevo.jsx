import { useNavigate } from "react-router-dom";
import { createInmueble } from "../../../services/inmueblesService";
import InmueblesForm from "./InmueblesForm";

export default function InmueblesNuevo() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      await createInmueble(data);
      alert("Inmueble creado con éxito");
      navigate("/inmuebles");
    } catch (error) {
      console.error("Error al crear el inmueble:", error.message);
      alert("Hubo un error al guardar el inmueble");
    }
  };

  return (
    <InmueblesForm
      title="Nuevo inmueble"
      onSubmit={handleSubmit}
    />
  );
}
