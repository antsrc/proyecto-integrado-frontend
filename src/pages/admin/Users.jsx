import React, { useEffect, useState } from "react";
import { getUsuarios, updatePassword, deleteUsuario, createUsuario } from "../../services/usuariosService";
import Loading from "../../components/utils/Loading";
import { AlertTriangle, Inbox, ShieldUser, User as UserIcon, Plus, KeyRound, Trash2 } from "lucide-react";
import Toast from "../../components/utils/Toast";

const adminColumns = [
  { id: "icon", label: "", render: () => <ShieldUser className="w-5 h-5 text-gray-400" /> },
  { id: "nombre", label: "Nombre" },
  { id: "fechaCreacion", label: "Fecha Creación" },
  { id: "usuarioCreacion", label: "Usuario Creación" },
  { id: "ultimoInicio", label: "Último Inicio" },
];
const userColumns = [
  { id: "icon", label: "", render: () => <UserIcon className="w-5 h-5 text-gray-400" /> },
  { id: "nombre", label: "Nombre" },
  { id: "fechaCreacion", label: "Fecha Creación" },
  { id: "usuarioCreacion", label: "Usuario Creación" },
  { id: "ultimoInicio", label: "Último Inicio" },
  { id: "acciones", label: "", render: (row, onEdit, onDelete) => (
    <div className="flex gap-2 justify-end">
      <button className="text-purple-600 hover:text-purple-800 p-1" title="Editar contraseña" onClick={() => onEdit(row)}><KeyRound className="w-5 h-5" /></button>
      <button className="text-red-600 hover:text-red-800 p-1" title="Eliminar" onClick={() => onDelete(row)}><Trash2 className="w-5 h-5" /></button>
    </div>
  ) },
];

