import { useEffect, useState } from 'react'
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { AppDispatch, RootState, useAppDispatch } from '../../../../redux/store'
import { EditUserInfoValidation } from '../../../../validation/userValidation'
import { getAllCollaboratorsAction, updateCollaboratorAction } from '../../../../redux/actions/collaboratorActions'

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
}

function ModalEditCollaborator(props: Props) {
  const { isOpen, handleOpen, setUserRow, userRow, setIsOpen, pageState, sortModel, filterModel} = props;
  const dispatch: AppDispatch = useAppDispatch();

  const [isAdmin, setIsAdmin] = useState('')
  const [isBanned, setIsBanned] = useState('')

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { isLoading: updateLoading, isError: editError, collaboratorInfo: editUserInfo, isSuccess: editSuccess } = useSelector(
    (state: RootState) => state.adminEditCollaborator
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
    if (userRow) {
      setValue('firstName', userRow?.firstName)
      setValue('lastName', userRow?.lastName)
      setValue('email', userRow?.email)
      setValue('userId', userRow?.userId)
      setIsAdmin(userRow?.isAdmin ? 'admin' : 'not admin')
      setIsBanned(userRow?.isBanned ? 'banned' : 'unbanned')
    }
  }, [userRow, setValue, setIsAdmin, setIsBanned])

  useEffect(() => {
    if (editUserInfo) {
      dispatch(getAllCollaboratorsAction(pageState.page, pageState.pageSize, filterModel, sortModel))
    }

    if (editSuccess) {
      setIsOpen(!isOpen)
      dispatch({ type: 'UPDATE_USER_RESET' })
    }
    if (editError) {
      toast.error(editError)
      setIsOpen(!isOpen)
      dispatch({ type: 'UPDATE_USER_RESET' })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editUserInfo, editSuccess, editError, dispatch, setIsOpen])

  const onSubmit = (data: any) => {
    dispatch(updateCollaboratorAction(
      userRow?.id,
      {
        ...data,
        isAdmin: isAdmin === 'admin',
        isBanned: isBanned === 'banned'
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
          {!userRow?.isAdmin && <TextField
            id="userId"
            label="Student Id"
            variant="outlined"
            {...register('userId')}
            error={!!errors.userId}
            helperText={errors.userId?.message || ''}
            sx={{ mt: '20px', width:'100%' }}
          />}
          <Grid container spacing={2} sx={{ mt: '20px' }}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="admin-label">Set Admin</InputLabel>
                <Select
                  labelId="admin-label"
                  id="admin"
                  label="Set Admin"
                  value={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.value)}
                >
                  <MenuItem value="admin" >Admin</MenuItem>
                  <MenuItem value="not admin" >Not Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="ban-label">Ban User</InputLabel>
                <Select
                  labelId="ban-label"
                  id="ban"
                  label="Ban User"
                  value={isBanned}
                  onChange={(e) => setIsBanned(e.target.value)}
                >
                  <MenuItem value="unbanned">Unbanned</MenuItem>
                  <MenuItem value="banned">Banned</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Stack direction='row' justifyContent='end' mt={4} spacing={2}>
            <Button variant='contained' color='error' onClick={() => {handleOpen(); setUserRow(null)}}>Cancel</Button>
            <Button variant='contained' type="submit">Save</Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  )
}

export default ModalEditCollaborator
