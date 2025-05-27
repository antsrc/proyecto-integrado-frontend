import api from '../config/axios';

export async function getReformas() {
  try {
    const response = await api.get('/reformas');
    return response.data;
  } catch {
    throw new Error('Error al obtener las reformas');
  }
}

export async function getReformaById(id) {
  try {
    const response = await api.get(`/reformas/${id}`);
    return response.data;
  } catch {
    throw new Error('Error al obtener la reforma');
  }
}

export async function createReforma(data) {
  const response = await api.post('/reformas', data);
  return response.data;
}

export async function updateReforma(id, data) {
  const response = await api.patch(`/reformas/${id}`, data);
  return response.data;
}

export async function deleteReforma(id) {
  const response = await api.delete(`/reformas/${id}`);
  return response.data;
}

export async function updateFactura(id, file) {
  const formData = new FormData();
  formData.append('documento', file);
  const response = await api.patch(`/reformas/${id}/factura`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function getIdsConFactura() {
  const response = await api.get('/reformas/facturas');
  return response.data;
}

export async function existsFactura(id) {
  try {
    const url = `http://localhost:3000/uploads/facturas/reformas/${id}.pdf`;
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}
