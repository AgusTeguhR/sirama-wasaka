import axios from 'axios';

const API_URL = 'https://backend-asrama.vercel.app/users';

export const loginUser = async (nama, password) => {
  return axios.post(`${API_URL}/login`, {
    nama: nama,
    password: password
  });
};
