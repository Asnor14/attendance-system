import api from './axios';

export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  verify: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
  // 👇 NEW FUNCTION
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  }
};