import { FileQuestion } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-500 px-4">
      <FileQuestion className="w-12 h-12 mb-4" />
      <h1 className="text-xl font-semibold mb-2">Página no encontrada</h1>
      <button
        onClick={() => navigate("/")}
        className="mt-2 text-sm text-purple-600 hover:text-purple-700 hover:font-medium cursor-pointer"
      >
        Ir al inicio
      </button>
    </div>
  );
}
