<<<<<<< HEAD
import axios from 'axios';

const API_URL_SURAT = 'http://localhost:4000/surat'; // sesuaikan

export const getAllSuratMasuk = async () => {
  return axios.get(`${API_URL_SURAT}/masuk`);
};

// ⬅️ body bisa FormData atau JSON tergantung kebutuhan
export const createNewSuratMasuk = async (formData) => {
  return axios.post(`${API_URL_SURAT}/masuk`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const editSuratMasuk = async (id, body) => {
  return axios.patch(`${API_URL_SURAT}/masuk/${id}`, body, {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const deleteSuratMasuk = async (id) => {
  return axios.delete(`${API_URL_SURAT}/masuk/${id}`);
};

// 🔹 Get all Surat Keluar
export const getAllSuratKeluar = async () => {
  return axios.get(`${API_URL_SURAT}/keluar`);
};

// 🔹 Create Surat Keluar
export const createNewSuratKeluar = async (formData) => {
  return axios.post(`${API_URL_SURAT}/keluar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// 🔹 Edit Surat Keluar
export const editSuratKeluar = async (id, body) => {
  return axios.patch(`${API_URL_SURAT}/keluar/${id}`, body, {
    headers: { 'Content-Type': 'application/json' }
  });
};

// 🔹 Delete Surat Keluar
export const deleteSuratKeluar = async (id) => {
  return axios.delete(`${API_URL_SURAT}/keluar/${id}`);
};
=======
import axios from 'axios';

const API_URL_SURAT = 'http://localhost:4000/surat'; // sesuaikan

export const getAllSuratMasuk = async () => {
  return axios.get(`${API_URL_SURAT}/masuk`);
};

// ⬅️ body bisa FormData atau JSON tergantung kebutuhan
export const createNewSuratMasuk = async (formData) => {
  return axios.post(`${API_URL_SURAT}/masuk`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const editSuratMasuk = async (id, body) => {
  return axios.patch(`${API_URL_SURAT}/masuk/${id}`, body, {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const deleteSuratMasuk = async (id) => {
  return axios.delete(`${API_URL_SURAT}/masuk/${id}`);
};

// 🔹 Get all Surat Keluar
export const getAllSuratKeluar = async () => {
  return axios.get(`${API_URL_SURAT}/keluar`);
};

// 🔹 Create Surat Keluar
export const createNewSuratKeluar = async (formData) => {
  return axios.post(`${API_URL_SURAT}/keluar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// 🔹 Edit Surat Keluar
export const editSuratKeluar = async (id, body) => {
  return axios.patch(`${API_URL_SURAT}/keluar/${id}`, body, {
    headers: { 'Content-Type': 'application/json' }
  });
};

// 🔹 Delete Surat Keluar
export const deleteSuratKeluar = async (id) => {
  return axios.delete(`${API_URL_SURAT}/keluar/${id}`);
};
>>>>>>> 02b36bfd101b72d785f910fe958186a012e6cc54
