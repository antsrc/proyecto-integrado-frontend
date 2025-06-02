export const reparacionesColumns = [
  { id: "incidencia", accessorKey: "incidencia", header: "Incidencia", type: "text" },
  { id: "proveedor", accessorKey: "proveedor", header: "Proveedor", type: "text" },
  { id: "fechaFin", accessorKey: "fechaFin", header: "Fecha fin", type: "date" },
  { id: "importe", accessorKey: "importe", header: "Importe (€)", type: "number" },
  { id: "descripcion", accessorKey: "descripcion", header: "Descripción", type: "tooltip" },
  { id: "factura", accessorKey: "factura", header: "Factura", type: "doc" },
];

export const reparacionesFields = [
  { name: "incidenciaId", label: "Incidencia", type: "select", required: true, disabled: true },
  { name: "proveedorId", label: "Proveedor", type: "select", required: true, disabled: true },
  { name: "fechaFin", label: "Fecha de fin", type: "date", required: true, disabled: true },
  { name: "importe", label: "Importe (en euros)", type: "number", required: true, disabled: true },
  { name: "descripcion", label: "Descripción", type: "textarea", required: true },
];
