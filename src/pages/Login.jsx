import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { User, Lock, XCircle } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ nombre: "", contrasena: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form);
    } catch {
      setError("Nombre o contraseña incorrectos");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12 relative">
      {/* Error flotante */}
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-6">
          <div className="flex items-center gap-3 bg-red-500 text-white text-sm font-semibold px-4 py-3 rounded-md shadow-md">
            <XCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md z-10">
        <h1 className="font-bold text-center text-3xl text-purple-600 mb-6">
          Gestión Inmobiliaria S.L.
        </h1>
        <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            <div>
              <label className="font-semibold text-base text-gray-700 pb-1 block">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Nombre de usuario"
                  required
                  className="pl-10 border border-gray-300 rounded-lg px-4 py-2 text-base w-full text-gray-500"
                />
              </div>
            </div>
            <div>
              <label className="font-semibold text-base text-gray-700 pb-1 block">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="contrasena"
                  value={form.contrasena}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  required
                  className="pl-10 border border-gray-300 rounded-lg px-4 py-2 text-base w-full text-gray-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="transition duration-200 bg-purple-600 hover:bg-purple-700 text-white w-full py-3 rounded-lg text-base font-semibold shadow-sm hover:shadow-md cursor-pointer"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
