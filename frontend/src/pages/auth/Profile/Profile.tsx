import React, { useEffect, useRef, useState } from 'react';
import { Button, Box, Container, Grid, Paper, TextField, Typography, ThemeProvider, createTheme, Modal } from '@mui/material';
import dayjs from 'dayjs';
// eslint-disable-next-line no-restricted-imports
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import ImagePreview from '../../../components/ImagePreview/ImagePreview';
import Uploader from '../../../components/Uploader/Uploader';
// import { deleteImageService } from '../../redux/APIs/ImageUpload';
import Loader from '../../../components/notification/Loader';
import { ProfileValidation } from '../../../validation/userValidation';
import './style.scss';
import { AppDispatch, RootState, useAppDispatch } from '../../../redux/store';
import { getProfileAction, updateProfileAction } from '../../../redux/actions/userActions';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapSelectAddress from '../../../components/Map/MapSelectAddress';
import { useSearchParams } from 'react-router-dom';

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

function Profile() {
  const [date, setDate] = useState<any>(null);
  const dispatch: AppDispatch = useAppDispatch();
  const initialized = useRef(false);

  const { isLoading, userInfo } = useSelector((state: RootState) => state.userGetProfile);
  const { userInfo: authInfo } = useSelector( (state: RootState) => state.userLogin);

  const [imageUrl, setImageUrl] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [imageUpdateUrl, setImageUpdateUrl] = useState('');

  const [location, setLocation] = useState<any>(null)
  
  const [searchParams] = useSearchParams();
  const profileID = searchParams.get('profileID')

  const {
    isLoading: updateLoading,
    isError: editError,
    userInfo: editUserInfo,
    isSuccess: editSuccess
  } = useSelector((state: RootState) => state.userUpdateProfile);

  // console.log(editUserInfo);
  // validate user
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(ProfileValidation)
  });

  // update profile
  const onSubmit = async (data: any) => {
    if (imageUpdateUrl !== imageUrl) {
    //   await deleteImageService(imageUpdateUrl);
    }
    dispatch(
      updateProfileAction({
        ...data,
        id: authInfo?.id,
        avatar: imageUrl,
        accessToken: authInfo?.accessToken,
        dob: date ? date.format('YYYY/MM/DD') : '',
      })
    );
  };

  // useEffect
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const fetchUserInfo = async () => {
        if (authInfo?.id) {
          dispatch(getProfileAction(authInfo.id));
        }
      };

      fetchUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userInfo) {
      setValue('firstName', userInfo?.firstName);
      setValue('lastName', userInfo?.lastName);
      setValue('email', userInfo?.email);
      setValue('phone', userInfo?.phoneNumber);
      if (userInfo?.dob !== '') {
        setDate(dayjs(userInfo?.dob));
      }
      if (userInfo?.avatar)  setImageUrl(userInfo?.avatar);
    }

    if (editUserInfo) {
      setValue('firstName', editUserInfo?.firstName);
      setValue('lastName', editUserInfo?.lastName);
      setValue('email', editUserInfo?.email);
      setValue('phone', editUserInfo?.phoneNumber);
      if (editUserInfo?.dob !== '') {
        setDate(dayjs(editUserInfo?.dob));
      }
      setImageUrl(editUserInfo?.avatar);
    }

    if (editSuccess) {
      // setImageUpdateUrl(editUserInfo?.avatar);
      dispatch({ type: 'USER_UPDATE_PROFILE_RESET' });
      dispatch({ type: 'USER_GET_PROFILE_RESET' });
    }
    if (editError) {
      toast.error(editError);
      dispatch({ type: 'USER_UPDATE_PROFILE_RESET' });
      dispatch({ type: 'USER_GET_PROFILE_RESET' });
    }
  }, [editUserInfo, setValue, editSuccess, editError, dispatch, userInfo]);

  useEffect(() => {
    if(location !== null){
        ///
    }
  }, [])

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '95%',
      height: '95%',
      bgcolor: 'background.paper',
      border: '2px solid #CAC9C8',
      boxShadow: '1px 1px 2px #CAC9C8',
  };


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
              Chỉnh sửa thông tin
            </Typography>
            {isLoading ? (
              <Loader />
            ) : (
              <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={9}>
                    <Uploader setImageUrl={setImageUrl} imageUrl={imageUrl} imageUpdateUrl={imageUpdateUrl}/>
                  </Grid>
                  {/* image preview */}
                  <Grid item xs={12} sm={3}>
                    <ImagePreview image={imageUrl} name="user-image" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth {...register('email')} id="email" label="Địa chỉ email" name="email" disabled />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                    //   name="firstName"
                      required
                      fullWidth
                      autoFocus
                      id="firstName"
                      label="Họ"
                      {...register('firstName')}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message || ''}
                      // eslint-disable-next-line eqeqeq
                      disabled={profileID != authInfo?.id}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Tên"
                    //   name="lastName"
                      {...register('lastName')}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message || ''}
                      // eslint-disable-next-line eqeqeq
                      disabled={profileID != authInfo?.id}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <TextField
                      fullWidth
                      id="phone"
                      label="Số điện thoại"
                      {...register('phone')}
                      error={!!errors.phone}
                      helperText={errors.phone?.message || ''}
                      // eslint-disable-next-line eqeqeq
                      disabled={profileID != authInfo?.id}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} sx={{ mt: 1 }}>
                      <Button fullWidth sx={{height: '55px', width: '100%'}} variant="outlined" startIcon={<LocationOnIcon />}
                          onClick={handleOpen}
                          // eslint-disable-next-line eqeqeq
                          disabled={profileID != authInfo?.id}>
                          Cập nhật vị trí
                      </Button>
                      <Modal
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                      >
                          <Box sx={style}>
                              {/* <MapSelectWarehouses warehouses={warehouses} warehousesSelected={warehousesSelected} handleSelectWarehouses={handleSelectWarehouses}/> */}
                              <MapSelectAddress setLocation={setLocation} handleClose={handleClose} isUser/>
                          </Box>
                      </Modal>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                    >
                      <DemoContainer components={['DatePicker']}>
                        <DatePicker
                          sx={{ width: '100%' }}
                          label='Ngày sinh'
                          value={date}
                          onChange={newValue =>
                            setDate(newValue)
                          }
                          format="DD/MM/YYYY"
                          // eslint-disable-next-line eqeqeq
                          disabled={profileID != authInfo?.id}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>
                </Grid>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1 }}
                  // eslint-disable-next-line eqeqeq
                  disabled={profileID != authInfo?.id}>
                  {updateLoading ? 'Đang tải...' : 'Cập nhật'}
                </Button>
              </Box>
            )}
          </Box>
        </Container>
      </Grid>
    </ThemeProvider>
  );
}

export default Profile;
