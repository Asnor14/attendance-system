import api from './axios';

export const rfidAPI = {
  getLive: () => api.get('/rfid/live').then(res => res.data),
  clear: () => api.post('/rfid/clear').then(res => res.data),
};

