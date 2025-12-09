import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box } from '@mui/material';
import { createNewSuratMasuk, editSuratMasuk } from '../../services/AdministrasiAPI';

const ModalSuratMasuk = ({ isOpen, onClose, onSuccess, editData }) => {
  const [form, setForm] = useState({
    no_surat: '',
    asal: '',
    tanggal: '',
    perihal: '',
    file: null,
    fileLama: ''
  });

  useEffect(() => {
    if (editData) {
      setForm({
        no_surat: editData.no_surat || '',
        asal: editData.asal || '',
        tanggal: editData.tanggal?.split('T')[0] || '',
        perihal: editData.perihal || '',
        file: null,
        fileLama: editData.file || ''
      });
    } else {
      setForm({
        no_surat: '',
        asal: '',
        tanggal: '',
        perihal: '',
        file: null,
        fileLama: ''
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setForm((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val && key !== 'fileLama') formData.append(key, val);
      });

      if (editData) {
        await editSuratMasuk(editData.id_surat, formData);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data surat berhasil diperbarui!',
          timer: 1500,
          showConfirmButton: false,
          width: '260px',
          backdrop: `rgba(0,0,0,0.4) blur(5px)`,
          customClass: {
            popup: 'small-alert'
          }
        });
      } else {
        if (!form.file) {
          Swal.fire('Oops!', 'File surat wajib diunggah!', 'warning');
          return;
        }
        await createNewSuratMasuk(formData);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data surat berhasil ditambahkan!',
          timer: 1500,
          showConfirmButton: false,
          width: '260px',
          backdrop: `rgba(0,0,0,0.4) blur(5px)`,
          customClass: {
            popup: 'small-alert'
          }
        });
      }

      if (onSuccess) await onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submit surat:', error);
      Swal.fire('Gagal!', 'Terjadi kesalahan saat menyimpan data.', 'error');
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
        sx: {
          borderRadius: 2,
          p: 2.5,
          boxShadow: 6,
          bgcolor: 'white',
          maxWidth: 420
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
        {editData ? 'Edit Surat Masuk' : 'Tambah Surat Masuk'}
      </DialogTitle>

      <DialogContent sx={{ mt: 1.5, p: 0 }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Nomor Surat"
            name="no_surat"
            value={form.no_surat}
            onChange={handleChange}
            required
            size="small"
            fullWidth
            InputLabelProps={{
              sx: { fontSize: '0.75rem', mb: 0.5 }
            }}
          />

          <TextField
            label="Asal Surat"
            name="asal"
            value={form.asal}
            onChange={handleChange}
            required
            size="small"
            fullWidth
            InputLabelProps={{
              sx: { fontSize: '0.75rem', mb: 0.5 }
            }}
          />

          <TextField
            label="Tanggal"
            name="tanggal"
            type="date"
            value={form.tanggal}
            onChange={handleChange}
            required
            size="small"
            fullWidth
            InputLabelProps={{
              shrink: true,
              sx: { fontSize: '0.75rem', mb: 0.5 }
            }}
          />

          <TextField
            label="Perihal"
            name="perihal"
            value={form.perihal}
            onChange={handleChange}
            required
            fullWidth
            multiline
            rows={3}
            size="small"
            InputLabelProps={{
              sx: { fontSize: '0.75rem', mb: 0.5 }
            }}
          />

          <Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'rgb(75 85 99)',
                mb: 0.5
              }}
            >
              {editData ? 'Ganti File (Opsional)' : 'Upload File Surat'}
            </Typography>
            <input
              type="file"
              name="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '6px',
                width: '100%'
              }}
            />
            {editData && form.fileLama && (
              <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'gray' }}>
                File sebelumnya:{' '}
                <a
                  href={`http://localhost:4000/doc/${form.fileLama}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#2563eb', textDecoration: 'underline' }}
                >
                  {form.fileLama}
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

export default ModalSuratMasuk;
