
import React, { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { ThemeProvider, createTheme } from '@mui/material';
import {  useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FiLogIn } from 'react-icons/fi';
import { LoginValidation } from '../../../validation/userValidation';
import './style.scss';
import { AppDispatch, RootState, useAppDispatch } from '../../../redux/store';
import { loginAction } from '../../../redux/actions/authActions';
import ReTreasure_BackGround from '../../../assets/Retreasure_Icon.svg';


const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#466874'
    },
    secondary: {
      main: '#f2f2f2'
    }
  }
})

type UserLoginSubmitForm = {
  email: string;
  password: string;
};

interface Props {
  rememberMe: boolean;
  setRememberMe: (value: any) => void;
}

function Login(props: Props) {
  const { rememberMe, setRememberMe } = props;

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: { preventDefault: () => void }) => {
    event.preventDefault();
  };

  const dispatch: AppDispatch = useAppDispatch();
  const navigate = useNavigate()


  const { isLoading, isError, userInfo, isSuccess } = useSelector(
    (state: RootState) => state.userLogin
  );
  
  // Validate user
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<UserLoginSubmitForm>({ resolver: yupResolver(LoginValidation) });

  // On submit
  const onSubmit = (data: any) => {
    dispatch(loginAction(data))
    if (rememberMe) {
      localStorage.setItem('rememberedCheck', rememberMe ? 'true' : 'false');
      localStorage.setItem('rememberedCredentials', JSON.stringify({ email: data.email, password: data.password }));
    } else {
      localStorage.removeItem('rememberedCredentials');
    }
  };

  const handleRememberMeChange = () => {
    setRememberMe((prevRememberMe: any) => !prevRememberMe);
  };

  useEffect(() => {
    const rememberedCheck = localStorage.getItem('rememberedCheck');

    const rememberedCredentialsString: string | null = localStorage.getItem('rememberedCredentials');
    const rememberedCredentials = rememberedCredentialsString ? JSON.parse(rememberedCredentialsString) : null;

    if (rememberMe) {
      setRememberMe(rememberedCheck === 'true');
      setValue('email', rememberedCredentials.email);
      setValue('password', rememberedCredentials.password);
    }
  }, []);

  useEffect(() => {
      if (userInfo) {
        if (userInfo?.roleID === 3) {
            navigate('/statistic')
        } else {
            navigate('/')
        }
      }

      if (isError) {
        toast.error(isError)
        dispatch({ type: 'USER_LOGIN_RESET' })
      }
  }, [userInfo, isSuccess, isError, navigate, dispatch])

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh', overflow: 'hidden' }}>
        <Grid
          item
          xs={false}
          sm={false}
          md={7}
          sx={{
            backgroundImage: `url(${ReTreasure_BackGround})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            textAlign: 'center',
            alignItems: 'center',
            display: { xs: 'none', md: 'inline-flex', sm: 'none' }
          }}
        />
        <Grid
          item
          xs={12}
          sm={12}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <Typography
              component="h1"
              variant="h5"
              sx={{
                fontSize: '60px',
                fontWeight: 'bold',
                color: 'primary.main'
              }}
            >
              Đăng nhập
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                autoComplete="email"
                autoFocus
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message || ''}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Mật khẩu"
                id="password"
                autoComplete="current-password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message || ''}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Grid container sx={{ justifyContent: 'flex-end' }}>
                <Grid item>
                  <Link component={RouterLink} to="/forgot-password" variant="body2">
                    Quên mật khẩu?
                  </Link>
                </Grid>
              </Grid>
              <Grid item xs sx={{ textAlign: 'right' }}>
                <Link href="/user/forgot" variant="body2" />
              </Grid>
              <FormControlLabel
                control={<Checkbox onChange={handleRememberMeChange} checked={rememberMe} value="remember" color="primary" />}
                label="Ghi nhớ đăng nhập"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, p: 2 }}
                disabled={isLoading}
              >
                {isLoading ? (
                      'Đang tải...'
                  ) : (
                <>
                  <FiLogIn />
                  <span style={{ marginLeft: '4px' }}>Đăng nhập</span>
                </>
              )} 
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default Login;
