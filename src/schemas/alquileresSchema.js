export const alquileresColumns = [
  { id: "codigo", accessorKey: "codigo", header: "Código", type: "text" },
  { id: "cliente", accessorKey: "cliente", header: "Cliente", type: "text" },
  { id: "inmueble", accessorKey: "inmueble", header: "Inmueble", type: "text" },
  { id: "fechaAlta", accessorKey: "fechaAlta", header: "Alta", type: "date" },
  { id: "fechaBaja", accessorKey: "fechaBaja", header: "Baja", type: "date" },
  { id: "fianza", accessorKey: "fianza", header: "Fianza (€)", type: "number" },
  { id: "contrato", accessorKey: "contrato", header: "Contrato", type: "doc" },
  { id: "activo", accessorKey: "activo", header: "Activo", type: "boolean" },
];

export const alquileresFields = [
  { name: "codigo", label: "Código", type: "text", maxLength: 30, required: true },
  { name: "clienteId", label: "Cliente", type: "select", required: true, disabled: true },
  { name: "inmuebleId", label: "Inmueble", type: "select", required: true, disabled: true },
  { name: "fechaAlta", label: "Fecha de alta", type: "date", required: true },
  { name: "fechaBaja", label: "Fecha de baja", type: "date", required: false },
  { name: "fianza", label: "Fianza (en euros)", type: "number", step: 0.01 },
];
