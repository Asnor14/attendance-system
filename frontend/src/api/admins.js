import api from './axios';

export const adminsAPI = {
  getAll: () => api.get('/admins').then(res => res.data),
  create: (data) => api.post('/admins', data).then(res => res.data), // Data includes current_password
  delete: (id) => api.delete(`/admins/${id}`).then(res => res.data),
};