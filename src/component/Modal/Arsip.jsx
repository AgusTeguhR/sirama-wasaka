/* eslint-disable */
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box } from '@mui/material';
import { createArsip, editArsip } from '../../services/ArsipAPI';

const ModalArsip = ({ isOpen, onClose, onSuccess, editData }) => {
  const [form, setForm] = useState({
    acara: '',
    tgl: '',
    link: ''
  });

  useEffect(() => {
    if (editData) {
      setForm({
        acara: editData.acara || '',
        tgl: editData.tgl ? editData.tgl.split('T')[0] : '',
        link: editData.link || ''
      });
    } else {
      setForm({
        acara: '',
        tgl: '',
        link: ''
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.acara?.trim() || !form.tgl) {
      Swal.fire({
        icon: 'warning',
        title: 'Data kurang lengkap',
        text: 'Kolom acara dan tanggal wajib diisi.',
        confirmButtonText: 'OK',
        customClass: { popup: 'small-alert' }
      });
      return;
    }

    try {
      const payload = {
        acara: form.acara,
        tgl: form.tgl,
        link: form.link
      };

      if (editData) {
        await editArsip(editData.id_arsip, payload);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data arsip berhasil diperbarui!',
          timer: 1400,
          showConfirmButton: false,
          customClass: { popup: 'small-alert' }
        });
      } else {
        await createArsip(payload);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data arsip berhasil ditambahkan!',
          timer: 1400,
          showConfirmButton: false,
          customClass: { popup: 'small-alert' }
        });

        // reset form after create
        setForm({
          acara: '',
          tgl: '',
          link: ''
        });
      }

      if (onSuccess) await onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submit arsip:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Terjadi kesalahan saat menyimpan data arsip.',
        customClass: { popup: 'small-alert' }
      });
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
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(0,0,0,0.35)'
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
        {editData ? 'Edit Arsip Kegiatan' : 'Tambah Arsip Kegiatan'}
      </DialogTitle>

      <DialogContent sx={{ mt: 1.5, p: 0 }}>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
          <TextField
            label="Acara"
            name="acara"
            value={form.acara}
            onChange={handleChange}
            required
            size="small"
            fullWidth
            InputLabelProps={{ sx: { fontSize: '0.75rem', mb: 0.5 } }}
          />

          <TextField
            label="Tanggal"
            name="tgl"
            type="date"
            value={form.tgl}
            onChange={handleChange}
            required
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true, sx: { fontSize: '0.75rem', mb: 0.5 } }}
          />

          <TextField
            label="Link (opsional)"
            name="link"
            value={form.link}
            onChange={handleChange}
            placeholder="https://drive.google.com/..."
            size="small"
            fullWidth
            InputLabelProps={{ sx: { fontSize: '0.75rem', mb: 0.5 } }}
          />

          <Typography variant="caption" sx={{ gridColumn: '1 / -1', color: 'text.secondary' }}>
            Isi tautan jika arsip tersimpan di layanan cloud (Google Drive, OneDrive, dsb.). Kosongkan jika tidak ada.
          </Typography>
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

export default ModalArsip;
