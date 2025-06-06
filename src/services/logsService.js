import api from '../config/axios';

export async function getAuditLog(n) {
  const response = await api.get('/logs/audit', { params: { n } });
  return response.data;
}

export async function getErrorLog(n) {
  const response = await api.get('/logs/error', { params: { n } });
  return response.data;
}
