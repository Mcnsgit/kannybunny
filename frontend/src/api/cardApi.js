import axiosClient from './axiosClient'

const cardApi = {
  create: (boardId, params) => axiosClient.post(`boards/${boardId}/cards`, params),
  updatePosition: (boardId, params) => axiosClient.put(
    `boards/${boardId}/cards/update-position`,
    params
  ),
  delete: (boardId, cardId) => axiosClient.delete(`boards/${boardId}/cards/${cardId}`),
  update: (boardId, cardId, params) => axiosClient.put(
    `boards/${boardId}/cards/${cardId}`,
    params
  )
}

export default cardApi