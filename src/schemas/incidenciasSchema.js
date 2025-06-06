export const incidenciasColumns = [
  { id: "codigo", accessorKey: "codigo", header: "Código", type: "text" },
  { id: "alquiler", accessorKey: "alquiler", header: "Alquiler", type: "text" },
  { id: "inmueble", accessorKey: "inmueble", header: "Inmueble", type: "text" },
  { id: "cliente", accessorKey: "cliente", header: "Cliente", type: "text" },
  { id: "tipo", accessorKey: "tipo", header: "Tipo", type: "text" },
  { id: "fechaRegistro", accessorKey: "fechaRegistro", header: "Registro", type: "date" },
  { id: "descripcion", accessorKey: "descripcion", header: "Descripción", type: "tooltip" },
  { id: "reparada", accessorKey: "reparada", header: "Reparada", type: "boolean" }
];

export const incidenciasFields = [
  { name: "codigo", label: "Código", type: "text", maxLength: 30, required: true },
  { name: "alquilerId", label: "Alquiler", type: "select", required: true },
  { name: "tipo", label: "Tipo", type: "text", maxLength: 30, required: true },
  { name: "descripcion", label: "Descripción", type: "textarea", maxLength: 500, required: true },
];