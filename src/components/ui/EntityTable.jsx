import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table'
import { useState } from 'react'
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Download,
  Pencil,
  Plus,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import React from 'react'

export default function EntityTable({ title, columns, data }) {
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const navigate = useNavigate()

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    maxSorting: 1,
  })

  const handleExport = () => {
    const rows = table.getFilteredRowModel().rows
    if (!rows.length) return

    const headers = table.getAllLeafColumns().map((col) => col.id)
    const csvRows = [
      headers.join(','),
      ...rows.map((row) =>
        headers.map((key) => JSON.stringify(row.original[key] ?? '')).join(',')
      ),
    ]
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'export.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const renderSortIcon = (column) => {
    const isSorted = column.getIsSorted()
    if (isSorted === 'asc') return <ChevronUp className="w-3 h-3 ml-1 text-gray-500" />
    if (isSorted === 'desc') return <ChevronDown className="w-3 h-3 ml-1 text-gray-500" />
    return <ChevronsUpDown className="w-3 h-3 ml-1 text-gray-300" />
  }

  return (
    <div>
      {/* Header externo */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-medium text-gray-800">
            {`Listado de ${title.toLowerCase()}`}
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">
            {data.length} registro{data.length !== 1 && 's'} en total
          </p>
        </div>
        <button
          onClick={() => navigate('nuevo')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition"
        >
          <Plus className="w-4 h-4" />
          Añadir
        </button>
      </div>

      <div className="bg-white px-4 py-4 rounded-lg overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Buscar..."
            className="px-3 py-2 border border-gray-300 rounded-md text-sm w-64"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <button
            onClick={handleExport}
            className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </button>
        </div>

        <table className="w-full table-auto">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-200">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={() => header.column.getCanSort() && header.column.toggleSorting()}
                    className="py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                  >
                    <div className="flex items-center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {renderSortIcon(header.column)}
                    </div>
                  </th>
                ))}
                <th className="py-4 w-10"></th>
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <React.Fragment key={row.id}>
                <tr className="bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  <td className="py-4 whitespace-nowrap text-sm">
                    <button
                      className="text-gray-500 hover:text-purple-600"
                      onClick={() => navigate(`editar/${row.original.id}`)}
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                  </td>
                </tr>

                {index !== table.getRowModel().rows.length - 1 && (
                  <tr>
                    <td colSpan={row.getVisibleCells().length + 1}>
                      <div className="border-t border-gray-200 transition-colors duration-200" />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
