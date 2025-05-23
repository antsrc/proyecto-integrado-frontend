import { FileText } from "lucide-react";

const DocumentButton = ({ id, type = "contrato" }) => {
  const handleOpen = () => {
    if (!id) return;
    window.open(`${window.location.origin}/documentos/${type}s/${id}.pdf`, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      aria-label={`Ver ${type}`}
      onClick={handleOpen}
      className={`transition-colors ${id ? "text-gray-500 hover:text-purple-600 cursor-pointer" : "text-gray-300 cursor-not-allowed"}`}
      disabled={!id}
    >
      <FileText className="w-5 h-5" />
    </button>
  );
};

export default DocumentButton;
