import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Grid, Modal, Stack, TextField, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { getAllCollaboratorsAction, updateCollaboratorAction } from '../../../../redux/actions/collaboratorActions'
import { resetCollaboratorPasswordService } from '../../../../redux/services/collaboratorServices'
import { AppDispatch, RootState, useAppDispatch } from '../../../../redux/store'
import { EditUserInfoValidation } from '../../../../validation/userValidation'

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
  filterModel: any;
  isEdit: boolean;
  setIsEdit: (val: boolean) => void;
}

function ModalEditCollaborator(props: Props) {
  const { isOpen, handleOpen, setUserRow, userRow, setIsOpen, pageState, sortModel, filterModel, isEdit, setIsEdit} = props;
  const dispatch: AppDispatch = useAppDispatch();

  // const [isAdmin, setIsAdmin] = useState('')
  // const [isBanned, setIsBanned] = useState('')

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { isLoading: updateLoading, isError: editError, isSuccess: editSuccess } = useSelector(
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
    resolver: yupResolver(EditUserInfoValidation)
  })

  useEffect(() => {
    if (userRow) {
      setValue('firstName', userRow?.firstname)
      setValue('lastName', userRow?.lastname)
      setValue('email', userRow?.email)
      setValue('phoneNumber', userRow?.phonenumber)
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
    setIsEdit(false);
    dispatch(updateCollaboratorAction(
      userRow?.userid,
      {
        userId: userRow.userid,
        ...data,
        // isAdmin: isAdmin === 'admin',
        // isBanned: isBanned === 'banned'
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
            label="Phone"
            variant="outlined"
            disabled={!isEdit}
            {...register('phoneNumber')}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message || ''}
            sx={{ mt: '20px', width:'100%' }}
          />    
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
      </Modal>
    </div>
  )
}

export default ModalEditCollaborator
