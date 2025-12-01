import api from './axios';

export const schedulesAPI = {
  getAll: () => api.get('/schedules').then(res => res.data),
  getById: (id) => api.get(`/schedules/${id}`).then(res => res.data),
  create: (data) => api.post('/schedules', data).then(res => res.data),
  update: (id, data) => api.put(`/schedules/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/schedules/${id}`).then(res => res.data),
};

