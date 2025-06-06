import { Eye } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Tooltip = ({ text }) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (open && buttonRef.current && tooltipRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const tooltipHeight = tooltipRef.current.offsetHeight;
      setCoords({
        top: rect.top + window.scrollY - tooltipHeight - 8, // 8px margen arriba
        left: rect.left + window.scrollX + rect.width / 2,
      });
    }
  }, [open]);

  if (!text) return null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Mostrar contenido"
        className="text-gray-500 hover:text-gray-700 focus:outline-none p-0"
      >
        <Eye className="w-5 h-5" />
      </button>

      {open &&
        createPortal(
          <div
            ref={tooltipRef}
            className="absolute z-50 max-w-xs bg-white border border-gray-200 shadow-lg rounded-md p-3 text-sm text-gray-800 whitespace-pre-wrap overflow-auto max-h-36 inline-block"
            style={{
              top: coords.top,
              left: coords.left,
              transform: "translateX(-50%)",
              position: "absolute",
              boxSizing: "border-box",
            }}
          >
            {text}
          </div>,
          document.body
        )}
    </>
  );
};

export default Tooltip;
