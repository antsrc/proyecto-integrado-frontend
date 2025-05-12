import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import EntityForm from "../../../components/ui/EntityForm";

export default function InmueblesForm({ initialValues = {}, onSubmit, title }) {
  const formRef = useRef();
  const navigate = useNavigate();

const fields = [
  { name: "codigo", label: "Código", type: "text", maxLength: 30, required: true },
  { name: "direccion", label: "Dirección", type: "text", maxLength: 100, required: true },
  { name: "cod_postal", label: "C.P.", type: "text", maxLength: 5, required: true },
  { name: "municipio", label: "Municipio", type: "text", maxLength: 30, required: true },
  { name: "provincia", label: "Provincia", type: "text", maxLength: 30, required: true },
  { name: "tipo", label: "Tipo", type: "text", maxLength: 30, required: true },
  { name: "metros_cuadrados", label: "Metros cuadrados", type: "number", required: true },
  { name: "ref_catastral", label: "Ref. Catastral", type: "text", maxLength: 30, required: true },
];

  return (
    <EntityForm
      ref={formRef}
      title={title}
      fields={fields}
      initialValues={initialValues}
      onSubmit={onSubmit}
      onCancel={() => navigate("/inmuebles")}
    />
  );
}
