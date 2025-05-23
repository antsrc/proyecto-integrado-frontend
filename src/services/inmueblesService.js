import api from '../config/axios';

export async function getInmuebles() {
  try {
    const response = await api.get('/inmuebles');
    return response.data;
  } catch {
    throw new Error('Error al obtener los inmuebles');
  }
}

export async function getInmuebleById(id) {
  try {
    const response = await api.get(`/inmuebles/${id}`);
    return response.data;
  } catch {
    throw new Error('Error al obtener el inmueble');
  }
}

export async function createInmueble(data) {
  const response = await api.post('/inmuebles', data);
  return response.data;
}

export async function updateInmueble(id, data) {
  const response = await api.patch(`/inmuebles/${id}`, data);
  return response.data;
}

export async function deleteInmueble(id) {
  const response = await api.delete(`/inmuebles/${id}`);
  return response.data;
}

export async function getInmueblesIdCodigo() {
  try {
    const response = await api.get('/inmuebles/summary');
    return response.data;
  } catch {
    throw new Error('Error al obtener los inmuebles');
  }
}
