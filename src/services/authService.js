/* eslint-disable no-unused-vars */
import api from '../config/axios.js';

export async function loginUser(data) {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error) {
    throw new Error('Error al iniciar sesión');
  }
}

export async function logoutUser() {
  try {
    const response = await api.post('/auth/logout');
  } catch (error) {
    throw new Error('Error al cerrar sesión');
  }
}

export async function getUser() {
  try {
    const response = await api.get('/auth/user');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener el usuario');
  }
}
