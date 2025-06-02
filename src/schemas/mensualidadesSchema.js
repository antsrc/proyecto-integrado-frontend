export const mensualidadesColumns = [
  { id: "alquiler", accessorKey: "alquiler", header: "Alquiler", type: "text" },
  { id: "fechaInicio", accessorKey: "fechaInicio", header: "Inicio", type: "date" },
  { id: "fechaFin", accessorKey: "fechaFin", header: "Fin", type: "date" },
  { id: "importe", accessorKey: "importe", header: "Importe (€)", type: "number" },
  { id: "fechaEmision", accessorKey: "fechaEmision", header: "Emisión", type: "date" },
  { id: "fechaPago", accessorKey: "fechaPago", header: "Fecha Pago", type: "date" },
  { id: "formaPago", accessorKey: "formaPago", header: "Forma pago", type: "text" },
  { id: "factura", accessorKey: "factura", header: "Factura", type: "doc" },
  { id: "pagada", accessorKey: "pagada", header: "Pagada", type: "boolean" }
];

export const mensualidadesFields = [
  { name: "alquilerId", label: "Alquiler", type: "select", required: true },
  { name: "fechaInicio", label: "Fecha de inicio", type: "date", required: true, disabled: true },
  { name: "fechaFin", label: "Fecha de fin", type: "date", required: true, disabled: true },
  { name: "importe", label: "Importe (€)", type: "number", required: true, disabled: true },
  { name: "fechaEmision", label: "Fecha de emisión", type: "date", required: true, disabled: true },
  { name: "fechaPago", label: "Fecha de pago", type: "date", required: false },
  { name: "formaPago", label: "Forma de pago", type: "text", maxLength: 30, required: false },
];
