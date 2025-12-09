import axios from 'axios';

const API_URL = 'http://localhost:4000/anggota'; // sesuaikan

export const getAll = async () => {
  return axios.get(API_URL);
};

// ⬅️ body bisa FormData atau JSON tergantung kebutuhan
export const create = async (body) => {
  return axios.post(API_URL, body, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const edit = async (id, body) => {
  return axios.patch(`${API_URL}/${id}`, body, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const erase = async (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
