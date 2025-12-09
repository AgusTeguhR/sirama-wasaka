<<<<<<< HEAD
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { FiTrendingUp, FiPlus } from 'react-icons/fi';
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

import { getAllPemasukan, createPemasukan } from '../../services/KeuanganAPI';
import Pagination from 'component/Umum/Pagination'; // pastikan path ini konsisten di projectmu

const Pemasukan = () => {
  const [pemasukan, setPemasukan] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  useEffect(() => {
    fetchPemasukan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPemasukan = async () => {
    try {
      const res = await getAllPemasukan();
      // fallback aman jika struktur berbeda
      const data = res?.data?.data ?? res?.data ?? [];
      setPemasukan(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Gagal mengambil data pemasukan:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Tidak dapat memuat data pemasukan',
        timer: 1800,
        showConfirmButton: false,
        didOpen: () => {
          const c = document.querySelector('.swal2-container');
          if (c) c.style.zIndex = '2000';
        }
      });
    }
  };

  const handleSuccess = async () => {
    await fetchPemasukan();
    setIsModalOpen(false);
  };

  // ==== Pagination Logic ====
  const totalPages = Math.max(1, Math.ceil(pemasukan.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = pemasukan.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="col-span-6 p-6 rounded-xl border border-stone-300 shadow-sm bg-white">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1" fontWeight={600} display="flex" alignItems="center" gap={1} color="text.primary">
          <FiTrendingUp color="#16a34a" /> Pemasukan Asrama
        </Typography>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="contained"
          startIcon={<FiPlus />}
          sx={{
            bgcolor: '#16a34a',
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 500,
            '&:hover': { bgcolor: '#15803d' }
          }}
        >
          Tambah
        </Button>
      </Box>

      {/* TABEL */}
      <div className="overflow-x-auto">
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHeadPemasukan />
            <TableBody>
              {Array.isArray(paginatedData) && paginatedData.length > 0 ? (
                paginatedData.map((row) => <TableRowPemasukan key={row.id_pemasukan ?? row.id ?? Math.random()} data={row} />)
              ) : (
                <TableRowEmpty colSpan={3} />
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* PAGINATION TERPISAH */}
      <Box mt={3} display="flex" justifyContent="center">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </Box>

      {/* MODAL */}
      <ModalPemasukan isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleSuccess} />
    </div>
  );
};

// ================= Table Head =================
const TableHeadPemasukan = () => (
  <TableHead>
    <TableRow sx={{ backgroundColor: '#ecfdf5' }}>
      <TableCell align="center" sx={{ width: 140, fontWeight: 600 }}>
        Tanggal
      </TableCell>
      <TableCell align="left" sx={{ width: 360, fontWeight: 600 }}>
        Sumber Pemasukan
      </TableCell>
      <TableCell align="right" sx={{ width: 160, fontWeight: 600 }}>
        Jumlah (Rp)
      </TableCell>
    </TableRow>
  </TableHead>
);

// ================= Table Row =================
const TableRowPemasukan = ({ data }) => {
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
      Tidak ada data pemasukan
    </TableCell>
  </TableRow>
);

// ================= Modal Tambah Pemasukan (MUI Dialog) =================
const ModalPemasukan = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    periode: new Date().toISOString().split('T')[0],
    sumber: '',
    jumlah: ''
  });

  // reset saat buka/close
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
      // validasi sederhana
      if (!form.sumber.trim() || !form.jumlah) {
        Swal.fire({
          icon: 'warning',
          title: 'Oops!',
          text: 'Sumber dan jumlah wajib diisi!',
          confirmButtonText: 'OK',
          didOpen: () => {
            const c = document.querySelector('.swal2-container');
            if (c) c.style.zIndex = '2000';
          }
        });
        return;
      }

      // pastikan jumlah numeric
      const payload = {
        ...form,
        jumlah: Number(form.jumlah)
      };

      await createPemasukan(payload);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data pemasukan berhasil ditambahkan!',
        timer: 1500,
        showConfirmButton: false,
        didOpen: () => {
          const c = document.querySelector('.swal2-container');
          if (c) c.style.zIndex = '2000';
        }
      });

      if (onSuccess) await onSuccess();
      // form reset ditangani oleh useEffect ketika modal dibuka lagi
    } catch (error) {
      console.error('Gagal menambahkan pemasukan:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Terjadi kesalahan saat menambahkan data!',
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
        Tambah Data Pemasukan
      </DialogTitle>

      <DialogContent sx={{ mt: 1.5, p: 0 }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Tanggal"
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
            label="Sumber Pemasukan"
            name="sumber"
            value={form.sumber}
            onChange={handleChange}
            required
            size="small"
            fullWidth
            placeholder="Contoh: Iuran Bulanan, Donasi, dsb."
            InputLabelProps={{ sx: { fontSize: '0.75rem', mb: 0.5 } }}
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
            bgcolor: '#16a34a',
            fontSize: '0.8rem',
            '&:hover': { bgcolor: '#15803d' }
          }}
        >
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Pemasukan;
=======
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { FiTrendingUp, FiPlus } from 'react-icons/fi';
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

import { getAllPemasukan, createPemasukan } from '../../services/KeuanganAPI';
import Pagination from 'component/Umum/Pagination'; // pastikan path ini konsisten di projectmu

const Pemasukan = () => {
  const [pemasukan, setPemasukan] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  useEffect(() => {
    fetchPemasukan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPemasukan = async () => {
    try {
      const res = await getAllPemasukan();
      // fallback aman jika struktur berbeda
      const data = res?.data?.data ?? res?.data ?? [];
      setPemasukan(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Gagal mengambil data pemasukan:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Tidak dapat memuat data pemasukan',
        timer: 1800,
        showConfirmButton: false,
        didOpen: () => {
          const c = document.querySelector('.swal2-container');
          if (c) c.style.zIndex = '2000';
        }
      });
    }
  };

  const handleSuccess = async () => {
    await fetchPemasukan();
    setIsModalOpen(false);
  };

  // ==== Pagination Logic ====
  const totalPages = Math.max(1, Math.ceil(pemasukan.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = pemasukan.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="col-span-6 p-6 rounded-xl border border-stone-300 shadow-sm bg-white">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1" fontWeight={600} display="flex" alignItems="center" gap={1} color="text.primary">
          <FiTrendingUp color="#16a34a" /> Pemasukan Asrama
        </Typography>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="contained"
          startIcon={<FiPlus />}
          sx={{
            bgcolor: '#16a34a',
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 500,
            '&:hover': { bgcolor: '#15803d' }
          }}
        >
          Tambah
        </Button>
      </Box>

      {/* TABEL */}
      <div className="overflow-x-auto">
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHeadPemasukan />
            <TableBody>
              {Array.isArray(paginatedData) && paginatedData.length > 0 ? (
                paginatedData.map((row) => <TableRowPemasukan key={row.id_pemasukan ?? row.id ?? Math.random()} data={row} />)
              ) : (
                <TableRowEmpty colSpan={3} />
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* PAGINATION TERPISAH */}
      <Box mt={3} display="flex" justifyContent="center">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </Box>

      {/* MODAL */}
      <ModalPemasukan isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleSuccess} />
    </div>
  );
};

// ================= Table Head =================
const TableHeadPemasukan = () => (
  <TableHead>
    <TableRow sx={{ backgroundColor: '#ecfdf5' }}>
      <TableCell align="center" sx={{ width: 140, fontWeight: 600 }}>
        Tanggal
      </TableCell>
      <TableCell align="left" sx={{ width: 360, fontWeight: 600 }}>
        Sumber Pemasukan
      </TableCell>
      <TableCell align="right" sx={{ width: 160, fontWeight: 600 }}>
        Jumlah (Rp)
      </TableCell>
    </TableRow>
  </TableHead>
);

// ================= Table Row =================
const TableRowPemasukan = ({ data }) => {
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
      Tidak ada data pemasukan
    </TableCell>
  </TableRow>
);

// ================= Modal Tambah Pemasukan (MUI Dialog) =================
const ModalPemasukan = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    periode: new Date().toISOString().split('T')[0],
    sumber: '',
    jumlah: ''
  });

  // reset saat buka/close
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
      // validasi sederhana
      if (!form.sumber.trim() || !form.jumlah) {
        Swal.fire({
          icon: 'warning',
          title: 'Oops!',
          text: 'Sumber dan jumlah wajib diisi!',
          confirmButtonText: 'OK',
          didOpen: () => {
            const c = document.querySelector('.swal2-container');
            if (c) c.style.zIndex = '2000';
          }
        });
        return;
      }

      // pastikan jumlah numeric
      const payload = {
        ...form,
        jumlah: Number(form.jumlah)
      };

      await createPemasukan(payload);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data pemasukan berhasil ditambahkan!',
        timer: 1500,
        showConfirmButton: false,
        didOpen: () => {
          const c = document.querySelector('.swal2-container');
          if (c) c.style.zIndex = '2000';
        }
      });

      if (onSuccess) await onSuccess();
      // form reset ditangani oleh useEffect ketika modal dibuka lagi
    } catch (error) {
      console.error('Gagal menambahkan pemasukan:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Terjadi kesalahan saat menambahkan data!',
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
        Tambah Data Pemasukan
      </DialogTitle>

      <DialogContent sx={{ mt: 1.5, p: 0 }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Tanggal"
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
            label="Sumber Pemasukan"
            name="sumber"
            value={form.sumber}
            onChange={handleChange}
            required
            size="small"
            fullWidth
            placeholder="Contoh: Iuran Bulanan, Donasi, dsb."
            InputLabelProps={{ sx: { fontSize: '0.75rem', mb: 0.5 } }}
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
            bgcolor: '#16a34a',
            fontSize: '0.8rem',
            '&:hover': { bgcolor: '#15803d' }
          }}
        >
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Pemasukan;
>>>>>>> 02b36bfd101b72d785f910fe958186a012e6cc54
