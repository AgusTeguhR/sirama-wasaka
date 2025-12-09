import React, { useState, useEffect, useRef } from 'react';
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
  Tooltip,
  Menu,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper
} from '@mui/material';

import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';

import Swal from 'sweetalert2';
import { FiEdit2, FiTrash2, FiUserPlus, FiChevronDown, FiPrinter } from 'react-icons/fi';

import { getAll, erase } from '../../services/TagihanAPI';
import Modal from './Modal';
import ExportTagihan from 'component/Reporting/ExportTagihan';
import Pagination from 'component/Umum/Pagination';

const Tagihan = () => {
  const [tagihan, setTagihan] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const rowsPerPage = 5;

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchTagihan();
  }, []);

  const fetchTagihan = async () => {
    try {
      const res = await getAll();
      setTagihan(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (error) {
      console.error('Gagal fetch data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Tidak dapat memuat data tagihan!',
        timer: 1800,
        showConfirmButton: false
      });
    }
  };

  const handleDelete = (id) => {
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
          await erase(id);
          Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Tagihan berhasil dihapus!',
            timer: 1500,
            showConfirmButton: false
          });
          fetchTagihan();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Terjadi kesalahan saat menghapus data!'
          });
        }
      }
    });
  };

  const totalPages = Math.ceil(tagihan.length / rowsPerPage);
  const currentRows = tagihan.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const changePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      <Breadcrumb title="Data Tagihan">
        <Typography variant="subtitle2" color="inherit" className="link-breadcrumb">
          SIRAMA
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Tagihan Penghuni
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Tagihan Penghuni Asrama
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
                    startIcon={<FiPrinter />}
                    endIcon={<FiChevronDown />}
                    variant="outlined"
                    sx={{ textTransform: 'none' }}
                  >
                    Export
                  </Button>

                  <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
                    <MenuItem
                      onClick={() => {
                        ExportTagihan(tagihan);
                        handleMenuClose();
                      }}
                    >
                      📄 Export PDF
                    </MenuItem>
                  </Menu>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<FiUserPlus />}
                  sx={{ textTransform: 'none' }}
                  onClick={() => {
                    setEditData(null);
                    setOpenModal(true);
                  }}
                >
                  Tambah Tagihan
                </Button>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#e6f0ff' }}>
                      <TableCell align="center">Periode</TableCell>
                      <TableCell align="center">Penghuni</TableCell>
                      <TableCell align="center">Kamar</TableCell>
                      <TableCell align="center">Jumlah</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Jatuh Tempo</TableCell>
                      <TableCell align="center">Aksi</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {Array.isArray(currentRows) && currentRows.length > 0 ? (
                      currentRows.map((row, index) => (
                        <TableRowTagihan
                          key={row.id_tagihan}
                          data={row}
                          order={index}
                          onEdit={(data) => {
                            setEditData(data);
                            setOpenModal(true);
                          }}
                          onDelete={handleDelete}
                        />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4, fontStyle: 'italic', color: 'text.secondary' }}>
                          Tidak ada Tagihan
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box mt={0} display="flex" justifyContent="center">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage} />
              </Box>

              {openModal && (
                <Modal
                  isOpen={openModal}
                  onClose={() => setOpenModal(false)}
                  onSuccess={() => {
                    setOpenModal(false);
                    fetchTagihan();
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

const TableRowTagihan = ({ data, order, onEdit, onDelete }) => {
  const { id_tagihan, periode, nama_penghuni, id_kamar, jumlah, status, jatuh_tempo } = data;

  const formatPeriode = (periodeStr) => {
    if (!periodeStr) return '-';
    const [year, month] = periodeStr.split('-');
    const date = new Date(`${year}-${month}-01`);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  const formatTanggal = jatuh_tempo
    ? new Date(jatuh_tempo).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
    : '-';

  return (
    <TableRow hover sx={{ backgroundColor: order % 2 ? 'background.paper' : 'white' }}>
      <TableCell align="center">{formatPeriode(periode)}</TableCell>
      <TableCell align="center">{nama_penghuni}</TableCell>
      <TableCell align="center">{id_kamar}</TableCell>
      <TableCell align="center">Rp {Number(jumlah).toLocaleString('id-ID')}</TableCell>

      <TableCell align="center">
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: status?.toLowerCase() === 'lunas' ? '#dcfce7' : '#fee2e2',
            color: status?.toLowerCase() === 'lunas' ? '#15803d' : '#b91c1c'
          }}
        >
          {status}
        </span>
      </TableCell>

      <TableCell align="center">{formatTanggal}</TableCell>

      <TableCell align="center">
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
              onClick={() => onDelete(id_tagihan)}
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

export default Tagihan;
