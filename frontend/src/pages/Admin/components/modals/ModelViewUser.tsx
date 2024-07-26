import { Box, Button, Grid, Modal, Stack, TextField } from '@mui/material'
// eslint-disable-next-line no-restricted-imports
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import ImagePreview from '../../../../components/ImagePreview/ImagePreview'

const styleModelViewUser = {
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

}

function ModelViewUser(props: Props) {
  const { isOpen, handleOpen, setUserRow, userRow } = props;

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={() => { handleOpen(); setUserRow(null) }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleModelViewUser}>
          <Grid container spacing={2}>
              <Grid item xs={12} sm={12} container alignItems="center" justifyContent="center">
                  <Box display="flex" justifyContent="center" alignItems="center" width="100%">
                      <ImagePreview image={userRow?.avatar || ''} name="user-image" isAboutProfile />
                  </Box>
              </Grid>
              <Grid item xs={12} >
                  <TextField 
                    id="email" 
                    fullWidth
                    label="Địa chỉ email" 
                    name="email"  
                    value={userRow?.email || ''}
                    InputProps={{
                        readOnly: true,
                    }}
                  />
              </Grid>
              <Grid item xs={12} sm={6}>
                  <TextField
                      //   name="firstName"
                      fullWidth
                      autoFocus
                      id="firstName"
                      label="Họ"
                      value={userRow?.firstname || ''}
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
                  value={userRow?.lastname || ''}
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
                      value={userRow?.phonenumber || ''}
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
                          value={userRow?.dob ? dayjs(userRow?.dob) : null}
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
                      value={userRow?.address || ''}
                      InputProps={{
                          readOnly: true,
                      }}
                  />
              </Grid>
          </Grid>
          <Stack direction='row' justifyContent='end' mt={4} spacing={2}>
              <Button variant='contained' color='error' onClick={() => {handleOpen(); setUserRow(null)}}>Thoát</Button>
            </Stack>
        </Box>
      </Modal>
    </div>
  )
}

export default ModelViewUser
