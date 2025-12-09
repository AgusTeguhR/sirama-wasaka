import axios from 'axios';

const API_URL = 'http://localhost:4000/arsip'; // sesuaikan

export const getAllArsip = async () => {
  return axios.get(API_URL);
};

// ⬅️ body bisa FormData atau JSON tergantung kebutuhan
export const createArsip = async (body) => {
  return axios.post(API_URL, body, {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const editArsip = async (id, body) => {
  return axios.patch(`${API_URL}/${id}`, body, {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const deleteArsip = async (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
