import { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { X, FolderUp, FileX, FileUp, Trash2, AlertTriangle, FilePenLine } from "lucide-react";
import Toast from "../utils/Toast";
import Loading from "../utils/Loading";
import Select from "react-select";

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
  const [activeFields, setActiveFields] = useState(() => {
    // Por defecto, los campos required están activos.
    // Si es edición, los no required activos solo si el valor inicial no es null/undefined/"".
    // Si es nuevo, los no required salen desactivados ("Sin datos" marcado).
    return fields.reduce((acc, field) => {
      if (field.required) {
        acc[field.name] = true;
      } else {
        const val = initialValues?.[field.name];
        acc[field.name] = val !== null && val !== undefined && val !== "";
      }
      return acc;
    }, {});
  });
  const [showConfirmUpload, setShowConfirmUpload] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);

  const prevInitialValuesRef = useRef(initialValues);

  useEffect(() => {
    // Solo actualizar formValues si initialValues realmente cambian respecto a los previos
    const prevInitialValues = prevInitialValuesRef.current;
    const prevString = JSON.stringify(buildInitialState(fields, prevInitialValues));
    const nextString = JSON.stringify(buildInitialState(fields, initialValues));
    if (prevString !== nextString) {
      setFormValues(buildInitialState(fields, initialValues));
      prevInitialValuesRef.current = initialValues;
    }
  }, [initialValues, fields]);

  useEffect(() => {
    // Actualizar activeFields si initialValues cambia (edición)
    if (initialValues && Object.keys(initialValues).length > 0) {
      setActiveFields(
        fields.reduce((acc, field) => {
          if (field.required) {
            acc[field.name] = true;
          } else {
            const val = initialValues?.[field.name];
            acc[field.name] = val !== null && val !== undefined && val !== "";
          }
          return acc;
        }, {})
      );
    }
    // eslint-disable-next-line
  }, [initialValues, fields]);

  const handleChange = (e, name) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };

  const handleToggleField = (name) => {
    setActiveFields((prev) => {
      const next = { ...prev, [name]: !prev[name] };
      // Si se activa "Sin datos" (es decir, el campo se desactiva), poner valor a null
      if (!next[name]) {
        setFormValues((fv) => ({ ...fv, [name]: "" }));
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      // Filtrar campos no activos: enviar null si el campo está desactivado
      const filteredValues = { ...formValues };
      Object.keys(activeFields).forEach((key) => {
        if (!activeFields[key]) filteredValues[key] = null;
      });
      if (initialValues && Object.keys(initialValues).length > 0) {
        const dirtyFields = {};
        for (const key in filteredValues) {
          // Comprobar nulls correctamente
          const initial = initialValues?.[key];
          const current = filteredValues[key];
          // Considerar null, undefined y "" como equivalentes para null
          const isInitialNull = initial === null || initial === undefined || initial === "";
          const isCurrentNull = current === null || current === undefined || current === "";
          if (isInitialNull !== isCurrentNull || (!isCurrentNull && current !== initial)) {
            dirtyFields[key] = current;
          }
        }
        if (Object.keys(dirtyFields).length === 0) {
          onSubmit({ _noChanges_: true });
          return;
        }
        onSubmit(dirtyFields);
      } else {
        onSubmit(filteredValues);
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

  // ModalConfirm reutilizable dentro de EntityForm
  function ModalConfirm({ open, icon, title, description, children, onCancel, onConfirm, confirmText = "Confirmar", cancelText = "Cancelar", confirmColor = "bg-red-600 hover:bg-red-700", loading = false, disabled = false }) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-7 border border-gray-100 animate-fade-in">
          {icon && <div className="flex justify-center mb-3">{icon}</div>}
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          {description && <p className="text-base text-gray-700 font-medium">{description}</p>}
          {children}
          <div className="flex justify-end gap-4 pt-5">
            <button
              onClick={onCancel}
              className="px-5 py-2 text-base text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors cursor-pointer font-medium"
              disabled={disabled}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading || disabled}
              className={`px-5 py-2 text-base text-white rounded-lg disabled:opacity-50 transition-colors cursor-pointer font-medium shadow-sm ${confirmColor}`}
            >
              {loading ? "..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    );
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
                className="w-full px-6 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition whitespace-nowrap cursor-pointer text-center"
              >
                Eliminar {entityName}
              </button>
            </div>
          )}
        </div>

        <ModalConfirm
          open={showConfirm}
          icon={<Trash2 className="w-12 h-12 text-red-600" />}
          title={`Eliminar ${entityName}${initialValues?.codigo ? ` ${initialValues.codigo}` : ""}`}
          description={
            <span className="text-base text-gray-700 font-medium">¿Estás seguro? Esta acción no puede deshacerse.</span>
          }
          onCancel={() => setShowConfirm(false)}
          onConfirm={onDelete}
          confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
          cancelText="Cancelar"
          confirmColor="bg-red-600 hover:bg-red-700"
          loading={isDeleting}
        />
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
            <Toast
              type={String(error.statusCode).startsWith("4") ? "warning" : "error"}
              message={error.message[0]}
              onClose={onErrorClose}
            />
          ) : (
            <Toast
              type={String(error?.statusCode).startsWith("4") ? "warning" : "error"}
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

        <div className="bg-white rounded-lg px-6 py-6 space-y-4 shadow-sm">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              {/* Checkbox para campos no required */}
              {!field.required && (
                <label className="flex items-center gap-2 mb-1 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    checked={!activeFields[field.name]}
                    onChange={() => handleToggleField(field.name)}
                    disabled={field.disabled && isEdit}
                  />
                  Sin datos
                </label>
              )}
              {field.type === "select" ? (
                <Select
                  value={field.options?.find(opt => opt.value === formValues[field.name]) || null}
                  onChange={opt => setFormValues(prev => ({ ...prev, [field.name]: opt ? opt.value : "" }))}
                  options={field.options}
                  isDisabled={field.disabled && isEdit || !activeFields[field.name] || !field.options || field.options.length === 0}
                  isSearchable
                  placeholder={!field.options || field.options.length === 0 ? 'No se encontraron registros' : 'Seleccione una opción'}
                  classNamePrefix="entity-select"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      minHeight: '38px',
                      borderColor: state.isFocused ? '#000' : '#d1d5db',
                      borderWidth: 1, // Siempre 1px, incluso en focus
                      boxShadow: 'none',
                      outline: 'none',
                      backgroundColor: (field.disabled && isEdit) || !activeFields[field.name] ? '#f3f4f6' : '#fff',
                      color: '#374151',
                      fontSize: '0.875rem',
                      transition: 'border-color 0.2s',
                      '&:hover': {
                        borderColor: state.isFocused ? '#000' : '#d1d5db',
                        borderWidth: 1,
                        boxShadow: 'none',
                      },
                    }),
                    option: (base, state) => ({
                      ...base,
                      fontSize: '0.875rem',
                      backgroundColor: (state.isSelected || state.isFocused) ? '#f3f4f6' : '#fff',
                      color: '#374151',
                    }),
                    singleValue: base => ({ ...base, color: '#374151' }),
                    menu: base => ({ ...base, zIndex: 20 }),
                  }}
                  theme={theme => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: '#f3f4f6', // fondo opción seleccionada y hover
                      primary25: '#f3f4f6', // hover/focus fondo opción
                      primary50: '#f3f4f6',
                      neutral10: '#f3f4f6', // fondo de la opción seleccionada
                      neutral20: '#d1d5db', // borde normal
                      neutral30: '#000', // borde focus
                    },
                  })}
                  isClearable={!field.required}
                  noOptionsMessage={() => 'No se encontraron registros'}
                />
              ) : field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formValues[field.name]}
                  onChange={(e) => handleChange(e, field.name)}
                  required={!field.required && activeFields[field.name] ? true : field.required}
                  readOnly={field.readOnly && isEdit}
                  minLength={field.minLength}
                  maxLength={field.maxLength}
                  disabled={!activeFields[field.name] || (field.disabled && isEdit)}
                  className={`block w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 resize-y ${!activeFields[field.name] || (field.disabled && isEdit) ? 'bg-gray-100' : 'bg-white'}`}
                  rows={2}
                />
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={formValues[field.name]}
                  onChange={(e) => handleChange(e, field.name)}
                  required={!field.required && activeFields[field.name] ? true : field.required}
                  readOnly={field.readOnly && isEdit}
                  minLength={field.minLength}
                  maxLength={field.maxLength}
                  min={field.min}
                  max={field.max}
                  step={field.type === "number" && field.step ? field.step : undefined}
                  disabled={!activeFields[field.name] || (field.disabled && isEdit)}
                  className={`block w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 ${!activeFields[field.name] || (field.disabled && isEdit) ? 'bg-gray-100' : 'bg-white'}`}
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
          className="bg-white rounded-lg px-6 py-6 mt-6 flex flex-col gap-4 border border-gray-100 shadow-sm"
          onSubmit={handleDocFormSubmit}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subir {docName} (PDF)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              name="doc-file"
              accept="application/pdf"
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 file:cursor-pointer"
              required
            />
            <button
              type="submit"
              disabled={isSubmittingDoc}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              <FileUp className="w-5 h-5" />
              {isSubmittingDoc ? "Subiendo..." : "Subir PDF"}
            </button>
          </div>
        </form>
      )}

      {showConfirmUpload && (
        <ModalConfirm
          open={showConfirmUpload}
          icon={<FilePenLine className="w-12 h-12 text-purple-600" />}
          title="Ya existe un contrato PDF"
          description="¿Desea sobrescribir el contrato actual?"
          onCancel={handleCancelUpload}
          onConfirm={handleConfirmUpload}
          confirmText="Sobrescribir"
          cancelText="Cancelar"
          confirmColor="bg-purple-600 hover:bg-purple-700"
          loading={isSubmittingDoc}
        />
      )}

      {onDelete && !isNotFound && isEdit && <DeleteEntity />}
    </>
  );
});

export default EntityForm;