import { Loader2 } from "lucide-react";

export default function SessionLoading() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100 text-gray-600">
      <Loader2 className="w-12 h-12 animate-spin" />
    </div>
  );
}
