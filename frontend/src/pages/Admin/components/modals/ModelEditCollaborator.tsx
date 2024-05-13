import { yupResolver } from '@hookform/resolvers/yup'
import { Backdrop, Box, Button, FormControl, Grid, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { getAllCollaboratorsAction, updateCollaboratorAction } from '../../../../redux/actions/collaboratorActions'
import { resetCollaboratorPasswordService } from '../../../../redux/services/collaboratorServices'
import { AppDispatch, RootState, useAppDispatch } from '../../../../redux/store'
import { EditUserInfoValidation } from '../../../../validation/userValidation'
import Loader from '../../../../components/notification/Loader'

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

  const resetCollaboratorPassword = async () => {
    try {
      await resetCollaboratorPasswordService({email: userRow.email});
      toast.success(`Đặt lại mật khẩu của ${userRow.firstname} thành công`);
    } catch (error: unknown) {
      console.log(error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Network Error");
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
      console.log(userRow.warehousename, 'userROw')
      console.log(warehouseNameList)
      setValue('firstName', userRow?.firstname)
      setValue('lastName', userRow?.lastname)
      setValue('email', userRow?.email)
      setValue('phoneNumber', userRow?.phonenumber)
      setValue('warehouseName', userRow?.warehousename ? userRow?.warehousename : '');
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
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight:'bold', color:'#005B48' }}>
                Edit User
            </Typography>

            <Grid container spacing={2} sx={{ mt: '20px' }}>
              <Grid item xs={6}>
                <TextField
                  id="firstName"
                  label="First Name"
                  variant="outlined"
                  disabled={!isEdit}
                  fullWidth
                  {...register('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message || ''}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="lastName"
                  label="Last Name"
                  variant="outlined"
                  disabled={!isEdit}
                  fullWidth
                  {...register('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message || ''}
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
              label="Phone Number"
              variant="outlined"
              disabled={!isEdit}
              {...register('phoneNumber')}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message || ''}
              sx={{ mt: '20px', width:'100%' }}
            />   

            <Grid container spacing={2} sx={{ mt: '20px' }}>
              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <InputLabel id="warehousename-label">Chọn Kho</InputLabel>
                  <Select
                    labelId="warehousename-label"
                    id="warehousename"
                    label="Set Admin"
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
              <Button variant='contained' color='error' onClick={() => {handleOpen(); setUserRow(null)}}>Cancel</Button>
              <Button variant='contained' color='success' onClick={() => {handleOpen(); setUserRow(null); resetCollaboratorPassword()}}>Reset Password</Button>
              {!isEdit && (
                <Button variant='contained' onClick={() => setIsEdit(true)}>Edit</Button>
              )}
              {isEdit && (
                <Button variant='contained' type="submit">Save</Button>
              )}
              
            </Stack>
          </Box>
        </>
      </Modal>
    </div>
  )
}

export default ModalEditCollaborator
