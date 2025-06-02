export const reformasColumns = [
  { id: "codigo", accessorKey: "codigo", header: "Código", type: "text" },
  { id: "inmueble", accessorKey: "inmueble", header: "Inmueble", type: "text" },
  { id: "proveedor", accessorKey: "proveedor", header: "Proveedor", type: "text" },
  { id: "tipo", accessorKey: "tipo", header: "Tipo", type: "text" },
  { id: "fechaInicio", accessorKey: "fechaInicio", header: "Inicio", type: "date" },
  { id: "fechaFin", accessorKey: "fechaFin", header: "Fin", type: "date" },
  { id: "importe", accessorKey: "importe", header: "Importe (€)", type: "number" },
  { id: "descripcion", accessorKey: "descripcion", header: "Descripción", type: "tooltip" },
  { id: "factura", accessorKey: "factura", header: "Factura", type: "doc" }
];

export const reformasFields = [
  { name: "codigo", label: "Código", type: "text", maxLength: 30, required: true },
  { name: "inmuebleId", label: "Inmueble", type: "select", required: true, disabled: true },
  { name: "proveedorId", label: "Proveedor", type: "select", required: true, disabled: true },
  { name: "tipo", label: "Tipo", type: "text", maxLength: 30, required: true },
  { name: "fechaInicio", label: "Fecha de inicio", type: "date", required: true },
  { name: "fechaFin", label: "Fecha de fin", type: "date", required: false },
  { name: "importe", label: "Importe (€)", type: "number", required: false },
  { name: "descripcion", label: "Descripción", type: "textarea", required: false },
];
