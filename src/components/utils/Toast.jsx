import { useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  X,
  Info,
} from "lucide-react";

export default function Toast({ type, message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-[17px] h-[17px]" />,
    warning: <Info className="w-[17px] h-[17px]" />,
    error: <XCircle className="w-[17px] h-[17px]" />,
  };

  const bgColors = {
    success: "bg-green-500",
    warning: "bg-yellow-400",
    error: "bg-red-500",
  };

  const hoverColors = {
    success: "hover:bg-green-400",
    warning: "hover:bg-yellow-200",
    error: "hover:bg-red-300",
  };

  if (!["success", "warning", "error"].includes(type)) {
    console.warn(`Toast: tipo no válido "${type}"`);
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 rounded-md px-3.5 py-2.5 text-white flex items-center justify-between gap-3 min-w-[260px] shadow-sm ${bgColors[type]}`}
    >
      <div className="flex items-center gap-2">
        {icons[type]}
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={onClose}
        className={`rounded-md p-1.25 transition-colors cursor-pointer ${hoverColors[type]}`}
      >
        <X className="w-[17px] h-[17px]" />
      </button>
    </div>
  );
}
