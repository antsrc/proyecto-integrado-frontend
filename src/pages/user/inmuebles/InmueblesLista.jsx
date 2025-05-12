import { useEffect, useState } from "react"
import EntityTable from "../../../components/ui/EntityTable"
import { getInmuebles } from "../../../services/inmueblesService"

const columns = [
  { id: "codigo", accessorKey: "codigo", header: "Código" },
  { id: "direccion", accessorKey: "direccion", header: "Dirección" },
  { id: "cod_postal", accessorKey: "cod_postal", header: "C.P." },
  { id: "municipio", accessorKey: "municipio", header: "Municipio" },
  { id: "provincia", accessorKey: "provincia", header: "Provincia" },
  { id: "tipo", accessorKey: "tipo", header: "Tipo" },
  { id: "metros_cuadrados", accessorKey: "metros_cuadrados", header: "M²" },
  { id: "ref_catastral", accessorKey: "ref_catastral", header: "Ref. Catastral" },
]

export default function InmueblesLista() {
  const [inmuebles, setInmuebles] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInmuebles()
        setInmuebles(data)
      } catch (error) {
        console.error("Error al cargar inmuebles:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <EntityTable
      title="Inmuebles"
      columns={columns}
      data={inmuebles}
    />
  )
}
