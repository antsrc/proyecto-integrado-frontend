import React, { useEffect, useState } from "react";
import { getUsuarios, updatePassword, deleteUsuario, createUsuario } from "../../services/usuariosService";
import Loading from "../../components/utils/Loading";
import { AlertTriangle, Inbox, ShieldUser, User as UserIcon, Plus, Lock, Trash2 } from "lucide-react";
import Toast from "../../components/utils/Toast";
import ReactDOM from "react-dom";

const adminColumns = [
  { id: "icon", label: "", render: () => <ShieldUser className="w-5 h-5 text-gray-400" /> },
  { id: "nombre", label: "Nombre" },
  { id: "fechaCreacion", label: "Fecha Creación" },
  { id: "usuarioCreacion", label: "Usuario Creación" },
  { id: "ultimoInicio", label: "Último Inicio" },
  { id: "phantom", label: "", render: () => (
    <div className="flex gap-2 justify-end min-w-[64px]">
      {/* Columna fantasma para igualar el ancho de los botones */}
      <span className="invisible">-</span>
    </div>
  ) },
];
const userColumns = [
  { id: "icon", label: "", render: () => <UserIcon className="w-5 h-5 text-gray-400" /> },
  { id: "nombre", label: "Nombre" },
  { id: "fechaCreacion", label: "Fecha Creación" },
  { id: "usuarioCreacion", label: "Usuario Creación" },
  { id: "ultimoInicio", label: "Último Inicio" },
  { id: "acciones", label: "", render: (row, onEdit, onDelete) => (
    <div className="flex gap-2 justify-end">
      <button
        className="text-gray-500 hover:text-purple-600 p-1 transition-colors cursor-pointer"
        title="Editar contraseña"
        onClick={() => onEdit(row)}
      >
        <Lock className="w-5 h-5" />
      </button>
      <button
        className="text-gray-500 hover:text-red-600 p-1 transition-colors cursor-pointer"
        title="Eliminar"
        onClick={() => onDelete(row)}
      >
        <Trash2 className="w-5 h-5" />
      </button>
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
      setToast({ type: "success", message: "Contraseña modificada con éxito" });
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
      setToast({ type: "success", message: "Usuario eliminado con éxito" });
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
      setToast({ type: "success", message: "Usuario creado con éxito" });
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
    <>
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
        <div className="bg-white px-4 pt-6 pb-4 rounded-lg overflow-x-auto mb-10 shadow-sm">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200">
                {adminColumns.map((col) => (
                  <th
                    key={col.id}
                    className="py-4 px-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider select-none cursor-default"
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
                      <span>No se encontraron usuarios</span>
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
                          className="py-4 px-2 whitespace-nowrap text-sm text-gray-500"
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
        <div className="bg-white px-4 pt-6 pb-4 rounded-lg overflow-x-auto shadow-sm">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200">
                {userColumns.map((col) => (
                  <th
                    key={col.id}
                    className="py-4 px-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider select-none cursor-default"
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
                      <span>No se encontraron usuarios</span>
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
                          className="py-4 px-2 whitespace-nowrap text-sm text-gray-500"
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
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-7 border border-gray-100 animate-fade-in relative">
              <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" onClick={() => setModalEditOpen(false)}>
                <span className="sr-only">Cerrar</span>✕
              </button>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Editar contraseña de {selectedUsuario?.nombre}</h3>
              <label className="block mb-4 text-base font-medium text-gray-700">
                Nueva contraseña
                <input type="password" value={formPassword} onChange={e => setFormPassword(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-gray-800 focus:border-purple-500 focus:ring-0" autoFocus disabled={processing} />
              </label>
              <div className="flex justify-end gap-4 pt-2">
                <button onClick={() => setModalEditOpen(false)} className="px-5 py-2 text-base text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors cursor-pointer font-medium" disabled={processing}>Cancelar</button>
                <button onClick={handleEditSubmit} className="px-5 py-2 text-base text-white rounded-lg transition-colors cursor-pointer font-medium shadow-sm bg-purple-600 hover:bg-purple-700 disabled:opacity-50" disabled={processing || formPassword === undefined || formPassword === null}>Guardar</button>
              </div>
            </div>
          </div>
        )}
        {modalDeleteOpen && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-7 border border-gray-100 animate-fade-in relative">
              <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" onClick={() => setModalDeleteOpen(false)}>
                <span className="sr-only">Cerrar</span>✕
              </button>
              <h3 className="text-xl font-bold text-red-600 mb-4">¿Eliminar usuario {selectedUsuario?.nombre}?</h3>
              <div className="flex justify-end gap-4 pt-2">
                <button onClick={() => setModalDeleteOpen(false)} className="px-5 py-2 text-base text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors cursor-pointer font-medium" disabled={processing}>Cancelar</button>
                <button onClick={handleDeleteConfirm} className="px-5 py-2 text-base text-white rounded-lg transition-colors cursor-pointer font-medium shadow-sm bg-red-600 hover:bg-red-700 disabled:opacity-50" disabled={processing}>Eliminar</button>
              </div>
            </div>
          </div>
        )}
        {modalCreateOpen && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-7 border border-gray-100 animate-fade-in relative">
              <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" onClick={() => setModalCreateOpen(false)}>
                <span className="sr-only">Cerrar</span>✕
              </button>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Crear nuevo usuario</h3>
              <label className="block mb-2 text-base font-medium text-gray-700">
                Nombre
                <input type="text" value={formNombre} onChange={e => setFormNombre(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-gray-800 focus:border-purple-500 focus:ring-0" autoFocus disabled={processing} />
              </label>
              <label className="block mb-4 text-base font-medium text-gray-700">
                Contraseña
                <input type="password" value={formPassword} onChange={e => setFormPassword(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-gray-800 focus:border-purple-500 focus:ring-0" disabled={processing} />
              </label>
              <div className="flex justify-end gap-4 pt-2">
                <button onClick={() => setModalCreateOpen(false)} className="px-5 py-2 text-base text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors cursor-pointer font-medium" disabled={processing}>Cancelar</button>
                <button onClick={handleCreateSubmit} className="px-5 py-2 text-base text-white rounded-lg transition-colors cursor-pointer font-medium shadow-sm bg-purple-600 hover:bg-purple-700 disabled:opacity-50" disabled={processing}>Crear</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {toast && ReactDOM.createPortal(
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />, document.body
      )}
    </>
  );
}
