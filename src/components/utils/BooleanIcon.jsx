import { CircleCheck, CircleX } from "lucide-react";

const BooleanIcon = ({ value }) => {
  const color = value ? "text-green-500" : "text-red-500";
  const title = value ? "Sí" : "No";
  const Icon = value ? CircleCheck : CircleX;

  return <Icon className={`w-4 h-4 ${color}`} title={title} />;
};

export default BooleanIcon;
