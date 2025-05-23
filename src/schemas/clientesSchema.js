export const clientesColumns = [
  { id: "codigo", accessorKey: "codigo", header: "Código", type: "text" },
  { id: "dni", accessorKey: "dni", header: "DNI", type: "text" },
  { id: "nombreCompleto", accessorKey: "nombreCompleto", header: "Nombre completo", type: "text" },
  { id: "telefono", accessorKey: "telefono", header: "Teléfono", type: "text" },
  { id: "email", accessorKey: "email", header: "Email", type: "text" },
  { id: "numCuenta", accessorKey: "numCuenta", header: "Nº Cuenta", type: "text" },
  { id: "referidoPor", accessorKey: "referidoPor", header: "Referido por", type: "text" },
  { id: "deuda", accessorKey: "deuda", header: "Deuda (€)", type: "number" },
];

export const clientesFields = [
  { name: "codigo", label: "Código", type: "text", maxLength: 30, required: true },
  { name: "dni", label: "DNI", type: "text", minLength: 9, maxLength: 9, required: true },
  { name: "nombreCompleto", label: "Nombre completo", type: "text", maxLength: 100, required: true },
  { name: "telefono", label: "Teléfono", type: "text", maxLength: 30, required: true },
  { name: "email", label: "Email", type: "email", maxLength: 100, required: true },
  { name: "numCuenta", label: "Número de cuenta", type: "text", maxLength: 30, required: true },
  { name: "referidoPor", label: "Referido por", type: "text", maxLength: 100, required: false },
];
