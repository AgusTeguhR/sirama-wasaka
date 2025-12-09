import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Card, CardContent, CardActions, Typography, Button, Box, Avatar, Container } from '@mui/material';

// router
import { Link } from 'react-router-dom';

// icons
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

const Default = () => {
  const theme = useTheme();

  const menuCards = [
    { id: 'dashboard', title: 'Dashboard', url: '/dashboard', icon: HomeOutlinedIcon, description: 'Ringkasan dan daftar menu aplikasi' },
    {
      id: 'administrasi',
      title: 'Administrasi',
      url: '/surat-masuk',
      icon: FolderOutlinedIcon,
      description: 'Manajemen surat, arsip, dan file asrama'
    },
    {
      id: 'anggota',
      title: 'Anggota',
      url: '/anggota',
      icon: PeopleOutlinedIcon,
      description: 'Daftar anggota dan profil penghuni asrama'
    },
    { id: 'tagihan', title: 'Tagihan', url: '/tagihan', icon: CreditCardOutlinedIcon, description: 'Kelola tagihan dan pembayaran asrama' },
    { id: 'keuangan', title: 'Keuangan', url: '/keuangan', icon: BarChartOutlinedIcon, description: 'Laporan keuangan dan arus kas ' },
    {
      id: 'inventaris',
      title: 'Inventarisasi',
      url: '/inventaris',
      icon: Inventory2OutlinedIcon,
      description: 'Manajemen barang dan aset Asrama'
    }
  ];

  const topRow = menuCards.slice(0, 3);
  const bottomRow = menuCards.slice(3);

  const renderCard = (m) => {
    const IconComponent = m.icon;
    return (
      <Grid item xs={12} sm={6} md={4} key={m.id}>
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: 2,
            width: '100%'
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.light,
                  width: 48,
                  height: 48
                }}
              >
                {IconComponent && <IconComponent />}
              </Avatar>
              <Box>
                <Typography variant="subtitle1">{m.title}</Typography>
                {m.description && (
                  <Typography variant="caption" color="text.secondary">
                    {m.description}
                  </Typography>
                )}
              </Box>
            </Box>
          </CardContent>

          <CardActions sx={{ px: 2, pb: 2 }}>
            {/* 🔥 Navigasi SPA tanpa refresh */}
            <Button size="small" variant="contained" component={Link} to={m.url}>
              Buka Aplikasi
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  };

  return (
    <Container maxWidth="xl" disableGutters sx={{ p: 0 }}>
      <Box sx={{ height: { xs: 8, md: 0 } }} />

      <Grid container spacing={2}>
        {/* WELCOME CARD */}
        <Grid item xs={12}>
          <Card
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderRadius: 2,
              background: 'linear-gradient(160deg, #1E3A8A 10%, #60A5FA 50%, #ffffff 100%)',
              boxShadow: 1
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                Sistem Informasi Asrama Mahasiswa Lambung Mangkurat WASAKA-1
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.95)', mt: 0.5, maxWidth: 760 }}>
                Kelola surat, anggota, tagihan, keuangan, dan inventaris dengan mudah. Pilih modul di bawah untuk memulai.
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* TOP ROW */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {topRow.map(renderCard)}
          </Grid>
        </Grid>

        {/* BOTTOM ROW */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {bottomRow.map(renderCard)}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Default;
