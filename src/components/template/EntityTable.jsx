import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Download,
  SquarePen,
  Plus,
  Inbox,
  SearchX,
  AlertTriangle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import React from "react";
import Loading from "../utils/Loading";
import Toast from "../utils/Toast";
import BooleanIcon from "../utils/BooleanIcon";
import Tooltip from "../utils/Tooltip";
import DocumentButton from "../utils/DocumentButton";

export default function EntityTable({ title, columns, data, status }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [sorting, setSorting] = useState(() => {
    const firstSortable = columns.find(
      (col) => col.id && col.id !== "select" && col.id !== "actions"
    );
    return firstSortable ? [{ id: firstSortable.id, desc: false }] : [];
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [navigationToast, setNavigationToast] = useState(null);

  // Detecta la primera columna booleana (si existe)
  const booleanCol = columns.find((col) => col.type === "boolean");
  const [booleanFilter, setBooleanFilter] = useState("all"); // all | true | false

  // Filtra los datos según el filtro booleano
  const filteredData = React.useMemo(() => {
    if (!booleanCol || booleanFilter === "all") return data;
    return data.filter((row) => {
      const value = row[booleanCol.id];
      return booleanFilter === "true" ? value === true : value === false;
    });
  }, [data, booleanCol, booleanFilter]);

  useEffect(() => {
    if (location.state?.success) {
      setNavigationToast({
        type: "success",
        message: location.state.success,
      });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const smartSort = (a, b, columnId) => {
    const colType = columns.find((col) => col.id === columnId)?.type;
    const valA = a.getValue(columnId);
    const valB = b.getValue(columnId);

    if (colType === "number") {
      const numA = parseFloat(valA);
      const numB = parseFloat(valB);
      return numA - numB;
    }

    return String(valA || "")
      .toLowerCase()
      .localeCompare(String(valB || "").toLowerCase());
  };

  const formatNumberES = (value) => {
    if (value == null || value === "") return "";
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    return number.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Utilidad para formatear fecha a dd-mm-yyyy SOLO para mostrar y buscar
  const formatDateES = (value) => {
    if (!value) return "";
    if (/^\d{2}-\d{2}-\d{4}$/.test(value)) return value;
    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) return `${match[3]}-${match[2]}-${match[1]}`;
    return value;
  };

  // Filtrado global personalizado: busca en campos string y en fechas como las ve el usuario (dd-mm-yyyy)
  const customFilteredData = React.useMemo(() => {
    if (!globalFilter) return filteredData;
    const filter = globalFilter.toLowerCase();
    return filteredData.filter((row) => {
      return columns.some((col) => {
        const value = row[col.id];
        if (col.type === "date") {
          return formatDateES(value).toLowerCase().includes(filter);
        }
        return String(value ?? "").toLowerCase().includes(filter);
      });
    });
  }, [filteredData, columns, globalFilter]);

  const columnsWithSort = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center pl-4 pr-2 h-full">
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center pl-4 pr-2 h-full">
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        </div>
      ),
      size: 48,
      enableSorting: false,
    },
    ...columns.map((col) => ({
      ...col,
      enableSorting: (col.type === "tooltip" || col.type === "doc" || col.type === "boolean") ? false : (col.enableSorting ?? true),
      sortingFn: col.sortingFn || smartSort,
      cell: ({ getValue }) => {
        const value = getValue();
        if (col.type === "number") return formatNumberES(value);
        if (col.type === "date") {
          return formatDateES(value);
        }
        if (col.type === "boolean") {
          return <BooleanIcon value={value} />;
        }
        if (col.type === "tooltip") {
          return <Tooltip text={value} />;
        }
        if (col.type === "doc") {
          if (value && typeof value === "object" && value.id && value.type) {
            return <DocumentButton id={value.id} type={value.type} />;
          }
          return null;
        }
        return value;
      },
    })),
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <button
          className="text-gray-500 hover:text-purple-600 cursor-pointer"
          onClick={() => navigate(`editar/${row.original.id}`)}
        >
          <SquarePen className="w-5 h-5" />
        </button>
      ),
      size: 48,
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data: customFilteredData,
    columns: columnsWithSort,
    state: { sorting, globalFilter, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    getRowId: (row) => row.id,
    maxSorting: 1,
  });

  const handleSort = (columnId) => {
    setSorting((prev) => {
      const existing = prev.find((s) => s.id === columnId);
      if (!existing) return [{ id: columnId, desc: false }];
      return [{ id: columnId, desc: !existing.desc }];
    });
  };

  const handleExport = () => {
    const rows = table.getSelectedRowModel().rows;
    if (!rows.length) {
      setShowToast(true);
      return;
    }

    const headers = columns
      .filter((col) => col.id !== "select" && col.id !== "actions" && col.type !== "doc" && col.type !== "boolean")
      .map((col) => col.label || col.header || col.id);

    const escapeAndFormat = (value, key) => {
      if (value == null) return "";
      let str = String(value).trim();
      const column = columns.find((col) => col.id === key);
      if (column?.type === "tooltip") {
        if (typeof value === "object" && value && value.props && value.props.text) {
          str = String(value.props.text);
        }
      }
      const columnType = column?.type;
      if (columnType === "number") {
        const number = parseFloat(str);
        if (!isNaN(number)) {
          str = number.toLocaleString("es-ES", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        }
      }
      const needsQuotes = str.includes(";") || str.includes('"');
      if (str.includes('"')) str = str.replace(/"/g, '""');
      return needsQuotes ? `"${str}"` : str;
    };

    const csvRows = [
      headers.map((header) => escapeAndFormat(header)).join(";"),
      ...rows.map((row) =>
        columns
          .filter((col) => col.id !== "select" && col.id !== "actions" && col.type !== "doc" && col.type !== "boolean")
          .map((col) => escapeAndFormat(row.original[col.id], col.id)).join(";")
      ),
    ];

    const blob = new Blob(["\uFEFF" + csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "export.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderSortIcon = (column) => {
    const isSorted = column.getIsSorted();
    if (isSorted === "asc")
      return <ChevronUp className="w-3 h-3 ml-1 text-gray-500" />;
    if (isSorted === "desc")
      return <ChevronDown className="w-3 h-3 ml-1 text-gray-500" />;
    return <ChevronsUpDown className="w-3 h-3 ml-1 text-gray-300" />;
  };

  const getSummaryText = () => {
    const total = data.length;
    const mostrado = table.getFilteredRowModel().rows.length;
    const selected = Object.keys(rowSelection).length;

    const totalText = `${total} registro${total === 1 ? "" : "s"} total${
      total === 1 ? "" : "es"
    }`;
    const visibleText = `${mostrado} mostrado${
      mostrado === 1 ? "" : "s"
    }`;
    const selectedText = `${selected} seleccionado${
      selected === 1 ? "" : "s"
    }`;

    return `${totalText}, ${visibleText}, ${selectedText}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-medium text-gray-800">
            {`Listado de ${title.toLowerCase()}`}
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">{getSummaryText()}</p>
        </div>
        <button
          onClick={() => navigate("nuevo")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Añadir
        </button>
      </div>

      <div className="bg-white px-4 pt-6 pb-4 rounded-lg overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Buscar..."
              className="px-3 py-2 border border-gray-300 rounded-md text-sm w-64 text-gray-800"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            {booleanCol && (
              <select
                className="px-2 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white focus:outline-none focus:ring-0 focus:border-gray-400 focus:bg-white transition-colors"
                value={booleanFilter}
                onChange={(e) => setBooleanFilter(e.target.value)}
                style={{ minWidth: 120 }}
              >
                <option value="all">Todo</option>
                <option value="true">{(booleanCol.header || booleanCol.label || booleanCol.id)}s</option>
                <option value="false">No {(booleanCol.header || booleanCol.label || booleanCol.id).charAt(0).toLowerCase() + (booleanCol.header || booleanCol.label || booleanCol.id).slice(1)}s</option>
              </select>
            )}
          </div>
          <button
            onClick={handleExport}
            className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md cursor-pointer"
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
                    onClick={
                      header.column.getCanSort() && !["tooltip", "doc", "boolean"].includes(columns.find((col) => col.id === header.column.id)?.type)
                        ? () => handleSort(header.column.id)
                        : undefined
                    }
                    className={`py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider select-none ${
                      header.column.getCanSort() && !["tooltip", "doc", "boolean"].includes(columns.find((col) => col.id === header.column.id)?.type)
                        ? 'cursor-pointer'
                        : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && !["tooltip", "doc", "boolean"].includes(columns.find((col) => col.id === header.column.id)?.type)
                        ? renderSortIcon(header.column)
                        : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {status === "loading" ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="text-center py-6"
                >
                  <Loading />
                </td>
              </tr>
            ) : status === "error" ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="text-center py-6 text-sm text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                    <AlertTriangle className="w-8 h-8" />
                    <span>No fue posible obtener los datos</span>
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="text-center py-6 text-sm text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                    {data.length === 0 ? (
                      <>
                        <Inbox className="w-8 h-8" />
                        <span>No se encontraron registros</span>
                      </>
                    ) : (
                      <>
                        <SearchX className="w-8 h-8" />
                        <span>No hay coincidencias para tu búsqueda</span>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, index) => (
                <React.Fragment key={row.id}>
                  <tr className="bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                  {index !== table.getRowModel().rows.length - 1 && (
                    <tr>
                      <td colSpan={row.getVisibleCells().length}>
                        <div className="border-t border-gray-200 transition-colors duration-200" />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showToast && (
        <Toast
          type="warning"
          message="Selecciona al menos una fila"
          onClose={() => setShowToast(false)}
        />
      )}

      {navigationToast && (
        <Toast
          type={navigationToast.type}
          message={navigationToast.message}
          onClose={() => setNavigationToast(null)}
        />
      )}
    </div>
  );
}
