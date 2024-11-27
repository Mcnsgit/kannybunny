import axios from 'axios'
import queryString from 'query-string'

const axiosClient = axios.create({
  baseURL: 'http://localhost:3001/api/v1/',
  headers: {
      'Content-Type': 'application/json', 
  },
  paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async config => {
  return {
    ...config,
    headers: {
      'Content-Type': 'application/json',
    }
  }
})

axiosClient.interceptors.response.use(
  response => {
    if (response && response.data) return response.data;
    return response;
  },
  error => {
    if (!error.response) {
      return alert(error)
    }
    throw error;
  }
);


export default axiosClient
