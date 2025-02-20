import axios from 'axios';



const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.REACT_APP_LOCAL_API_URL || 'http://localhost:3001/api/v1';
  }
  return process.env.REACT_APP_PROD_API_URL || 'https://kannybunny.onrender.com/api/v1';
};

const axiosClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosClient.interceptors.request.use(
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
