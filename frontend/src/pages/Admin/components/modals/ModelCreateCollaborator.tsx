import { yupResolver } from '@hookform/resolvers/yup'
import { Backdrop, Box, Button, FormControl, Grid, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { getAllCollaboratorsAction, createCollaboratorAction } from '../../../../redux/actions/collaboratorActions'
import { AppDispatch, RootState, useAppDispatch } from '../../../../redux/store'
import { EditUserInfoValidation } from '../../../../validation/userValidation'
import Loader from '../../../../components/notification/Loader'
// eslint-disable-next-line no-restricted-imports
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const styleModalCreateCollaborator = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 600,
  bgcolor: 'background.paper',
  border: '2px solid #005B48',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px'
}
interface Props {
  isOpen: boolean;
  handleOpen: () => void;
  setIsOpen: (val: boolean) => void;
  warehouseNameList: any;
  pageState: any;
  sortModel: any;
  filterModel: any;
  totalCollaborator: any;
  setTotalCollaborator: (val: boolean) => void;
}

function ModalCreateCollaborator(props: Props) {
  const { isOpen, handleOpen, setIsOpen, warehouseNameList, pageState, sortModel, filterModel, totalCollaborator, setTotalCollaborator} = props;
  const dispatch: AppDispatch = useAppDispatch();
  
  const { isLoading, isError, isSuccess } = useSelector(
    (state: RootState) => state.adminCreateCollaborator
  )

  const [date, setDate] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(EditUserInfoValidation)
  })

  useEffect(() => {
    reset();
    setValue('firstName', '');
    setValue('lastName', '');
    setValue('email', '');
    setValue('phoneNumber', '');
    setValue('warehouseName', '');
    setDate(null);
  }, [isOpen])


  useEffect(() => {
    if (isSuccess) {
      dispatch(getAllCollaboratorsAction(0, pageState.pageSize, filterModel, sortModel))
      setTotalCollaborator(totalCollaborator + 1);
      setIsOpen(!isOpen)
      dispatch({ type: 'UPDATE_USER_RESET' })
    }
    if (isError) {
      toast.error(isError)
      // setIsOpen(!isOpen)
      dispatch({ type: 'UPDATE_USER_RESET' })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, dispatch, setIsOpen])

  const onSubmit = (data: any) => {
    const selectedWarehouse = warehouseNameList.find((warehouse: any) => warehouse.warehousename === data.warehouseName);
    // Check if warehouse is found and then access its warehouseid
    const warehouseId = selectedWarehouse ? selectedWarehouse.warehouseid : null;
        dispatch(createCollaboratorAction({...data, warehouseId, dob: date ? date.format('YYYY/MM/DD') : '',}))
  }

  return (
      <Modal
        open={isOpen}
        onClose={() => { handleOpen()}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          {isLoading && (
           <Backdrop
           sx={{ zIndex: (theme: { zIndex: { drawer: number } }) => theme.zIndex.drawer + 1, backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
           open={isLoading}
         >
            <Loader />
          </Backdrop>
           )}
          <Box
            sx={styleModalCreateCollaborator}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight:'bold', color:'#005B48' }}>
                Thêm cộng tác viên mới
            </Typography>

            <Grid container spacing={2} sx={{ mt: '20px' }}>
              <Grid item xs={6}>
                <TextField
                  id="lastName"
                  label="Họ"
                  variant="outlined"
                  fullWidth
                  {...register('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message || ''}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="firstName"
                  label="Tên"
                  variant="outlined"
                  fullWidth
                  {...register('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message || ''}
                />
              </Grid>
            </Grid>


            <TextField
              id="email"
              label="Email"
              variant="outlined"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message || ''}
              sx={{ mt: '20px', width:'100%' }}
            />

            <TextField
              id="phone"
              label="Số điện thoại"
              variant="outlined"
              {...register('phoneNumber')}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message || ''}
              sx={{ mt: '20px' ,  mb: 1, width:'100%' }}
            />    

            <LocalizationProvider
              dateAdapter={AdapterDayjs}
            >
              <DemoContainer components={['DatePicker']}>
                <DatePicker
                  label='Ngày sinh'
                  value={date}
                  onChange={newValue =>
                    setDate(newValue)
                  }
                  format="DD/MM/YYYY"
                />
              </DemoContainer>
            </LocalizationProvider>

            <Grid sx={{ mt: '20px' }}>
                <FormControl fullWidth>
                  <InputLabel id="warehousename-label">Chọn Kho</InputLabel>
                  <Select
                    labelId="warehousename-label"
                    id="warehousename"
                    label="Kho làm việc"
                   {...register('warehouseName')} // Đăng ký với useForm
                   defaultValue=""
                   error={!!errors.warehouseName} // Hiển thị lỗi nếu có
                  >
                    <MenuItem value='' style={{ display: 'none' }} />
                    {warehouseNameList.map((item: any, index: number) => (
                      <MenuItem key={index} value={item.warehousename}>
                        {item.warehousename}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.warehouseName && (
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{
                        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                        fontWeight: 400,
                        fontSize: '0.75rem',
                        lineHeight: 1.66,
                        letterSpacing: '0.03333em',
                        textAlign: 'left',
                        marginTop: '3px',
                        marginRight: '14px',
                        marginBottom: 0,
                        marginLeft: '14px',
                      }}
                    >
                      {errors.warehouseName.message}
                    </Typography>
                  )}
                </FormControl>
            </Grid>
            <Stack direction='row' justifyContent='end' mt={4} spacing={2}>
              <Button variant='contained' color='error' onClick={() => {handleOpen()}}>Hủy</Button>
              <Button variant='contained' type="submit">Lưu</Button>
            </Stack>
          </Box>
        </>
      </Modal>
  )
}

export default ModalCreateCollaborator
