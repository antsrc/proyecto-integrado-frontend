import api from '../config/axios';

export async function getProveedores() {
  try {
    const response = await api.get('/proveedores');
    return response.data;
  } catch {
    throw new Error('Error al obtener los proveedores');
  }
}

export async function getProveedorById(id) {
  try {
    const response = await api.get(`/proveedores/${id}`);
    return response.data;
  } catch {
    throw new Error('Error al obtener el proveedor');
  }
}

export async function createProveedor(data) {
  const response = await api.post('/proveedores', data);
  return response.data;
}

export async function updateProveedor(id, data) {
  const response = await api.patch(`/proveedores/${id}`, data);
  return response.data;
}

export async function deleteProveedor(id) {
  const response = await api.delete(`/proveedores/${id}`);
  return response.data;
}

export async function getProveedoresIdCodigo() {
  const response = await api.get('/proveedores/summary');
  return response.data;
}
