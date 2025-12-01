import api from './axios';

export const pendingAPI = {
  // Get all pending students
  getAll: () => api.get('/pending').then(res => res.data),
  
  // Get single detail
  getById: (id) => api.get(`/pending/${id}`).then(res => res.data),
  
  // Create (used by your future registration site)
  create: (data) => api.post('/pending', data).then(res => res.data),
  
  // Approve (Moves to main Student table + Assigns RFID)
  approve: (id, rfidUid) => api.post(`/pending/${id}/approve`, { rfid_uid: rfidUid }).then(res => res.data),
  
  // Reject (Marks as rejected)
  reject: (id) => api.post(`/pending/${id}/reject`).then(res => res.data),
};