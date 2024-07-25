import { Box, Button, Container, Grid, Paper, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import { useEffect, useRef } from 'react';
// eslint-disable-next-line no-restricted-imports
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useSelector } from 'react-redux';
import ImagePreview from '../../../components/ImagePreview/ImagePreview';
// import { deleteImageService } from '../../redux/APIs/ImageUpload';
import { useSearchParams } from 'react-router-dom';
import Loader from '../../../components/notification/Loader';
import { getProfileAction } from '../../../redux/actions/userActions';
import { AppDispatch, RootState, useAppDispatch } from '../../../redux/store';
import BlockIcon from '@mui/icons-material/Block';
import './style.scss';
import dayjs from 'dayjs';

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#321357'
    },
    secondary: {
      main: '#f2f2f2'
    }
  }
});

function AboutProfileUser() {
  const dispatch: AppDispatch = useAppDispatch();
  const initialized = useRef(false);

  const { isLoading, userInfo } = useSelector((state: RootState) => state.userGetProfile);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [searchParams] = useSearchParams();
  const profileID = searchParams.get('profileID')

  // useEffect
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const fetchUserInfo = async () => {
        if (profileID) {
          dispatch(getProfileAction(profileID));
        }
      };

      fetchUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        sx={{
          minHeight: '120vh',
          padding: '32px 0',
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
              marginBottom: 4
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
               Thông tin người dùng
            </Typography>
            {isLoading ? (
              <Loader />
            ) : (
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} container alignItems="center" justifyContent="center">
                        <Box display="flex" justifyContent="center" alignItems="center" width="100%">
                            <ImagePreview image={userInfo?.avatar} name={userInfo?.firstName ? userInfo?.firstName : userInfo?.email} isAboutProfile />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sx={{ width: '100%', mt: 1, flexDirection:'column', justifyContent:'center', alignItems: 'center'}}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        width: '100%' 
                      }}
                    >
                        <TextField 
                          sx={{flexGrow: 1}}
                          id="email" 
                          label="Địa chỉ email" 
                          name="email"  
                          value={userInfo?.email || ''}
                          InputProps={{
                              readOnly: true,
                          }}
                        />
                    </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            //   name="firstName"
                            fullWidth
                            autoFocus
                            id="firstName"
                            label="Họ"
                            value={userInfo?.firstName || ''}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                        fullWidth
                        id="lastName"
                        label="Tên"
                        //   name="lastName"
                        value={userInfo?.lastName || ''}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                        <TextField
                            fullWidth
                            id="phone"
                            label="Số điện thoại"
                            value={userInfo?.phoneNumber || ''}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                sx={{ width: '100%' }}
                                label="Ngày sinh"
                                value={userInfo?.dob ? dayjs(userInfo?.dob) : null}
                                onChange={() => {}}
                                slots={{
                                    // eslint-disable-next-line react/no-unstable-nested-components
                                    textField: (params: any) => (
                                    <TextField
                                        {...params}
                                        InputProps={{
                                        ...params.InputProps,
                                        readOnly: true,
                                        }}
                                    />
                                    ),
                                }}
                                disableOpenPicker
                            />
                        </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <TextField
                            fullWidth
                            id="address"
                            label="Địa chỉ"
                            //   name="address"
                            value={userInfo?.address || ''}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>
                </Grid>
                <Button
                    sx={{
                      mt: 3, mb: 2,
                      py: 1.8
                    }}
                    color='error'
                    fullWidth
                    variant='contained' endIcon={<BlockIcon/>}>Cấm tài khoản</Button>
              </Box>
            )}
          </Box>
        </Container>
      </Grid>
    </ThemeProvider>
  );
}

export default AboutProfileUser;
