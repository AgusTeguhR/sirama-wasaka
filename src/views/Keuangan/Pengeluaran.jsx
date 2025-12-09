/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { FiTrendingDown, FiPlus } from 'react-icons/fi';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import Swal from 'sweetalert2';

import { getAllPengeluaran, createPengeluaran } from '../../services/KeuanganAPI';
import Pagination from 'component/Umum/Pagination'; // pastikan path ini sesuai struktur projectmu

const Pengeluaran = () => {
  const [pengeluaran, setPengeluaran] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchPengeluaran();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPengeluaran = async () => {
    try {
      const res = await getAllPengeluaran();
      const data = res?.data?.data ?? res?.data ?? [];
      setPengeluaran(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Gagal mengambil data pengeluaran:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Tidak dapat memuat data pengeluaran',
        timer: 1800,
        showConfirmButton: false,
        didOpen: () => {
          const c = document.querySelector('.swal2-container');
          if (c) c.style.zIndex = '2000';
        }
      });
    }
  };

  // ==== Pagination Logic ====
  const totalPages = Math.max(1, Math.ceil(pengeluaran.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = pengeluaran.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="col-span-6 p-6 rounded-xl border border-stone-300 shadow-sm bg-white">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600} color="text.primary" display="flex" alignItems="center" gap={1}>
          <FiTrendingDown className="text-red-500" /> Pengeluaran Asrama
        </Typography>

        <Button
          startIcon={<FiPlus />}
          variant="contained"
          size="small"
          sx={{
            bgcolor: '#dc2626',
            textTransform: 'none',
            '&:hover': { bgcolor: '#b91c1c' }
          }}
          onClick={() => setIsModalOpen(true)}
        >
          Tambah
        </Button>
      </Box>

      {/* TABEL */}
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHeadPengeluaran />
          <TableBody>
            {Array.isArray(paginatedData) && paginatedData.length > 0 ? (
              paginatedData.map((row) => <TableRowPengeluaran key={row.id_pengeluaran ?? row.id ?? Math.random()} data={row} />)
            ) : (
              <TableRowEmpty colSpan={3} />
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION (komponen terpisah) */}
      <Box mt={3} display="flex" justifyContent="center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            if (page >= 1 && page <= totalPages) setCurrentPage(page);
          }}
        />
      </Box>

      {/* MODAL TAMBAH */}
      <ModalPengeluaran
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchPengeluaran();
        }}
      />
    </div>
  );
};

// ================= TABLE HEAD =================
const TableHeadPengeluaran = () => (
  <TableHead>
    <TableRow sx={{ backgroundColor: '#fff1f2' }}>
      <TableCell align="center" sx={{ width: 140, fontWeight: 600 }}>
        Tanggal
      </TableCell>
      <TableCell align="left" sx={{ width: 360, fontWeight: 600 }}>
        Keperluan
      </TableCell>
      <TableCell align="right" sx={{ width: 160, fontWeight: 600 }}>
        Jumlah (Rp)
      </TableCell>
    </TableRow>
  </TableHead>
);

// ================= TABLE ROW =================
const TableRowPengeluaran = ({ data }) => {
  const { periode, jumlah, sumber } = data;

  const formatTanggal = (d) => (d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-');

  const formatRupiah = (value) => (typeof value === 'number' ? value.toLocaleString('id-ID', { minimumFractionDigits: 0 }) : value || '-');

  return (
    <TableRow hover>
      <TableCell align="center" sx={{ py: 1 }}>
        {formatTanggal(periode)}
      </TableCell>
      <TableCell align="left" sx={{ py: 1, maxWidth: 420 }}>
        <Typography noWrap title={sumber || ''}>
          {sumber || '-'}
        </Typography>
      </TableCell>
      <TableCell align="right" sx={{ py: 1, fontWeight: 700 }}>
        {formatRupiah(jumlah)}
      </TableCell>
    </TableRow>
  );
};

const TableRowEmpty = ({ colSpan }) => (
  <TableRow>
    <TableCell colSpan={colSpan} align="center" sx={{ py: 6, color: 'text.secondary', fontStyle: 'italic' }}>
      Tidak ada data pengeluaran
    </TableCell>
  </TableRow>
);

// ================= MODAL PENGELUARAN (MUI Dialog) =================
const ModalPengeluaran = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    periode: new Date().toISOString().split('T')[0],
    sumber: '',
    jumlah: ''
  });

  useEffect(() => {
    if (isOpen) {
      setForm({
        periode: new Date().toISOString().split('T')[0],
        sumber: '',
        jumlah: ''
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.sumber.trim() || !form.jumlah) {
        Swal.fire({
          icon: 'warning',
          title: 'Oops!',
          text: 'Keperluan dan jumlah wajib diisi!',
          confirmButtonText: 'OK',
          didOpen: () => {
            const c = document.querySelector('.swal2-container');
            if (c) c.style.zIndex = '2000';
          }
        });
        return;
      }

      const payload = { ...form, jumlah: Number(form.jumlah) };
      await createPengeluaran(payload);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data pengeluaran berhasil ditambahkan!',
        timer: 1500,
        showConfirmButton: false,
        didOpen: () => {
          const c = document.querySelector('.swal2-container');
          if (c) c.style.zIndex = '2000';
        }
      });

      if (onSuccess) await onSuccess();
    } catch (error) {
      console.error('Gagal menambahkan:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Terjadi kesalahan saat menyimpan data.',
        didOpen: () => {
          const c = document.querySelector('.swal2-container');
          if (c) c.style.zIndex = '2000';
        }
      });
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
        Tambah Data Pengeluaran
      </DialogTitle>

      <DialogContent sx={{ mt: 1.5, p: 0 }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Tanggal Pengeluaran"
            name="periode"
            type="date"
            value={form.periode}
            onChange={handleChange}
            required
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true, sx: { fontSize: '0.75rem', mb: 0.5 } }}
          />

          <TextField
            label="Jumlah (Rp)"
            name="jumlah"
            type="number"
            value={form.jumlah}
            onChange={handleChange}
            required
            size="small"
            fullWidth
            InputLabelProps={{ sx: { fontSize: '0.75rem', mb: 0.5 } }}
          />

          <TextField
            label="Keperluan"
            name="sumber"
            value={form.sumber}
            onChange={handleChange}
            required
            fullWidth
            multiline
            rows={2}
            size="small"
            InputLabelProps={{ sx: { fontSize: '0.75rem', mb: 0.5 } }}
          />
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
            bgcolor: '#dc2626',
            fontSize: '0.8rem',
            '&:hover': { bgcolor: '#b91c1c' }
          }}
        >
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Pengeluaran;
