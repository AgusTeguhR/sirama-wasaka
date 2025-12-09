/* eslint-disable */
import React, { useRef, useState } from 'react';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  TableContainer,
  Paper,
  Container
} from '@mui/material';
import { FiFileText, FiDownload, FiChevronDown, FiPlus } from 'react-icons/fi';

import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';

import Grafik from './Grafik';
import Pemasukan from './Pemasukan';
import Pengeluaran from './Pengeluaran';

// jika Anda punya komponen export serupa di daftar surat, import di sini
// import ExportExcelButton from 'component/Reporting/ExportKeuangan';

const KeuanganPage = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const dropdownRef = useRef(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      <Breadcrumb title="Keuangan">
        <Typography component="span" variant="subtitle2" color="inherit" className="link-breadcrumb">
          SIRAMA
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Keuangan
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Keuangan
                </Typography>
              }
            />
            <Divider />
            <CardContent>
              {/* aksi atas: dropdown + export | tombol tambah di kanan */}
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  {/* Tombol tampil sama persis, tapi tidak memicu dropdown */}
                  <Button
                    // ref dan onClick dropdown dihapus, diganti noop supaya tampilan tetap
                    startIcon={<FiFileText />}
                    variant="outlined"
                    sx={{ textTransform: 'none' }}
                    onClick={() => {
                      /* kosong: tidak membuka dropdown */
                    }}
                  >
                    Data Keuangan
                  </Button>

                  {/* (Optional) tombol Export — aktifkan bila memang diperlukan */}
                  {/* <Button
      size="small"
      startIcon={<FiDownload />}
      sx={{ textTransform: 'none', ml: 1 }}
      onClick={handleExport}
    >
      Export
    </Button> */}
                </Box>
              </Box>

              {/* GRAFIK: full width (di dalam card utama) */}
              <Box sx={{ width: '100%', mb: 3 }}>
                <Grafik />
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* DUA KOLOM: kiri = Pemasukan, kanan = Pengeluaran */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardHeader
                      title={<Typography sx={{ fontWeight: 600 }}>Tabel Pemasukan</Typography>}
                      sx={{ pb: 0, pt: 1 }}
                      action={
                        <Button size="small" startIcon={<FiDownload />} sx={{ textTransform: 'none' }}>
                          Export
                        </Button>
                      }
                    />
                    <CardContent sx={{ pt: 1 }}>
                      <Box sx={{ width: '100%', overflowX: 'auto' }}>
                        {/* Jika Pemasukan sudah berisi TableContainer, ia akan mengisi area ini */}
                        <Pemasukan />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardHeader
                      title={<Typography sx={{ fontWeight: 600 }}>Tabel Pengeluaran</Typography>}
                      sx={{ pb: 0, pt: 1 }}
                      action={
                        <Button size="small" startIcon={<FiDownload />} sx={{ textTransform: 'none' }}>
                          Export
                        </Button>
                      }
                    />
                    <CardContent sx={{ pt: 1 }}>
                      <Box sx={{ width: '100%', overflowX: 'auto' }}>
                        <Pengeluaran />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default KeuanganPage;
