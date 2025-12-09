import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Tooltip
} from '@mui/material';

import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';

import { FiFileText, FiEdit2, FiTrash2, FiDownload, FiFilePlus, FiChevronDown } from 'react-icons/fi';
import Swal from 'sweetalert2';

import { getAllSuratMasuk, deleteSuratMasuk } from '../../services/AdministrasiAPI';
import ExportExcelButton from 'component/Reporting/ExportSuratMasuk';
import ModalSuratMasuk from 'component/Modal/SuratMasuk';
import Pagination from 'component/Umum/Pagination';

const SuratMasuk = () => {
  const [surat, setSurat] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const rowsPerPage = 3;

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchSurat();
    console.log('Total Surat:', surat.length);
    console.log('Total Halaman:', totalPages);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSurat = async () => {
    try {
      const res = await getAllSuratMasuk();
      setSurat(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (error) {
      console.error('Gagal mengambil data surat:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Tidak dapat memuat data surat!',
        timer: 1800,
        showConfirmButton: false
      });
    }
  };

  const handleDelete = async (id_surat) => {
    Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: 'Data yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#dc2626',
      customClass: {
        popup: 'small-alert'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSuratMasuk(id_surat);
          Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Data surat berhasil dihapus!',
            timer: 1500,
            showConfirmButton: false,
            customClass: {
              popup: 'small-alert'
            }
          });
          fetchSurat();
        } catch (error) {
          console.error('Gagal menghapus surat:', error);
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Terjadi kesalahan saat menghapus data!',
            customClass: {
              popup: 'small-alert'
            }
          });
        }
      }
    });
  };

  const handleEdit = (row) => {
    setEditData(row);
    setIsModalOpen(true);
  };

  const totalPages = Math.ceil(surat.length / rowsPerPage);
  const currentRows = surat.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const changePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleNavigate = (value) => {
    if (value === 'surat-keluar') navigate('/surat-keluar');
    handleMenuClose();
  };

  return (
    <>
      <Breadcrumb title="Arsip Surat">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          SIRAMA
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Administrasi Asrama
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Typography component="div" variant="h6" sx={{ fontWeight: 700 }}>
                  Data Surat Masuk
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
                    startIcon={<FiFileText />}
                    endIcon={<FiChevronDown />}
                    variant="outlined"
                    sx={{ textTransform: 'none' }}
                  >
                    Data Surat Masuk
                  </Button>

                  <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
                    <MenuItem disabled>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        📥 Data Surat Masuk
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigate('surat-keluar')}>📤 Data Surat Keluar</MenuItem>
                  </Menu>

                  <ExportExcelButton data={surat} fileName="Data_Surat_Masuk" />
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<FiFilePlus />}
                  onClick={() => {
                    setEditData(null);
                    setIsModalOpen(true);
                  }}
                  sx={{ textTransform: 'none' }}
                >
                  Surat Masuk
                </Button>
              </Box>

              <Typography variant="body2" color="text.secondary" mb={2}>
                Daftar arsip surat masuk. Klik ikon untuk melihat file, edit, atau hapus. Gunakan tombol Surat Masuk untuk menambah data
                baru.
              </Typography>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#e6f0ff' }}>
                      <TableCell align="center" sx={{ width: 120 }}>
                        Tanggal
                      </TableCell>
                      <TableCell align="center" sx={{ width: 180 }}>
                        Nomor Surat
                      </TableCell>
                      <TableCell align="center" sx={{ width: 200 }}>
                        Asal Surat
                      </TableCell>
                      <TableCell align="center" sx={{ width: 300 }}>
                        Perihal
                      </TableCell>
                      <TableCell align="center" sx={{ width: 150 }}>
                        Aksi
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {Array.isArray(currentRows) && currentRows.length > 0 ? (
                      currentRows.map((row, index) => (
                        <TableRowSurat key={row.id_surat ?? index} data={row} order={index} onDelete={handleDelete} onEdit={handleEdit} />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary', fontStyle: 'italic' }}>
                          Tidak ada data surat masuk
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box mt={0} display="flex" justifyContent="center">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage} />
              </Box>

              {isModalOpen && (
                <ModalSuratMasuk
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onSuccess={() => {
                    setIsModalOpen(false);
                    fetchSurat();
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

const TableRowSurat = ({ data, order, onEdit, onDelete }) => {
  const { id_surat, no_surat, asal, tanggal, perihal, file } = data || {};

  const formatTanggal = tanggal
    ? new Date(tanggal).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : '-';

  return (
    <TableRow hover sx={{ backgroundColor: order % 2 ? 'background.paper' : 'white' }}>
      <TableCell align="center" sx={{ py: 1 }}>
        {formatTanggal}
      </TableCell>
      <TableCell align="center" sx={{ py: 1, fontWeight: 600 }}>
        {no_surat || '-'}
      </TableCell>
      <TableCell align="center" sx={{ py: 1 }}>
        {asal || '-'}
      </TableCell>
      <TableCell sx={{ py: 1, maxWidth: 420 }}>
        <Typography noWrap title={perihal || ''}>
          {perihal || '-'}
        </Typography>
      </TableCell>
      <TableCell align="center" sx={{ py: 1 }}>
        <Box display="flex" justifyContent="center" gap={1}>
          <Tooltip title={file ? 'Lihat File' : 'Tidak ada file'}>
            <span>
              <IconButton
                size="small"
                onClick={() => file && window.open(`http://localhost:4000/doc/${file}`, '_blank')}
                disabled={!file}
                sx={{
                  bgcolor: file ? 'rgba(34,197,94,0.12)' : 'transparent',
                  color: file ? 'success.main' : 'text.disabled',
                  '&:hover': file ? { bgcolor: 'success.main', color: 'common.white' } : {}
                }}
              >
                <FiDownload />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => onEdit(data)}
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
              onClick={() => onDelete(id_surat)}
              sx={{
                bgcolor: 'rgba(239,68,68,0.12)',
                color: 'error.main',
                '&:hover': { bgcolor: 'error.main', color: 'common.white' }
              }}
            >
              <FiTrash2 />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default SuratMasuk;
