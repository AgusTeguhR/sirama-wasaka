/* eslint-disable */
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box } from '@mui/material';
import { create, edit } from '../../services/AnggotaAPI';

const ModalAnggota = ({ isOpen, onClose, onSuccess, editData }) => {
  const [form, setForm] = useState({
    nama: '',
    status: '',
    kamar: '',
    prodi: '',
    fakultas: '',
    asal: '',
    foto: null,
    fotoLama: '',
    no_hp: '',
    tgl_masuk: ''
  });

  useEffect(() => {
    if (editData) {
      setForm({
        nama: editData.nama || '',
        status: editData.status || '',
        kamar: editData.kamar || '',
        prodi: editData.prodi || '',
        fakultas: editData.fakultas || '',
        asal: editData.asal || '',
        foto: null, // kosongkan supaya hanya file baru bila user pilih
        fotoLama: editData.foto || '',
        no_hp: editData.no_hp || '',
        tgl_masuk: editData.tgl_masuk?.split('T')[0] || ''
      });
    } else {
      setForm({
        nama: '',
        status: '',
        kamar: '',
        prodi: '',
        fakultas: '',
        asal: '',
        foto: null,
        fotoLama: '',
        no_hp: '',
        tgl_masuk: ''
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setForm((prev) => ({ ...prev, foto: file || null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // build FormData similarly ke ModalSuratMasuk
      const formData = new FormData();
      // append non-file fields
      formData.append('nama', form.nama);
      formData.append('status', form.status);
      formData.append('kamar', form.kamar);
      formData.append('prodi', form.prodi);
      formData.append('fakultas', form.fakultas);
      formData.append('asal', form.asal);
      formData.append('no_hp', form.no_hp);
      formData.append('tgl_masuk', form.tgl_masuk);

      // hanya append foto bila ada file baru
      if (form.foto && form.foto instanceof File) {
        formData.append('foto', form.foto);
      }

      if (editData) {
        // edit: foto opsional
        await edit(editData.id_penghuni, formData);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data anggota berhasil diperbarui!',
          timer: 1500,
          showConfirmButton: false,
          width: '260px',
          backdrop: `rgba(0,0,0,0.4) blur(5px)`,
          customClass: { popup: 'small-alert' }
        });
      } else {
        // create: foto wajib
        if (!form.foto || !(form.foto instanceof File)) {
          Swal.fire({
            icon: 'warning',
            title: 'Oops!',
            text: 'Foto wajib diisi saat tambah data!',
            confirmButtonText: 'OK',
            backdrop: `rgba(0,0,0,0.4)`,
            customClass: {
              popup: 'small-alert'
            },
            didOpen: () => {
              const swalContainer = document.querySelector('.swal2-container');
              if (swalContainer) swalContainer.style.zIndex = '2000';
            }
          });

          return;
        }
        await create(formData);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data anggota berhasil ditambahkan!',
          timer: 1500,
          showConfirmButton: false,
          width: '260px',
          backdrop: `rgba(0,0,0,0.4) blur(5px)`,
          customClass: { popup: 'small-alert' }
        });

        // reset form after successful create
        setForm({
          nama: '',
          status: '',
          kamar: '',
          prodi: '',
          fakultas: '',
          asal: '',
          foto: null,
          fotoLama: '',
          no_hp: '',
          tgl_masuk: ''
        });
      }

      if (onSuccess) await onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submit anggota:', error);
      Swal.fire('Gagal!', 'Terjadi kesalahan saat menyimpan data anggota.', 'error');
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
        sx: {
          borderRadius: 2,
          p: 2.5,
          boxShadow: 6,
          bgcolor: 'white',
          maxWidth: 720
        }
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(5px)',
            backgroundColor: 'rgba(0,0,0,0.4)'
          }
        }
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: '1rem',
          color: 'rgb(31 41 55)',
          pb: 1,
          borderBottom: '1px solid #e5e7eb'
        }}
      >
        {editData ? 'Edit Anggota' : 'Tambah Anggota'}
      </DialogTitle>

      <DialogContent sx={{ mt: 1.5, p: 0 }}>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
          <TextField
            label="Nama"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            required
            size="small"
            fullWidth
            InputLabelProps={{ sx: { fontSize: '0.75rem', mb: 0.5 } }}
          />

          <TextField
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            size="small"
            fullWidth
            InputLabelProps={{ sx: { fontSize: '0.75rem', mb: 0.5 } }}
          />

          <TextField
            select
            label="No Kamar"
            name="kamar"
            value={form.kamar}
            onChange={handleChange}
            required
            size="small"
            fullWidth
            SelectProps={{ native: true }}
            InputLabelProps={{ sx: { fontSize: '0.75rem', mb: 0.5 } }}
          >
            <option value="" disabled>
              Pilih kamar
            </option>
            {Array.from({ length: 14 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </TextField>

          <TextField
            label="Prodi"
            name="prodi"
            value={form.prodi}
            onChange={handleChange}
            required
            size="small"
            fullWidth
            InputLabelProps={{ sx: { fontSize: '0.75rem', mb: 0.5 } }}
          />

          <TextField
            label="Fakultas"
            name="fakultas"
            value={form.fakultas}
            onChange={handleChange}
            required
            size="small"
            fullWidth
            InputLabelProps={{ sx: { fontSize: '0.75rem', mb: 0.5 } }}
          />

          <TextField
            label="Asal"
            name="asal"
            value={form.asal}
            onChange={handleChange}
            required
            size="small"
            fullWidth
            InputLabelProps={{ sx: { fontSize: '0.75rem', mb: 0.5 } }}
          />

          <TextField
            label="No HP"
            name="no_hp"
            value={form.no_hp}
            onChange={handleChange}
            required
            size="small"
            fullWidth
            InputLabelProps={{ sx: { fontSize: '0.75rem', mb: 0.5 } }}
          />

          <TextField
            label="Tanggal Masuk"
            name="tgl_masuk"
            type="date"
            value={form.tgl_masuk}
            onChange={handleChange}
            required
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true, sx: { fontSize: '0.75rem', mb: 0.5 } }}
          />

          <Box gridColumn="1 / -1">
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'rgb(75 85 99)',
                mb: 0.5
              }}
            >
              {editData ? 'Ganti Foto (Opsional)' : 'Upload Foto (Wajib)'}
            </Typography>

            <input
              type="file"
              name="foto"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '6px',
                width: '100%'
              }}
            />

            {editData && form.fotoLama && (
              <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'gray' }}>
                Foto sebelumnya:{' '}
                <a
                  href={`https://webarsipbbpks.online/uploads/${form.fotoLama}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#2563eb', textDecoration: 'underline' }}
                >
                  {form.fotoLama}
                </a>
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-end', pt: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
          sx={{
            textTransform: 'none',
            borderColor: '#e5e7eb',
            color: '#374151',
            fontSize: '0.8rem',
            '&:hover': { bgcolor: '#f3f4f6', borderColor: '#d1d5db' }
          }}
        >
          Batal
        </Button>

        <Button
          type="submit"
          variant="contained"
          size="small"
          sx={{
            textTransform: 'none',
            bgcolor: '#2563eb',
            fontSize: '0.8rem',
            '&:hover': { bgcolor: '#1e40af' }
          }}
        >
          {editData ? 'Update' : 'Simpan'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAnggota;
