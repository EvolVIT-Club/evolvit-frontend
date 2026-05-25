import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

// Har request se pehle token automatically add ho jaaye
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;