// const create = async (boardData) => {
//   try {
//     const response = await axiosClient.post('/boards', boardData);
//     console.log(response.data);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

import axiosClient from './axiosClient';

const boardApi = {
  create: () => axiosClient.post('boards'),
  getAll: () => axiosClient.get('boards'),
  updatePosition: (params) => axiosClient.put('boards/position', params),
  getOne: (id) => axiosClient.get(`/boards/${id}`),
  delete: (id) => axiosClient.delete(`boards/${id}`),
  update: (id, params) => axiosClient.put(`boards/${id}`, params),
  getFavourites: () => axiosClient.get('boards/favourites'),
  updateFavouritePosition: (params) => axiosClient.put('boards/favourites', params)
};

export default boardApi;
