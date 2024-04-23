import { useEffect, useRef, useState } from 'react';
import { Button, Box, Container, Grid, Paper, TextField, Typography, ThemeProvider, createTheme } from '@mui/material';
// import dayjs from 'dayjs';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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

function Profile() {
  // const [date, setDate] = useState<any>(null);
  const dispatch: AppDispatch = useAppDispatch();
  const initialized = useRef(false);

  const { isLoading, userInfo } = useSelector((state: RootState) => state.userGetProfile);
  const { userInfo: authInfo } = useSelector( (state: RootState) => state.userLogin);

  const [imageUrl, setImageUrl] = useState('');
  const [imageUpdateUrl, setImageUpdateUrl] = useState('');

  console.log(imageUpdateUrl,imageUrl, '123');

  const {
    isLoading: updateLoading,
    isError: editError,
    userInfo: editUserInfo,
    isSuccess: editSuccess
  } = useSelector((state: RootState) => state.userUpdateProfile);

  console.log(editUserInfo);
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
    console.log(data);
    if (imageUpdateUrl !== imageUrl) {
    //   await deleteImageService(imageUpdateUrl);
    }
    dispatch(
      updateProfileAction({
        ...data,
        id: authInfo?.id,
        avatar: imageUrl,
        // ...{ image: imageUrl, dob: date ? date.format('MM/DD/YYYY') : '' }
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
      setValue('userId', userInfo?.id);
      // if (userInfo?.dob !== '') {
      //   setDate(dayjs(userInfo?.dob));
      // }
      if (userInfo?.avatar)  setImageUrl(userInfo?.avatar);
    }

    if (editUserInfo) {
      console.log(editUserInfo);
      setValue('firstName', editUserInfo?.firstName);
      setValue('lastName', editUserInfo?.lastName);
      setValue('email', editUserInfo?.email);
      setValue('phone', editUserInfo?.phoneNumber);
      setValue('userId', editUserInfo?.id);
      // if (editUserInfo?.dob !== '') {
      //   setDate(dayjs(editUserInfo?.dob));
      // }
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
                fontWeight: 'bold'
              }}
            >
              Edit Profile
            </Typography>
            {isLoading ? (
              <Loader />
            ) : (
              <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={9}>
                    <Uploader setImageUrl={setImageUrl} imageUrl={imageUrl} imageUpdateUrl={imageUpdateUrl} />
                  </Grid>
                  {/* image preview */}
                  <Grid item xs={12} sm={3}>
                    <ImagePreview image={imageUrl} name="user-image" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth {...register('email')} id="email" label="Email" name="email" disabled />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                    //   name="firstName"
                      required
                      fullWidth
                      autoFocus
                      id="firstName"
                      label="First Name"
                      {...register('firstName')}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message || ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                    //   name="lastName"
                      {...register('lastName')}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message || ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} sx={{ mt: 1 }}>
                    <TextField
                      fullWidth
                      id="phone"
                      label="Phone"
                    //   name="phone"
                      {...register('phone')}
                      error={!!errors.phone}
                      helperText={errors.phone?.message || ''}
                    />
                  </Grid>

                  {/* <Grid item xs={12} sm={6} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker']}>
                        <DatePicker
                          sx={{ width: '100%' }}
                          label="Date of birth"
                          value={date}
                          onChange={(newValue) => setDate(newValue)}
                          onError={false}
                          placeholder="MM/DD/YYYY"
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid> */}
                </Grid>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1 }}>
                  {updateLoading ? 'Updating...' : 'Update Profile'}
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
