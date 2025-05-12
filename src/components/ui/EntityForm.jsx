import { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import { X } from "lucide-react";

const EntityForm = forwardRef(function EntityForm(
  {
    title = "",
    fields = [],
    onSubmit,
    onCancel,
    isSubmitting = false,
    initialValues = {},
  },
  ref
) {
  const [formValues, setFormValues] = useState(() => {
    return buildInitialState(fields, initialValues);
  });

  useEffect(() => {
    setFormValues(buildInitialState(fields, initialValues));
  }, [initialValues, fields]);

  const handleChange = (e, name) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formValues);
  };

  useImperativeHandle(ref, () => ({
    resetForm: () => {
      setFormValues(buildInitialState(fields));
    },
  }));

  function buildInitialState(fields, values = {}) {
    return fields.reduce((acc, field) => {
      const raw = values?.[field.name] ?? "";
      acc[field.name] = raw === null || raw === undefined ? "" : String(raw);
      return acc;
    }, {});
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-medium text-gray-800">{title}</h3>
          <p className="text-sm text-gray-400 mt-0.5">Introduzca los datos</p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            type="button"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md transition"
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg px-4 py-4 space-y-4">
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
                disabled={field.editable === false}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
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
                readOnly={field.editable === false}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
              />
            )}
          </div>
        ))}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md disabled:opacity-50"
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </form>
  );
});

export default EntityForm;
