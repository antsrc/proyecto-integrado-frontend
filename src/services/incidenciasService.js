import api from '../config/axios';

export async function getIncidencias() {
  try {
    const response = await api.get('/incidencias');
    return response.data;
  } catch {
    throw new Error('Error al obtener las incidencias');
  }
}

export async function getIncidenciaById(id) {
  try {
    const response = await api.get(`/incidencias/${id}`);
    return response.data;
  } catch {
    throw new Error('Error al obtener la incidencia');
  }
}

export async function createIncidencia(data) {
  const response = await api.post('/incidencias', data);
  return response.data;
}

export async function updateIncidencia(id, data) {
  const response = await api.patch(`/incidencias/${id}`, data);
  return response.data;
}

export async function deleteIncidencia(id) {
  const response = await api.delete(`/incidencias/${id}`);
  return response.data;
}

export async function getIncidenciasIdCodigo() {
  try {
    const response = await api.get('/incidencias/summary');
    return response.data;
  } catch {
    throw new Error('Error al obtener las incidencias');
  }
}
