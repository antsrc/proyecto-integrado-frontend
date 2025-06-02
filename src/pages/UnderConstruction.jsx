import { Construction } from "lucide-react";

export default function UnderConstruction() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-center py-24 text-gray-500">
      <Construction className="w-14 h-14 text-yellow-500" />
      <h2 className="text-xl font-semibold">Página en construcción</h2>
      <p className="text-sm text-gray-400 max-w-xs">
        Estamos trabajando para tenerla lista, inténtalo más tarde.
      </p>
    </div>
  );
}
