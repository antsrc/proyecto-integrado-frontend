import api from '../config/axios';

export async function getClientes() {
  try {
    const response = await api.get('/clientes');
    return response.data;
  } catch {
    throw new Error('Error al obtener los clientes');
  }
}

export async function getClienteById(id) {
  try {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  } catch {
    throw new Error('Error al obtener el cliente');
  }
}

export async function createCliente(data) {
  const response = await api.post('/clientes', data);
  return response.data;
}

export async function updateCliente(id, data) {
  const response = await api.patch(`/clientes/${id}`, data);
  return response.data;
}

export async function deleteCliente(id) {
  const response = await api.delete(`/clientes/${id}`);
  return response.data;
}

export async function getClientesIdCodigo() {
  try {
    const response = await api.get('/clientes/summary');
    return response.data;
  } catch {
    throw new Error('Error al obtener los clientes');
  }
}


