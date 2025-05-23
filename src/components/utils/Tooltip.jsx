import { Eye } from "lucide-react";
import { useState } from "react";

const Tooltip = ({ text }) => {
  const [visible, setVisible] = useState(false);
  if (!text) return null;

  return (
    <span className="relative inline-flex items-center justify-center">
      <button
        type="button"
        aria-label="Ver descripción completa"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <Eye className="w-5 h-5" />
      </button>

      {visible && (
        <div
          role="tooltip"
          className="absolute z-10 bottom-full mb-2 left-1/2 -translate-x-1/2
                     bg-white border border-gray-300 text-gray-700 text-sm rounded-md
                     py-1 px-3 max-w-xs shadow-sm whitespace-normal"
        >
          {text}
        </div>
      )}
    </span>
  );
};

export default Tooltip;
