import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ nombre: '', contrasena: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form);
      // navigate('/dashboard');
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError('Nombre o contraseña incorrectos');
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>

      <input
        type="text"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Nombre de usuario"
        required
      />

      <input
        type="password"
        name="contrasena"
        value={form.contrasena}
        onChange={handleChange}
        placeholder="Contraseña"
        required
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit">Entrar</button>
    </form>
    <div class="h-screen flex justify-center items-center bg-[var(--main-light)]">
  <div class="w-full max-w-md px-8">
    <form class="bg-white rounded-md shadow-2xl p-6">
      <div class="flex items-center border-2 mb-6 py-2 px-3 rounded-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
        </svg>
        <input class="pl-2 w-full outline-none border-none" type="email" name="email" placeholder="Email Address" />
      </div>
      <div class="flex items-center border-2 mb-6 py-2 px-3 rounded-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clip-rule="evenodd" />
        </svg>
        <input class="pl-2 w-full outline-none border-none" type="password" name="password" placeholder="Password" />
      </div>
      <button type="submit"
        class="block w-full bg-[var(--main-dark)] mt-5 py-2 rounded-2xl hover:brightness-110 transition-all duration-300 text-white font-semibold">
        Login
      </button>
    </form>
  </div>
</div>
</>
    
  );
}