import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { create, edit } from '../../services/TagihanAPI';
import { getAll } from '../../services/AnggotaAPI';

// Helper
const formatDate = (date) => date.toISOString().split('T')[0];
const getDueDate = (startDate) => {
  const d = new Date(startDate);
  d.setDate(d.getDate() + 10);
  return formatDate(d);
};
const getCurrentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const Modal = ({ isOpen, onClose, onSuccess, editData }) => {
  const [tagihan, setTagihan] = useState({
    id_tagihan: '',
    id_penghuni: '',
    id_kamar: '',
    periode: '',
    jumlah: '',
    status: 'Belum',
    tgl_tagihan: '',
    jatuh_tempo: ''
  });

  const [anggotaList, setAnggotaList] = useState([]);

  useEffect(() => {
    if (editData) {
      setTagihan({
        id_tagihan: editData.id_tagihan || '',
        id_penghuni: editData.id_penghuni || '',
        id_kamar: editData.id_kamar || '',
        periode: editData.periode || '',
        jumlah: editData.jumlah || '',
        status: editData.status || 'Belum',
        tgl_tagihan: editData.tgl_tagihan || '',
        jatuh_tempo: editData.jatuh_tempo || ''
      });
    } else {
      const today = new Date();
      setTagihan({
        id_tagihan: '',
        id_penghuni: '',
        id_kamar: '',
        periode: getCurrentMonth(),
        jumlah: 100000,
        status: 'Belum',
        tgl_tagihan: formatDate(today),
        jatuh_tempo: getDueDate(today)
      });
    }
  }, [editData]);

  useEffect(() => {
    fetchAnggota();
  }, []);

  const fetchAnggota = async () => {
    try {
      const res = await getAll();
      setAnggotaList(res.data?.data || []);
    } catch (err) {
      console.error('Gagal memuat anggota:', err);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'tgl_tagihan') {
      setTagihan((prev) => ({
        ...prev,
        tgl_tagihan: value,
        jatuh_tempo: getDueDate(value)
      }));
    } else {
      setTagihan((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;

      if (editData) {
        res = await edit(editData.id_tagihan, tagihan);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data tagihan berhasil diperbarui!',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        // eslint-disable-next-line no-unused-vars
        res = await create(tagihan);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data tagihan berhasil ditambahkan!',
          showConfirmButton: false,
          timer: 1500
        });
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data?.serverMessage || '';

      if (msg.includes('Duplicate entry')) {
        const penghuni = anggotaList.find((a) => String(a.id_penghuni) === String(tagihan.id_penghuni));
        Swal.fire({
          icon: 'warning',
          title: 'Tagihan Sudah Ada',
          text: `Tagihan ${penghuni?.nama || 'penghuni'} untuk periode ${tagihan.periode} sudah ada.`,
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Terjadi kesalahan saat menyimpan data.'
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay – sudah sesuai aturan accessibility */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-default"
        aria-label="Close modal overlay"
      ></button>

      {/* Konten Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-4 z-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">{editData ? 'Edit Tagihan' : 'Tambah Tagihan'}</h2>

        <form className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm" onSubmit={handleSubmit}>
          {/* Nama Penghuni */}
          <div>
            <label htmlFor="id_penghuni" className="block text-xs font-medium text-gray-600 mb-1">
              Nama Penghuni
            </label>
            <select
              id="id_penghuni"
              name="id_penghuni"
              value={tagihan.id_penghuni}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-2 py-1.5"
            >
              <option value="">Pilih Penghuni</option>
              {anggotaList?.map((a) => (
                <option key={a.id_penghuni} value={a.id_penghuni}>
                  {a.nama}
                </option>
              ))}
            </select>
          </div>

          {/* No Kamar */}
          <div>
            <label htmlFor="id_kamar" className="block text-xs font-medium text-gray-600 mb-1">
              No Kamar
            </label>
            <input
              id="id_kamar"
              type="text"
              name="id_kamar"
              value={tagihan.id_kamar}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-2 py-1.5"
            />
          </div>

          {/* Periode */}
          <div>
            <label htmlFor="periode" className="block text-xs font-medium text-gray-600 mb-1">
              Periode
            </label>
            <input
              id="periode"
              type="month"
              name="periode"
              value={tagihan.periode}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-2 py-1.5"
            />
          </div>

          {/* Jumlah */}
          <div>
            <label htmlFor="jumlah" className="block text-xs font-medium text-gray-600 mb-1">
              Jumlah (Rp)
            </label>
            <input
              id="jumlah"
              type="number"
              name="jumlah"
              value={tagihan.jumlah}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-2 py-1.5"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-xs font-medium text-gray-600 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={tagihan.status}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-2 py-1.5"
            >
              <option value="Belum">Belum</option>
              <option value="Lunas">Lunas</option>
            </select>
          </div>

          {/* Tanggal Tagihan & Jatuh Tempo (hanya tambah data) */}
          {!editData && (
            <>
              <div>
                <label htmlFor="tgl_tagihan" className="block text-xs font-medium text-gray-600 mb-1">
                  Tanggal Tagihan
                </label>
                <input
                  id="tgl_tagihan"
                  type="date"
                  name="tgl_tagihan"
                  value={tagihan.tgl_tagihan}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-2 py-1.5"
                />
              </div>

              <div>
                <label htmlFor="jatuh_tempo" className="block text-xs font-medium text-gray-600 mb-1">
                  Jatuh Tempo
                </label>
                <input
                  id="jatuh_tempo"
                  type="date"
                  name="jatuh_tempo"
                  value={tagihan.jatuh_tempo}
                  readOnly
                  required
                  className="w-full border border-gray-300 rounded-md px-2 py-1.5 bg-gray-100 cursor-not-allowed"
                />
              </div>
            </>
          )}

          {/* Tombol */}
          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-sm bg-gray-200 rounded-md hover:bg-gray-300">
              Batal
            </button>

            <button type="submit" className="px-3 py-1.5 text-sm bg-violet-500 text-white rounded-md hover:bg-violet-600">
              {editData ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
