export const inmueblesColumns = [
  { id: "codigo", accessorKey: "codigo", header: "Código", type: "text" },
  { id: "direccion", accessorKey: "direccion", header: "Dirección", type: "text" },
  { id: "codPostal", accessorKey: "codPostal", header: "C.P.", type: "text" },
  { id: "municipio", accessorKey: "municipio", header: "Municipio", type: "text" },
  { id: "provincia", accessorKey: "provincia", header: "Provincia", type: "text" },
  { id: "tipo", accessorKey: "tipo", header: "Tipo", type: "text" },
  { id: "metrosCuadrados", accessorKey: "metrosCuadrados", header: "M²", type: "number" },
  { id: "refCatastral", accessorKey: "refCatastral", header: "Ref. Catastral", type: "text" },
];

export const inmueblesFields = [
  { name: "codigo", label: "Código", type: "text", maxLength: 30, required: true },
  { name: "direccion", label: "Dirección", type: "text", maxLength: 100, required: true },
  { name: "codPostal", label: "Código Postal", type: "text", minLength: 5, maxLength: 5, required: true },
  { name: "municipio", label: "Municipio", type: "text", maxLength: 30, required: true },
  { name: "provincia", label: "Provincia", type: "text", maxLength: 30, required: true },
  { name: "tipo", label: "Tipo", type: "text", maxLength: 30, required: true },
  { name: "metrosCuadrados", label: "Metros cuadrados", type: "number", required: true },
  { name: "refCatastral", label: "Referencia Catastral", type: "text", maxLength: 30, required: true },
];