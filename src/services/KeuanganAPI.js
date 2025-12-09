import axios from 'axios';

const API_URL = 'http://localhost:4000/keuangan'; // endpoint utama backend

export const getAll = () => {
  return axios.get(API_URL);
};

export const getAllPemasukan = () => {
  return axios.get(`${API_URL}/pemasukan`);
};

export const getAllPengeluaran = () => {
  return axios.get(`${API_URL}/pengeluaran`);
};

export const createPengeluaran = async (body) => {
  return axios.post(`${API_URL}/pengeluaran`, body, {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const createPemasukan = async (body) => {
  return axios.post(`${API_URL}/pemasukan`, body, {
    headers: { 'Content-Type': 'application/json' }
  });
};
