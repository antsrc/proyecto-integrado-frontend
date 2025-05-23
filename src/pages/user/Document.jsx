import { useParams } from "react-router-dom";

export default function Document() {
  const { id, type } = useParams();
  const url = `http://localhost:3000/uploads/${type}/${id}.pdf`;

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
