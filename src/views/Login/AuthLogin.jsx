import React, { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormHelperText, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';

import * as Yup from 'yup';
import { Formik } from 'formik';

import Swal from 'sweetalert2';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { loginUser } from '../../services/UserAPI';

// React Router DOM
import { useNavigate } from 'react-router-dom';

const AuthLogin = ({ ...rest }) => {
  const theme = useTheme();
  const navigate = useNavigate(); // <--- gunakan react router dom

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  useEffect(() => {
    alert('Ini adalah versi prototype dari projek saya \nSilakan login:\nusername: agustr\npassword: agustr');
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          nama: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          nama: Yup.string().required('Nama wajib diisi'),
          password: Yup.string().required('Password wajib diisi')
        })}
        onSubmit={async (values, { setErrors, setSubmitting }) => {
          try {
            const res = await loginUser(values.nama, values.password);

            // Jika berhasil
            Swal.fire({
              icon: 'success',
              title: 'Berhasil Login',
              text: 'Selamat datang kembali!',
              timer: 1500,
              showConfirmButton: false,
              customClass: {
                popup: 'small-alert',
                confirmButton: 'btn-confirm-red',
                cancelButton: 'btn-cancel'
              }
            });

            // Simpan user info (optional)
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // Redirect gunakan react router dom
            setTimeout(() => {
              navigate('/dashboard');
            }, 1500);
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Login Gagal',
              text: error.response?.data?.message || 'Nama atau password salah',
              customClass: {
                popup: 'small-alert',
                confirmButton: 'btn-confirm-red',
                cancelButton: 'btn-cancel'
              }
            });

            setErrors({
              submit: error.response?.data?.message || 'Login gagal'
            });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...rest}>
            {/* Nama */}
            <TextField
              error={Boolean(touched.nama && errors.nama)}
              fullWidth
              helperText={touched.nama && errors.nama}
              label="Nama"
              margin="normal"
              name="nama"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={values.nama}
              variant="outlined"
            />

            {/* Password */}
            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ mt: theme.spacing(3), mb: theme.spacing(1) }}>
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end" size="large">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />

              {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
            </FormControl>

            {/* Error Submit */}
            {errors.submit && (
              <Box mt={3}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            {/* Tombol Login */}
            <Box mt={2}>
              <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                Masuk
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