function formatDateES(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date)) return "-";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export default function Users() {
  const [usuarios, setUsuarios] = useState([]);
  const [status, setStatus] = useState("loading");
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [formNombre, setFormNombre] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getUsuarios()
      .then((data) => {
        setUsuarios(data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  const admins = usuarios.filter((u) => u.rol === "admin");
  const users = usuarios.filter((u) => u.rol !== "admin");

  // Handlers para acciones
  const handleEdit = (usuario) => {
    setSelectedUsuario(usuario);
    setFormPassword("");
    setModalEditOpen(true);
  };
  const handleEditSubmit = async () => {
    if (!formPassword) return;
    setProcessing(true);
    try {
      await updatePassword(selectedUsuario.id, { contrasena: formPassword });
      setModalEditOpen(false);
      setSelectedUsuario(null);
      setFormPassword("");
      getUsuarios().then(setUsuarios);
    } catch (err) {
      let msg = "";
      if (err?.response?.status === 400 && err.response.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          msg = err.response.data.message[0];
        } else {
          msg = err.response.data.message;
        }
        setToast({ type: "warning", message: msg });
      } else {
        setToast({ type: "error", message: "Error al actualizar contraseña" });
      }
    } finally {
      setProcessing(false);
    }
  };
  const handleDelete = (usuario) => {
    setSelectedUsuario(usuario);
    setModalDeleteOpen(true);
  };
  const handleDeleteConfirm = async () => {
    setProcessing(true);
    try {
      await deleteUsuario(selectedUsuario.id);
      setModalDeleteOpen(false);
      setSelectedUsuario(null);
      getUsuarios().then(setUsuarios);
    } finally {
      setProcessing(false);
    }
  };
  // Handler para añadir usuario
  const handleCreate = () => {
    setFormNombre("");
    setFormPassword("");
    setModalCreateOpen(true);
  };
  const handleCreateSubmit = async () => {
    if (!formNombre || !formPassword) return;
    setProcessing(true);
    try {
      await createUsuario({ nombre: formNombre, contrasena: formPassword });
      setModalCreateOpen(false);
      setFormNombre("");
      setFormPassword("");
      getUsuarios().then(setUsuarios);
    } catch (err) {
      let msg = "";
      if (err?.response?.status === 400 && err.response.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          msg = err.response.data.message[0];
        } else {
          msg = err.response.data.message;
        }
        setToast({ type: "warning", message: msg });
      } else {
        setToast({ type: "error", message: "Error al crear usuario" });
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      {/* Tabla de administradores */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-medium text-gray-800">
            Administradores
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">
            {`${admins.length} usuario${
              admins.length === 1 ? "" : "s"
            } total${admins.length === 1 ? "" : "es"}`}
          </p>
        </div>
      </div>
      <div className="bg-white px-4 pt-6 pb-4 rounded-lg overflow-x-auto mb-10">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200">
              {adminColumns.map((col) => (
                <th
                  key={col.id}
                  className="py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider select-none cursor-default"
                >
                  <div className="flex items-center">{col.label}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {status === "loading" ? (
              <tr>
                <td colSpan={adminColumns.length} className="text-center py-6">
                  <Loading />
                </td>
              </tr>
            ) : status === "error" ? (
              <tr>
                <td
                  colSpan={adminColumns.length}
                  className="text-center py-6 text-sm text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                    <AlertTriangle className="w-8 h-8" />
                    <span>No fue posible obtener los datos</span>
                  </div>
                </td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td
                  colSpan={adminColumns.length}
                  className="text-center py-6 text-sm text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                    <Inbox className="w-8 h-8" />
                    <span>No se encontraron registros</span>
                  </div>
                </td>
              </tr>
            ) : (
              admins.map((row, idx) => (
                <React.Fragment key={row.id}>
                  <tr className="bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                    {adminColumns.map((col) => (
                      <td
                        key={col.id}
                        className="py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {col.render ? col.render(row) : col.id === "fechaCreacion" || col.id === "ultimoInicio"
                          ? formatDateES(row[col.id])
                          : row[col.id] ?? "-"}
                      </td>
                    ))}
                  </tr>
                  {idx !== admins.length - 1 && (
                    <tr>
                      <td colSpan={adminColumns.length}>
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
      {/* Tabla de usuarios normales */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-medium text-gray-800">
            Usuarios administrativos
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">
            {`${users.length} usuario${users.length === 1 ? "" : "s"} total${
              users.length === 1 ? "" : "es"
            }`}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition cursor-pointer" onClick={handleCreate}>
          <Plus className="w-4 h-4" /> Añadir
        </button>
      </div>
      <div className="bg-white px-4 pt-6 pb-4 rounded-lg overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200">
              {userColumns.map((col) => (
                <th
                  key={col.id}
                  className="py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider select-none cursor-default"
                >
                  <div className="flex items-center">{col.label}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {status === "loading" ? (
              <tr>
                <td colSpan={userColumns.length} className="text-center py-6">
                  <Loading />
                </td>
              </tr>
            ) : status === "error" ? (
              <tr>
                <td
                  colSpan={userColumns.length}
                  className="text-center py-6 text-sm text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                    <AlertTriangle className="w-8 h-8" />
                    <span>No fue posible obtener los datos</span>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={userColumns.length}
                  className="text-center py-6 text-sm text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                    <Inbox className="w-8 h-8" />
                    <span>No se encontraron registros</span>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((row, idx) => (
                <React.Fragment key={row.id}>
                  <tr className="bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                    {userColumns.map((col) => (
                      <td
                        key={col.id}
                        className="py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {col.render ? col.render(row, handleEdit, handleDelete) : col.id === "fechaCreacion" || col.id === "ultimoInicio"
                          ? formatDateES(row[col.id])
                          : row[col.id] ?? "-"}
                      </td>
                    ))}
                  </tr>
                  {idx !== users.length - 1 && (
                    <tr>
                      <td colSpan={userColumns.length}>
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
      {modalEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-md p-6 w-96 max-w-full relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setModalEditOpen(false)}>
              <span className="sr-only">Cerrar</span>✕
            </button>
            <h3 className="text-lg font-semibold mb-4">Editar contraseña: {selectedUsuario?.nombre}</h3>
            <label className="block mb-4 text-sm font-medium">
              Nueva contraseña
              <input type="password" value={formPassword} onChange={e => setFormPassword(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-purple-500" autoFocus disabled={processing} />
            </label>
            <div className="flex justify-end gap-3">
              <button onClick={() => setModalEditOpen(false)} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100" disabled={processing}>Cancelar</button>
              <button onClick={handleEditSubmit} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700" disabled={processing || !formPassword}>Guardar</button>
            </div>
          </div>
        </div>
      )}
      {modalDeleteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-md p-6 w-96 max-w-full relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setModalDeleteOpen(false)}>
              <span className="sr-only">Cerrar</span>✕
            </button>
            <h3 className="text-lg font-semibold mb-4 text-red-600">¿Eliminar usuario: {selectedUsuario?.nombre}?</h3>
            <div className="flex justify-end gap-3">
              <button onClick={() => setModalDeleteOpen(false)} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100" disabled={processing}>Cancelar</button>
              <button onClick={handleDeleteConfirm} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" disabled={processing}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
      {modalCreateOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-md p-6 w-96 max-w-full relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setModalCreateOpen(false)}>
              <span className="sr-only">Cerrar</span>✕
            </button>
            <h3 className="text-lg font-semibold mb-4">Crear nuevo usuario</h3>
            <label className="block mb-2 text-sm font-medium">
              Nombre
              <input type="text" value={formNombre} onChange={e => setFormNombre(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-purple-500" autoFocus disabled={processing} />
            </label>
            <label className="block mb-4 text-sm font-medium">
              Contraseña
              <input type="password" value={formPassword} onChange={e => setFormPassword(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-purple-500" disabled={processing} />
            </label>
            <div className="flex justify-end gap-3">
              <button onClick={() => setModalCreateOpen(false)} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100" disabled={processing}>Cancelar</button>
              <button onClick={handleCreateSubmit} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700" disabled={processing || !formNombre || !formPassword}>Crear</button>
            </div>
          </div>
        </div>
      )}
      {/* Toast siempre por encima de los modales */}
      {toast && (
        <div style={{ zIndex: 100 }} className="fixed inset-0 pointer-events-none flex items-end justify-center px-4 py-8">
          <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
}
