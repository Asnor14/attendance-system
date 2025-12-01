import api from './axios';

export const devicesAPI = {
  getAll: () => api.get('/devices').then(res => res.data),
  getById: (id) => api.get(`/devices/${id}`).then(res => res.data),
  getLogs: (id) => api.get(`/devices/${id}/logs`).then(res => res.data),
  create: (data) => api.post('/devices', data).then(res => res.data),
  update: (id, data) => api.put(`/devices/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/devices/${id}`).then(res => res.data),
};