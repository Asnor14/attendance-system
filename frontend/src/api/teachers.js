import api from './axios';

export const teachersAPI = {
  getAll: () => api.get('/teachers').then(res => res.data),
  create: (data) => api.post('/teachers', data).then(res => res.data),
  update: (id, data) => api.put(`/teachers/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/teachers/${id}`).then(res => res.data),
};