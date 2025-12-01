import api from './axios';

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats').then(res => res.data),
};

