import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, IconButton, Typography } from '@mui/material';

// project import
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import { drawerWidth } from 'config.js';

// assets
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import logo from 'assets/images/Logo Asrama.png';

// ==============================|| HEADER ||============================== //

const Header = ({ drawerToggle }) => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          width: drawerWidth,
          zIndex: 1201,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Box
              mt={0.5}
              sx={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                width: '225px' // disesuaikan agar pas di header
              }}
            >
              {/* Logo */}
              <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                <img
                  src={logo}
                  alt="Logo"
                  style={{
                    height: '38px',
                    width: 'auto',
                    marginRight: '10px'
                  }}
                />
              </Box>

              {/* Marquee Container */}
              <Box
                sx={{
                  position: 'relative',
                  flex: 1,
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    animation: 'marquee 10s linear infinite',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {/* Dua teks untuk loop tanpa jeda */}
                  {[...Array(2)].map((_, i) => (
                    <Typography
                      key={i}
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        color: '#fff',
                        fontSize: '1.1rem',
                        letterSpacing: 1,
                        paddingRight: '50px' // jarak antar teks
                      }}
                    >
                      SISTEM INFORMASI ASRAMA MAHASISWA LAMBUNG MANGKURAT WASAKA-1
                    </Typography>
                  ))}
                </Box>
              </Box>

              {/* Animasi marquee halus */}
              <style>
                {`
                  @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                `}
              </style>
            </Box>
          </Grid>

          {/* Tombol toggle drawer */}
          <Grid item>
            <IconButton
              edge="start"
              sx={{ mr: theme.spacing(2) }}
              color="inherit"
              aria-label="open drawer"
              onClick={drawerToggle}
              size="large"
            >
              <MenuTwoToneIcon sx={{ fontSize: '1.5rem' }} />
            </IconButton>
          </Grid>
        </Grid>
      </Box>

      {/* Bagian kanan header */}
      <Box sx={{ flexGrow: 1 }} />
      <SearchSection theme="light" />
      <NotificationSection />
      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  drawerToggle: PropTypes.func
};

export default Header;
