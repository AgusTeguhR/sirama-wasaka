/* eslint-disable */
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Tooltip,
  TextField,
  InputAdornment
} from '@mui/material';
import { FiUser, FiEdit2, FiTrash2, FiInfo, FiUserPlus, FiSearch, FiChevronDown } from 'react-icons/fi';
import Swal from 'sweetalert2';

import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';

// services - sesuaikan path jika beda
import { getAll as getAllAnggota, erase as eraseAnggota } from '../../services/AnggotaAPI';

// Modal anggota: sesuaikan path jika komponen modal Anda ada di lokasi lain
import ModalAnggota from 'component/Modal/Anggota'; // <-- ubah path bila perlu
import Pagination from 'component/Umum/Pagination';

const DaftarAnggota = () => {
  const [anggota, setAnggota] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [query, setQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const dropdownRef = useRef(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    try {
      const res = await getAllAnggota();
      setAnggota(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error('Gagal fetch data anggota:', err);
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Tidak dapat memuat data penghuni.' });
    }
  };

  const filtered = useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    if (!q) return anggota;
    return anggota.filter((a) => {
      return (
        (a.nama || '').toLowerCase().includes(q) ||
        (a.kamar || '').toString().toLowerCase().includes(q) ||
        (a.prodi || '').toLowerCase().includes(q)
      );
    });
  }, [anggota, query]);

  // pagination derived values
  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
  const currentRows = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const changePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleDelete = async (id_penghuni) => {
    const item = anggota.find((it) => it.id_penghuni === id_penghuni);
    const nama = item ? item.nama : 'data ini';

    const result = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: `Data ${nama} akan dihapus secara permanen.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#dc2626',
      customClass: {
        popup: 'small-alert',
        confirmButton: 'btn-confirm-red',
        cancelButton: 'btn-cancel'
      }
    });

    if (result.isConfirmed) {
      try {
        await eraseAnggota(id_penghuni);
        await getData();
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data penghuni berhasil dihapus!',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'small-alert' }
        });
      } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Gagal', text: 'Terjadi kesalahan saat menghapus data!' });
      }
    }
  };

  const handleDetail = (row) => {
    Swal.fire({
      title: '',
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;gap:12px;font-size:14px">
          ${
            row.foto
              ? `<img src="http://localhost:4000/foto/${row.foto}" alt="${row.nama}" style="width:112px;height:128px;object-fit:cover;border-radius:6px;border:1px solid #e5e7eb"/>`
              : `<div style="width:112px;height:128px;display:flex;align-items:center;justify-content:center;background:#f3f4f6;color:#9ca3af;border-radius:6px;border:1px solid #e5e7eb">No Foto</div>`
          }
          <div style="font-weight:600">${row.nama}</div>
          <div style="width:100%;text-align:left;margin-top:6px;line-height:1.4">
            <p style="margin:2px 0"><b>Status:</b> ${row.status || '-'}</p>
            <p style="margin:2px 0"><b>No Kamar:</b> ${row.kamar || '-'}</p>
            <p style="margin:2px 0"><b>Prodi:</b> ${row.prodi || '-'}</p>
            <p style="margin:2px 0"><b>Fakultas:</b> ${row.fakultas || '-'}</p>
            <p style="margin:2px 0"><b>Asal:</b> ${row.asal || '-'}</p>
            <p style="margin:2px 0"><b>No HP:</b> ${row.no_hp || '-'}</p>
            <p style="margin:2px 0"><b>Tanggal Masuk:</b> ${row.tgl_masuk || '-'}</p>
          </div>
        </div>
      `,
      width: 420,
      padding: '12px',
      showConfirmButton: true,
      confirmButtonText: 'Tutup',
      backdrop: `rgba(0,0,0,0.4)`,
      customClass: { confirmButton: 'btn-confirm-gray' }
    });
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);
  const handleNavigate = (val) => {
    // contoh navigasi jika diperlukan, saat ini hanya menutup menu
    handleMenuClose();
  };

  return (
    <>
      <Breadcrumb title="Data Penghuni">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          SIRAMA
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Data Penghuni
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Typography component="div" variant="h6" sx={{ fontWeight: 700 }}>
                  Data Penghuni / Anggota
                </Typography>
              }
            />
            <Divider />
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Button
                    ref={dropdownRef}
                    onClick={handleMenuOpen}
                    startIcon={<FiUser />}
                    endIcon={<FiChevronDown />}
                    variant="outlined"
                    sx={{ textTransform: 'none' }}
                  >
                    Data Penghuni
                  </Button>

                  <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
                    <MenuItem disabled>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        📋 Pilihan Data
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigate('export')}>🔁 Export</MenuItem>
                    <MenuItem onClick={() => handleNavigate('import')}>⬆️ Import</MenuItem>
                  </Menu>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <TextField
                    size="small"
                    placeholder="Cari nama, kamar, prodi..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><FiSearch /></InputAdornment>
                    }}
                    sx={{ width: { xs: 160, sm: 240 } }}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FiUserPlus />}
                    onClick={() => {
                      setEditData(null);
                      setOpenModal(true);
                    }}
                    sx={{ textTransform: 'none' }}
                  >
                    Tambah Penghuni
                  </Button>
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" mb={2}>
                Daftar penghuni. Gunakan tombol Tambah Penghuni untuk menambah data baru, klik ikon Detail untuk melihat informasi lengkap.
              </Typography>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#e6f0ff' }}>
                      <TableCell>Nama</TableCell>
                      <TableCell align="center" sx={{ width: '18%' }}>Status</TableCell>
                      <TableCell align="center" sx={{ width: '12%' }}>No Kamar</TableCell>
                      <TableCell align="center" sx={{ width: '20%' }}>Prodi</TableCell>
                      <TableCell align="center" sx={{ width: '15%' }}>Aksi</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {Array.isArray(currentRows) && currentRows.length > 0 ? (
                      currentRows.map((row, index) => (
                        <AnggotaRow
                          key={row.id_penghuni ?? index}
                          row={row}
                          order={index}
                          onEdit={(r) => {
                            setEditData(r);
                            setOpenModal(true);
                          }}
                          onDelete={(id) => handleDelete(id)}
                          onDetail={(r) => handleDetail(r)}
                        />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary', fontStyle: 'italic' }}>
                          Tidak ada data penghuni
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box mt={1} display="flex" justifyContent="center">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage} />
              </Box>

              {openModal && (
                <ModalAnggota
                  isOpen={openModal}
                  onClose={() => {
                    setOpenModal(false);
                    setEditData(null);
                  }}
                  onSuccess={() => {
                    getData();
                    setOpenModal(false);
                    setEditData(null);
                  }}
                  editData={editData}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

const AnggotaRow = ({ row, order, onEdit, onDelete, onDetail }) => {
  const { id_penghuni, nama, status, kamar, prodi } = row || {};
  const statusClass = getStatusColor(status);

  return (
    <TableRow hover sx={{ backgroundColor: order % 2 ? 'background.paper' : 'white' }}>
      <TableCell sx={{ py: 1 }}>{nama || '-'}</TableCell>
      <TableCell align="center" sx={{ py: 1, color: statusClass.color }}>{status || '-'}</TableCell>
      <TableCell align="center" sx={{ py: 1 }}>{kamar || '-'}</TableCell>
      <TableCell align="center" sx={{ py: 1 }}>{prodi || '-'}</TableCell>
      <TableCell align="center" sx={{ py: 1 }}>
        <Box display="flex" justifyContent="center" gap={1}>
          <Tooltip title="Detail">
            <IconButton
              size="small"
              onClick={() => onDetail(row)}
              sx={{
                bgcolor: 'rgba(249,115,22,0.12)',
                color: 'warning.main',
                '&:hover': { bgcolor: 'warning.main', color: 'common.white' }
              }}
            >
              <FiInfo />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => onEdit(row)}
              sx={{
                bgcolor: 'rgba(59,130,246,0.12)',
                color: 'primary.main',
                '&:hover': { bgcolor: 'primary.main', color: 'common.white' }
              }}
            >
              <FiEdit2 />
            </IconButton>
          </Tooltip>

          <Tooltip title="Hapus">
            <IconButton
              size="small"
              onClick={() => onDelete(id_penghuni)}
              sx={{ bgcolor: 'rgba(239,68,68,0.12)', color: 'error.main', '&:hover': { bgcolor: 'error.main', color: 'common.white' } }}
            >
              <FiTrash2 />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};

const getStatusColor = (status) => {
  if (!status) return { color: 'text.secondary' };
  const s = String(status).toLowerCase();
  if (s.includes('aktif') || s.includes('lunas')) return { color: 'success.main' };
  if (s.includes('cuti') || s.includes('pending')) return { color: 'warning.main' };
  if (s.includes('keluar') || s.includes('nonaktif')) return { color: 'error.main' };
  return { color: 'text.primary' };
};

export default DaftarAnggota;
