import api from '../config/axios';
import { API_URL } from '../config/env';

export async function getAlquileres() {
  try {
    const response = await api.get('/alquileres');
    return response.data;
  } catch {
    throw new Error('Error al obtener los alquileres');
  }
}

export async function getAlquilerById(id) {
  try {
    const response = await api.get(`/alquileres/${id}`);
    return response.data;
  } catch {
    throw new Error('Error al obtener el alquiler');
  }
}

export async function createAlquiler(data) {
  const response = await api.post('/alquileres', data);
  return response.data;
}

export async function updateAlquiler(id, data) {
  const response = await api.patch(`/alquileres/${id}`, data);
  return response.data;
}

export async function deleteAlquiler(id) {
  const response = await api.delete(`/alquileres/${id}`);
  return response.data;
}

export async function updateContrato(id, file) {
  const formData = new FormData();
  formData.append('documento', file);
  const response = await api.patch(`/alquileres/${id}/contrato`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function getIdsConContrato() {
  const response = await api.get('/alquileres/contratos');
  return response.data;
}

export async function existsContrato(id) {
  try {
    const baseUrl = API_URL.replace(/\/api$/, "");
    const url = `${baseUrl}/uploads/contratos/${id}.pdf`;
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

export async function getAlquileresIdCodigo() {
  try {
    const response = await api.get('/alquileres/summary');
    return response.data;
  } catch {
    throw new Error('Error al obtener los alquileres');
  }
}