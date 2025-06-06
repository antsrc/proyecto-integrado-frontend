import api from '../config/axios';

export async function getUsuarios() {
  const response = await api.get('/usuarios');
  return response.data;
}

export async function createUsuario(data) {
  const response = await api.post('/usuarios', data);
  return response.data;
}

export async function updatePassword(id, data) {
  const response = await api.patch(`/usuarios/${id}`, data);
  return response.data;
}

export async function deleteUsuario(id) {
  const response = await api.delete(`/usuarios/${id}`);
  return response.data;
}
