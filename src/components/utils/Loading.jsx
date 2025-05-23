import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500">
      <Loader2 className="w-8 h-8 animate-spin mb-2" />
      <span className="text-sm">Cargando...</span>
    </div>
  );
}
