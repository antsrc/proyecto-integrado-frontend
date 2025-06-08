export const proveedoresColumns = [
  { id: "codigo", accessorKey: "codigo", header: "Código", type: "text" },
  { id: "cif", accessorKey: "cif", header: "CIF", type: "text" },
  { id: "nombre", accessorKey: "nombre", header: "Nombre", type: "text" },
  { id: "tipo", accessorKey: "tipo", header: "Tipo", type: "text" },
  { id: "direccion", accessorKey: "direccion", header: "Dirección", type: "text" },
  { id: "telefono", accessorKey: "telefono", header: "Teléfono", type: "text" },
  { id: "descripcion", accessorKey: "descripcion", header: "Descripción", type: "tooltip" },
];

export const proveedoresFields = [
  { name: "codigo", label: "Código", type: "text", maxLength: 30, required: true },
  { name: "cif", label: "CIF", type: "text", minLength: 9, maxLength: 9, required: true, disabled: true },
  { name: "nombre", label: "Nombre", type: "text", maxLength: 50, required: true },
  { name: "tipo", label: "Tipo", type: "text", maxLength: 30, required: true },
  { name: "direccion", label: "Dirección", type: "text", maxLength: 75, required: true },
  { name: "telefono", label: "Teléfono", type: "text", maxLength: 30, required: true },
  { name: "descripcion", label: "Descripción", type: "text", maxLength: 200, required: true },
];