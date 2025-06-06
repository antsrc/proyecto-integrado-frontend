import { useState } from "react";
import Loading from "../utils/Loading";

export default function LogDisplay({ title, fetchLog }) {
  const [n, setN] = useState(100);
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showJson, setShowJson] = useState(false);
  const [jsonError, setJsonError] = useState(null);

  const handleFetch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLines([]);
    setError(null);
    setShowJson(false);
    setJsonError(null);
    try {
      const data = await fetchLog(n);
      setLines(Array.isArray(data) ? data : String(data).split("\n"));
    } catch (err) {
      setError(err?.response?.data?.message || "Error al obtener el log");
    } finally {
      setLoading(false);
    }
  };

  // Intenta formatear cada línea como JSON si showJson está activo
  let formattedJsonLines = null;
  let localJsonError = null;
  if (showJson && !loading && !error && lines.length > 0) {
    let anyError = false;
    formattedJsonLines = lines.map((line, i) => {
      if (!line.trim()) return null;
      try {
        const obj = JSON.parse(line);
        return <pre key={i} className="whitespace-pre-wrap">{JSON.stringify(obj, null, 2)}</pre>;
      } catch {
        anyError = true;
        return <div key={i} className="text-red-500">{line}</div>;
      }
    });
    localJsonError = anyError ? "Algunas líneas no son JSON válido" : null;
  }

  // Función para descargar el log mostrado
  const handleDownload = () => {
    let content = "";
    let filename = title.toLowerCase().replace(/ /g, "-") + "-log.txt";
    if (showJson && formattedJsonLines) {
      // Si está en modo JSON, descarga todos los JSON formateados juntos
      content = formattedJsonLines
        .map((el) => {
          if (el && el.type === "pre") return el.props.children;
          if (el && el.type === "div") return el.props.children;
          return "";
        })
        .join("\n\n");
      filename = title.toLowerCase().replace(/ /g, "-") + "-log.json";
    } else {
      content = lines.join("\n");
    }
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
      <form onSubmit={handleFetch} className="flex gap-3 items-end bg-white p-4 rounded-lg shadow mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nº líneas</label>
          <input
            type="number"
            min={1}
            max={1000}
            className="border border-gray-300 rounded px-3 py-2 w-24 text-base"
            value={n}
            onChange={e => setN(Number(e.target.value))}
          />
        </div>
        <button
          type="submit"
          className="ml-auto px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium shadow disabled:opacity-50"
          disabled={loading}
        >
          Ver log
        </button>
      </form>
      <div className="flex justify-end mb-2 gap-2">
        {lines.length > 0 && !loading && !error && (
          <>
            <button
              type="button"
              className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${showJson ? "bg-purple-600 text-white border-purple-600" : "bg-white text-purple-700 border-purple-300 hover:bg-purple-50"}`}
              onClick={() => { setShowJson((v) => !v); setJsonError(null); }}
            >
              {showJson ? "Ver texto plano" : "Formatear JSON"}
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded text-xs font-medium border bg-gray-100 text-gray-700 hover:bg-gray-200"
              onClick={handleDownload}
            >
              Descargar
            </button>
          </>
        )}
      </div>
      <div className="bg-white rounded-lg shadow p-4 min-h-[200px] max-h-[500px] overflow-auto font-mono text-xs text-gray-800 whitespace-pre-wrap border border-gray-100">
        {loading ? (
          <div className="flex justify-center py-10"><Loading /></div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">{error}</div>
        ) : showJson && formattedJsonLines ? (
          <>
            {localJsonError && <div className="text-red-500 text-center pb-2">{localJsonError}</div>}
            {formattedJsonLines}
          </>
        ) : showJson && jsonError ? (
          <div className="text-red-500 text-center py-10">{jsonError}</div>
        ) : lines.length > 0 ? (
          lines.map((line, i) => <div key={i}>{line}</div>)
        ) : (
          <div className="text-gray-400 text-center py-10">No hay datos</div>
        )}
      </div>
    </div>
  );
}
