import { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { X, FolderUp, FileX, Trash2, AlertTriangle } from "lucide-react";
import Toast from "../utils/Toast";
import Loading from "../utils/Loading";

const EntityForm = forwardRef(function EntityForm(
  {
    fields = [],
    onSubmit,
    onCancel,
    isSubmitting = false,
    initialValues = {},
    error,
    onErrorClose,
    isNotFound,
    onDelete,
    isDeleting,
    entityName = "registro",
    onSubmitDoc,
    docName,
    isSubmittingDoc,
    existsDoc,
  },
  ref
) {
  const [formValues, setFormValues] = useState(() =>
    buildInitialState(fields, initialValues)
  );
  const [showConfirmUpload, setShowConfirmUpload] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);

  useEffect(() => {
    // Solo actualizar formValues si initialValues cambia realmente (edición)
    if (initialValues && Object.keys(initialValues).length > 0) {
      const newState = buildInitialState(fields, initialValues);
      if (JSON.stringify(formValues) !== JSON.stringify(newState)) {
        setFormValues(newState);
      }
    }
    // eslint-disable-next-line
  }, [initialValues, fields]);

  const handleChange = (e, name) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      if (initialValues && Object.keys(initialValues).length > 0) {
        const dirtyFields = {};
        for (const key in formValues) {
          if (formValues[key] !== (initialValues?.[key] ?? "")) {
            dirtyFields[key] = formValues[key];
          }
        }
        if (Object.keys(dirtyFields).length === 0) {
          onSubmit({ _noChanges_: true });
          return;
        }
        onSubmit(dirtyFields);
      } else {
        onSubmit(formValues);
      }
    }
  };

  useImperativeHandle(ref, () => ({
    resetForm: () => {
      setFormValues(buildInitialState(fields));
    },
  }));

  function buildInitialState(fields, values = {}) {
    return fields.reduce((acc, field) => {
      const raw = values?.[field.name];
      acc[field.name] = raw === undefined || raw === null ? "" : String(raw);
      return acc;
    }, {});
  }

  const DeleteEntity = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          setDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <>
        <div ref={containerRef} className="relative mt-6 flex justify-start pl-2">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md shadow-sm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          {dropdownOpen && (
            <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-[160px] animate-fade-in">
              <button
                onClick={() => {
                  setShowConfirm(true);
                  setDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 text-left rounded-md transition whitespace-nowrap cursor-pointer"
              >
                Eliminar {entityName}
              </button>
            </div>
          )}
        </div>

        {showConfirm && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-7 border border-gray-100 animate-fade-in">
              <div className="flex justify-center mb-3">
                <Trash2 className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                ¿Eliminar {entityName}
                {initialValues?.codigo ? ` ${initialValues.codigo}` : ""}?
              </h2>

              <div className="space-y-2 text-base text-gray-600 text-left">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <p>Esta acción no se puede deshacer</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <p>Los registros derivados también serán eliminados</p>
                </div>
              </div>

              <p className="text-base text-gray-700 font-medium">
                Por favor, confirma que estás seguro.
              </p>

              <div className="flex justify-end gap-4 pt-5">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-5 py-2 text-base text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors cursor-pointer font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="px-5 py-2 text-base text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 transition-colors cursor-pointer font-medium shadow-sm"
                >
                  {isDeleting ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const handleDocFormSubmit = async (e) => {
    e.preventDefault();
    const file = e.target.elements["doc-file"].files[0];
    if (!file) return;
    if (existsDoc) {
      setPendingFile(file);
      setShowConfirmUpload(true);
    } else {
      onSubmitDoc(file);
    }
  };

  const handleConfirmUpload = () => {
    setShowConfirmUpload(false);
    if (pendingFile) {
      onSubmitDoc(pendingFile);
      setPendingFile(null);
    }
  };

  const handleCancelUpload = () => {
    setShowConfirmUpload(false);
    setPendingFile(null);
  };

  const isEdit = initialValues && Object.keys(initialValues).length > 0;

  if (isNotFound) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-400 py-20">
        <FileX className="w-12 h-12" />
        <span>Recurso no encontrado</span>
      </div>
    );
  }

  if (!initialValues) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-400 py-20">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error &&
          (Array.isArray(error?.message) ? (
            error.message.map((msg, idx) => (
              <Toast
                key={idx}
                type={error.statusCode === 400 ? "warning" : "error"}
                message={msg}
                onClose={onErrorClose}
              />
            ))
          ) : (
            <Toast
              type={error?.statusCode === 400 ? "warning" : "error"}
              message={error?.message || error}
              onClose={onErrorClose}
            />
          ))}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-medium text-gray-800">
              {isEdit ? `Editar ${entityName}` : `Crear ${entityName}`}
            </h3>
            <p className="text-sm text-gray-400 mt-0.5">Introduzca los datos</p>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md transition cursor-pointer"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg px-6 py-6 space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  value={formValues[field.name]}
                  onChange={(e) => handleChange(e, field.name)}
                  required={field.required}
                  readOnly={field.readOnly && isEdit}
                  disabled={field.disabled && isEdit}
                  className={`block w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 ${field.disabled && isEdit ? 'bg-gray-100' : 'bg-white'}`}
                >
                  <option value="">Seleccione una opción</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={formValues[field.name]}
                  onChange={(e) => handleChange(e, field.name)}
                  required={field.required}
                  readOnly={field.readOnly && isEdit}
                  minLength={field.minLength}
                  maxLength={field.maxLength}
                  min={field.min}
                  max={field.max}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 bg-white"
                />
              )}
            </div>
          ))}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md disabled:opacity-50 cursor-pointer"
            >
              <FolderUp className="w-5 h-5" />
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </form>

      {onSubmitDoc && docName && (
        <form
          className="bg-white rounded-lg px-6 py-6 mt-6 flex flex-col gap-4 border border-gray-100"
          onSubmit={handleDocFormSubmit}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subir nuevo {docName} (PDF)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              name="doc-file"
              accept="application/pdf"
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              required
            />
            <button
              type="submit"
              disabled={isSubmittingDoc}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md disabled:opacity-50 cursor-pointer"
            >
              <FolderUp className="w-5 h-5" />
              {isSubmittingDoc ? "Subiendo..." : "Subir PDF"}
            </button>
          </div>
        </form>
      )}

      {/* Modal de confirmación para sobreescribir contrato */}
      {showConfirmUpload && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-7 border border-gray-100 animate-fade-in">
            <div className="flex justify-center mb-3">
              <FolderUp className="w-12 h-12 text-yellow-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Ya existe un contrato PDF
            </h2>
            <p className="text-base text-gray-700 font-medium">
              ¿Desea sobrescribir el contrato actual?
            </p>
            <div className="flex justify-end gap-4 pt-5">
              <button
                onClick={handleCancelUpload}
                className="px-5 py-2 text-base text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors cursor-pointer font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmUpload}
                className="px-5 py-2 text-base text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors cursor-pointer font-medium shadow-sm"
              >
                Sobrescribir
              </button>
            </div>
          </div>
        </div>
      )}

      {onDelete && !isNotFound && isEdit && <DeleteEntity />}
    </>
  );
});

export default EntityForm;
