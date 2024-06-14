/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';
import { Button, Box, Container, Grid, Paper, TextField, Typography, ThemeProvider, createTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { ForgotPasswordValidation } from '../../../validation/userValidation';
import './style.scss';
import { forgotPasswordService } from '../../../redux/services/authServices';

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#466874'
    },
    secondary: {
      main: '#f2f2f2'
    }
  }
});

function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');

  // Validate user
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(ForgotPasswordValidation) });

  useEffect(() => {
    if (err) {
      toast.error(err);
      setErr('');
    }

    if (success) {
      toast.success(success);
      setSuccess('');
    }

    setIsLoading(false);
  }, [err, success]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
        const res: any = await forgotPasswordService(data.email)
        setSuccess(res.message)
    } catch (error: unknown) {
      console.log(error)
      if (error instanceof Error) {
        setErr(error.message)
      } else {
        // Đã xảy ra lỗi kết nối mạng. Vui lòng thử lại sau.
        setErr("Network Error")
      }
    } finally {
      setIsLoading(false); // Reset isLoading to false after success/error
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        sx={{
          height: '100vh',
          backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        maxWidth="xs"
      >
        <Container maxWidth="sm" sx={{ margin: 4 }} component={Paper} elevation={6}>
          <Box
            sx={{
              marginTop: 4,
              marginBottom: 4,
              textAlign: 'center'
            }}
          >
            <Typography
              component="h1"
              variant="h5"
              sx={{
                fontSize: '40px',
                fontWeight: 'bold',
                color: 'primary.main'
              }}
            >
              Quên mật khẩu
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    {...register('email')}
                    id="email"
                    label="Email"
                    name="email"
                    error={!!errors.email}
                    helperText={errors.email?.message || ''}
                  />
                </Grid>
              </Grid>
              <Button type="submit" fullWidth variant="contained" disabled={isLoading} sx={{ mt: 3, mb: 2, py: 1 }}>
                Quên mật khẩu
              </Button>
            </Box>
          </Box>
        </Container>
      </Grid>
    </ThemeProvider>
  );
}

export default ForgotPassword;
