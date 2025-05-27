const BooleanIcon = ({ value }) => {
  const color = value ? "bg-green-500" : "bg-red-500";
  const title = value ? "Sí" : "No";

  return (
    <span
      title={title}
      className={`inline-block w-3 h-3 rounded-full ${color}`}
    />
  );
};

export default BooleanIcon;
