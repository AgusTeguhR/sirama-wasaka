import React, { useEffect, useState } from 'react';
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
import { FiEdit2, FiTrash2, FiExternalLink, FiFilePlus } from 'react-icons/fi';
import Swal from 'sweetalert2';

import { getAllArsip, deleteArsip } from '../../services/ArsipAPI';
import ModalArsip from 'component/Modal/Arsip';
import Pagination from 'component/Umum/Pagination';

const ArsipKegiatan = () => {
  const [arsip, setArsip] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchArsip();
  }, []);

  const fetchArsip = async () => {
    try {
      const res = await getAllArsip();
      setArsip(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (error) {
      console.error('Gagal mengambil data arsip:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Tidak dapat memuat data arsip kegiatan!',
        timer: 1800,
        showConfirmButton: false
      });
    }
  };

  const handleDelete = async (id_arsip) => {
    Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: 'Data yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#dc2626',
      customClass: { popup: 'small-alert' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteArsip(id_arsip);
          Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Data arsip berhasil dihapus!',
            timer: 1500,
            showConfirmButton: false
          });
          fetchArsip();
        } catch (error) {
          console.error('Gagal menghapus arsip:', error);
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Terjadi kesalahan saat menghapus data!'
          });
        }
      }
    });
  };

  const handleEdit = (row) => {
    setEditData(row);
    setIsModalOpen(true);
  };

  const totalPages = Math.ceil(arsip.length / rowsPerPage);
  const currentRows = arsip.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const changePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <Breadcrumb title="Arsip Kegiatan">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          SIRAMA
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Arsip Kegiatan
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Typography component="div" variant="h6" sx={{ fontWeight: 700 }}>
                  Arsip Kegiatan Asrama
                </Typography>
              }
            />
            <Divider />
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Daftar kegiatan yang telah diarsipkan. Klik ikon untuk membuka tautan, edit, atau hapus data.
                </Typography>
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
                  Tambah Arsip
                </Button>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#e6f0ff' }}>
                      <TableCell align="center" sx={{ width: 120 }}>
                        Tanggal
                      </TableCell>
                      <TableCell align="center" sx={{ width: 250 }}>
                        Acara
                      </TableCell>
                      <TableCell align="center" sx={{ width: 250 }}>
                        Tautan
                      </TableCell>
                      <TableCell align="center" sx={{ width: 150 }}>
                        Aksi
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(currentRows) && currentRows.length > 0 ? (
                      currentRows.map((row, index) => (
                        <TableRowArsip key={row.id_arsip ?? index} data={row} order={index} onDelete={handleDelete} onEdit={handleEdit} />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary', fontStyle: 'italic' }}>
                          Tidak ada data arsip
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
                <ModalArsip
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onSuccess={() => {
                    setIsModalOpen(false);
                    fetchArsip();
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

const TableRowArsip = ({ data, order, onEdit, onDelete }) => {
  const { id_arsip, acara, tgl, link } = data || {};
  const formatTanggal = tgl
    ? new Date(tgl).toLocaleDateString('id-ID', {
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
        {acara || '-'}
      </TableCell>
      <TableCell align="center" sx={{ py: 1 }}>
        {link ? (
          <Button
            size="small"
            variant="outlined"
            startIcon={<FiExternalLink />}
            onClick={() => window.open(link, '_blank')}
            sx={{ textTransform: 'none' }}
          >
            Buka Tautan
          </Button>
        ) : (
          <Typography color="text.secondary" fontStyle="italic">
            Tidak ada link
          </Typography>
        )}
      </TableCell>
      <TableCell align="center" sx={{ py: 1 }}>
        <Box display="flex" justifyContent="center" gap={1}>
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
              onClick={() => onDelete(id_arsip)}
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

export default ArsipKegiatan;
