import api from '../config/axios';

export async function getMensualidades() {
  try {
    const response = await api.get('/mensualidades');
    return response.data;
  } catch {
    throw new Error('Error al obtener las mensualidades');
  }
}

export async function getMensualidadById(id) {
  try {
    const response = await api.get(`/mensualidades/${id}`);
    return response.data;
  } catch {
    throw new Error('Error al obtener la mensualidad');
  }
}

export async function createMensualidad(data) {
  const response = await api.post('/mensualidades', data);
  return response.data;
}

export async function updateMensualidad(id, data) {
  const response = await api.patch(`/mensualidades/${id}`, data);
  return response.data;
}

export async function deleteMensualidad(id) {
  const response = await api.delete(`/mensualidades/${id}`);
  return response.data;
}

export async function updateFacturaMensualidad(id, file) {
  const formData = new FormData();
  formData.append('documento', file);
  const response = await api.patch(`/mensualidades/${id}/factura`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function existsFacturaMensualidad(id) {
  try {
    const url = `http://localhost:3000/uploads/facturas/mensualidades/${id}.pdf`;
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

export async function getIdsConFactura() {
  const response = await api.get('/mensualidades/facturas');
  return response.data;
}

export async function existsFactura(id) {
  try {
    const url = `http://localhost:3000/uploads/facturas/mensualidades/${id}.pdf`;
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}
