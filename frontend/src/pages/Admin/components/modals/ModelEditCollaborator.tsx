import { yupResolver } from '@hookform/resolvers/yup'
import { Backdrop, Box, Button, FormControl, Grid, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { getAllCollaboratorsAction, updateCollaboratorAction } from '../../../../redux/actions/collaboratorActions'
import { resetCollaboratorPasswordService } from '../../../../redux/services/collaboratorServices'
import { AppDispatch, RootState, useAppDispatch } from '../../../../redux/store'
import { EditUserInfoValidation } from '../../../../validation/userValidation'
import Loader from '../../../../components/notification/Loader'
// eslint-disable-next-line no-restricted-imports
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const styleModalEditCollaborator = {
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
  userRow: any;
  setUserRow: (val: any) => void;
  setIsOpen: (val: boolean) => void;
  pageState: any;
  sortModel: any;
  warehouseNameList: any;
  filterModel: any;
  isEdit: boolean;
  setIsEdit: (val: boolean) => void;
}

function ModalEditCollaborator(props: Props) {
  const { isOpen, handleOpen, setUserRow, userRow, setIsOpen, pageState, sortModel, filterModel, isEdit, setIsEdit, warehouseNameList} = props;
  const dispatch: AppDispatch = useAppDispatch();

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { isLoading, isError: editError, isSuccess: editSuccess } = useSelector(
    (state: RootState) => state.adminEditCollaborator
  )

  const [date, setDate] = useState<any>(null);

  const resetCollaboratorPassword = async () => {
    try {
      await resetCollaboratorPasswordService({email: userRow.email});
      toast.success(`Đặt lại mật khẩu của ${userRow.firstname} thành công`);
    } catch (error: unknown) {
      console.log(error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Lỗi mạng");
      }
    }
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(EditUserInfoValidation)
  })

  useEffect(() => {
    if (userRow) {
      setValue('firstName', userRow?.firstname)
      setValue('lastName', userRow?.lastname)
      setValue('email', userRow?.email)
      setValue('phoneNumber', userRow?.phonenumber)
      setValue('warehouseName', userRow?.warehousename ? userRow?.warehousename : '');
      if (userRow?.dob !== '') {
        setDate(dayjs(userRow?.dob));
      }
    }
  }, [userRow, setValue])

  useEffect(() => {
    if (editSuccess) {
      dispatch(getAllCollaboratorsAction(pageState.page, pageState.pageSize, filterModel, sortModel))
      setIsOpen(!isOpen)
      dispatch({ type: 'UPDATE_USER_RESET' })
    }
    if (editError) {
      toast.error(editError)
      setIsOpen(!isOpen)
      dispatch({ type: 'UPDATE_USER_RESET' })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editSuccess, editError, dispatch, setIsOpen])

  const onSubmit = (data: any) => {
    // setIsEdit(false);
    const selectedWarehouse = warehouseNameList.find((warehouse: any) => warehouse.warehousename === data.warehouseName);
    // Check if warehouse is found and then access its warehouseid
    const warehouseId = selectedWarehouse ? selectedWarehouse.warehouseid : null;
    dispatch(updateCollaboratorAction(
      userRow?.userid,
      {
        userId: userRow.userid,
        ...data,
        warehouseId,
        dob: date ? date.format('YYYY/MM/DD') : '',
      }
    ))
  }

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={() => { handleOpen(); setUserRow(null) }}
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
            sx={styleModalEditCollaborator}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
          >
                
            <Typography id="modal-modal-title" variant="h4" sx={{ fontWeight:'bold', color: 'primary.main'}}>
                Cập nhật thông tin cộng tác viên
            </Typography>

            <Grid container spacing={2} sx={{ mt: '20px' }}>
              <Grid item xs={6}>
                <TextField
                  id="lastName"
                  label="Họ"
                  variant="outlined"
                  disabled={!isEdit}
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
                  disabled={!isEdit}
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
              disabled={!isEdit}
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message || ''}
              sx={{ mt: '20px', width:'100%' }}
            />

            <TextField
              id="phone"
              label="Số điện thoại"
              variant="outlined"
              disabled={!isEdit}
              {...register('phoneNumber')}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message || ''}
              sx={{ mt: '20px', width:'100%', mb: '16px' }}
            />  

            <LocalizationProvider
              dateAdapter={AdapterDayjs}
            >
              <DemoContainer components={['DatePicker']}>
                <DatePicker
                  sx={{ width: '100%' }}
                  label='Date of birth'
                  disabled={!isEdit}
                  value={date}
                  onChange={newValue =>
                    setDate(newValue)
                  }
                  format="DD/MM/YYYY"
                />
              </DemoContainer>
            </LocalizationProvider>

            <Grid container sx={{ mt: '20px' }}>
              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <InputLabel id="warehousename-label">Chọn Kho</InputLabel>
                  <Select
                    labelId="warehousename-label"
                    id="warehousename"
                    label="Chọn kho"
                    disabled={!isEdit}
                    {...register('warehouseName')} // Đăng ký với useForm
                    defaultValue={userRow?.warehousename}
                  >
                    {warehouseNameList.map((item: any, index: number) => (
                      <MenuItem key={index} value={item.warehousename}>
                        {item.warehousename}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Stack direction='row' justifyContent='end' mt={4} spacing={2}>
              <Button variant='contained' color='error' onClick={() => {handleOpen(); setUserRow(null)}}>Bỏ qua</Button>
              {!isEdit && (<Button variant='contained' color='success' onClick={() => {handleOpen(); setUserRow(null); resetCollaboratorPassword()}}>Đặt lại mật khẩu</Button>)}
              {!isEdit && (
                <Button variant='contained' onClick={() => setIsEdit(true)}>Chỉnh sửa</Button>
              )}
              {isEdit && (
                <Button variant='contained' type="submit">Lưu</Button>
              )}
              
            </Stack>
          </Box>
        </>
      </Modal>
    </div>
  )
}

export default ModalEditCollaborator
