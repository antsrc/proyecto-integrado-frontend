import api from '../config/axios';
import { API_URL } from '../config/env';

export async function getReparaciones() {
  try {
    const response = await api.get('/reparaciones');
    return response.data;
  } catch {
    throw new Error('Error al obtener las reparaciones');
  }
}

export async function getReparacionById(id) {
  try {
    const response = await api.get(`/reparaciones/${id}`);
    return response.data;
  } catch {
    throw new Error('Error al obtener la reparación');
  }
}

export async function createReparacion(data) {
  const response = await api.post('/reparaciones', data);
  return response.data;
}

export async function updateReparacion(id, data) {
  const response = await api.patch(`/reparaciones/${id}`, data);
  return response.data;
}

export async function deleteReparacion(id) {
  const response = await api.delete(`/reparaciones/${id}`);
  return response.data;
}

export async function updateFactura(id, file) {
  const formData = new FormData();
  formData.append('documento', file);
  const response = await api.patch(`/reparaciones/${id}/factura`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function getIdsConFactura() {
  const response = await api.get('/reparaciones/facturas');
  return response.data;
}

export async function existsFactura(id) {
  try {
    const baseUrl = API_URL.replace(/\/api$/, "");
    const url = `${baseUrl}/uploads/facturas/reparaciones/${id}.pdf`;
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}
