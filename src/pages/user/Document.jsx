import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFound from "../NotFound";
import { API_URL } from "../../config/env";

export default function Document() {
  const { id, type } = useParams();
  const baseUrl = API_URL.replace(/\/api$/, "");
  const url =
    type === "alquileres"
      ? `${baseUrl}/uploads/contratos/${id}.pdf`
      : `${baseUrl}/uploads/facturas/${type}/${id}.pdf`;
  const [exists, setExists] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(url, { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setExists(res.ok);
      })
      .catch(() => {
        if (!cancelled) setExists(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (exists === false) return <NotFound />;
  if (exists === null) return null;

  return (
    <iframe
      src={url}
      title={`Documento ${type}`}
      style={{
        width: "100vw",
        height: "100vh",
        border: "none",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    />
  );
}
