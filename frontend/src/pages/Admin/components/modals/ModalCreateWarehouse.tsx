import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Grid, Modal, Stack, TextField, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { getAllCollaboratorsAction, createCollaboratorAction } from '../../../../redux/actions/collaboratorActions'
import { AppDispatch, RootState, useAppDispatch } from '../../../../redux/store'
import { EditUserInfoValidation } from '../../../../validation/userValidation'
import Loader from '../../../../components/notification/Loader'

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
  pageState: any;
  sortModel: any;
  filterModel: any;
}

function ModalCreateCollaborator(props: Props) {
  const { isOpen, handleOpen, setIsOpen, pageState, sortModel, filterModel} = props;
  const dispatch: AppDispatch = useAppDispatch();
  
  const { isLoading, isError, isSuccess } = useSelector(
    (state: RootState) => state.adminCreateCollaborator
  )

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(EditUserInfoValidation)
  })

  useEffect(() => {
    setValue('firstName', '')
    setValue('lastName', '')
    setValue('email', '')
    setValue('phoneNumber', '')
  }, [isOpen])


  useEffect(() => {
    if (isSuccess) {
      dispatch(getAllCollaboratorsAction(0, pageState.pageSize, filterModel, sortModel))
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
    dispatch(createCollaboratorAction(data))
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
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999, // Ensure the loading overlay is on top
          }}>
            <Loader />
          </div>
           )}
          <Box
            sx={styleModalCreateCollaborator}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight:'bold', color:'#005B48' }}>
                Create User
            </Typography>

            <Grid container spacing={2} sx={{ mt: '20px' }}>
              <Grid item xs={6}>
                <TextField
                  id="firstName"
                  label="First Name"
                  variant="outlined"
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
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message || ''}
              sx={{ mt: '20px', width:'100%' }}
            />

            <TextField
              id="phone"
              label="Phone"
              variant="outlined"
              {...register('phoneNumber')}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message || ''}
              sx={{ mt: '20px', width:'100%' }}
            />    
            <Stack direction='row' justifyContent='end' mt={4} spacing={2}>
              <Button variant='contained' color='error' onClick={() => {handleOpen()}}>Cancel</Button>
              <Button variant='contained' type="submit">Save</Button>
            </Stack>
          </Box>
        </>
      </Modal>
  )
}

export default ModalCreateCollaborator
