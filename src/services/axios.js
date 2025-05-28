
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true, 
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[Axios Error]', err?.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api;
