import axios from 'axios';
import queryString from 'query-string';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://kannybunny.onrender.com/api/v1';



const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.nterceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



export default axiosClient;
