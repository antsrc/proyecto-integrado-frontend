/* eslint-disable no-unused-vars */
import api from '../config/axios';

// Obtener todos los inmuebles
export async function getInmuebles() {
  try {
    const response = await api.get('/inmuebles');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los inmuebles');
  }
}

// Obtener un inmueble por ID
export async function getInmuebleById(id) {
  try {
    const response = await api.get(`/inmuebles/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener el inmueble');
  }
}

// Crear un inmueble
export async function createInmueble(data) {
  try {
    const response = await api.post('/inmuebles', data);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el inmueble');
  }
}

// Actualizar un inmueble
export async function updateInmueble(id, data) {
  try {
    const response = await api.put(`/inmuebles/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar el inmueble');
  }
}

// Eliminar un inmueble
export async function deleteInmueble(id) {
  try {
    const response = await api.delete(`/inmuebles/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar el inmueble');
  }
}
