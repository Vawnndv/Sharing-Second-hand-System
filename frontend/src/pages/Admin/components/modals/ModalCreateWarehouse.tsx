/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Modal, Stack, TextField, Typography, Grid } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import Loader from '../../../../components/notification/Loader'
import { AppDispatch, RootState, useAppDispatch } from '../../../../redux/store'
import { CreateWarehouseValidation } from '../../../../validation/userValidation'
import ImagePreview from '../../../../components/ImagePreview/ImagePreview';
import Uploader from '../../../../components/Uploader/Uploader';
import MapSelectAddress from '../../../../components/Map/MapSelectAddress'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Axios from '../../../../redux/APIs/Axios'


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
  isAddNewWarehouse: any;
  setIsAddNewWarehouse: (val: any) => void;

}

interface WarehouseLocation {
  address: string;
  longitude: number; // Sử dụng kiểu `number` cho cả giá trị kiểu float
  latitude: number;
  addressid?: number;
}



function ModalCreateCollaborator(props: Props) {
  const { isOpen, handleOpen, setIsOpen, pageState, sortModel, filterModel,isAddNewWarehouse, setIsAddNewWarehouse} = props;
  const [imageUrl, setImageUrl] = useState<any>('');
  const [imageUpdateUrl, setImageUpdateUrl] = useState<any>(null);
  const [openMap, setOpenMap] = useState(false);
  const [location, setLocation] = useState<any>({address: ''})

  const dispatch: AppDispatch = useAppDispatch();
  
  const { isLoading, isError, isSuccess } = useSelector(
    (state: RootState) => state.adminCreateCollaborator
  )

  const warehouseLocation: WarehouseLocation = {
    address: "123 Main St, Anytown, AN",
    longitude: 123.4567,
    latitude: 312.219,
    addressid: 10
  };


  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(CreateWarehouseValidation)
  })

  const handleOpenMap = () => setOpenMap(true);
  const handleCloseMap = () => setOpenMap(false);

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

  // useEffect(() => {
  //   setValue('warehousename', '')
  //   setValue('address', location.address)
  //   setValue('avatar', imageUrl)
  //   setValue('phonenumber', '')
  // }, [isOpen, imageUrl, location])


  useEffect(() => {
    setValue('address', location.address)
  }, [location])

  
  useEffect(() => {
    setValue('address', location.address)
    setValue('avatar', imageUrl)
  }, [imageUrl])
  // useEffect(() => {
  //   if (isSuccess) {
  //     dispatch(getAllCollaboratorsAction(0, pageState.pageSize, filterModel, sortModel))
  //     setIsOpen(!isOpen)
  //     dispatch({ type: 'UPDATE_USER_RESET' })
  //   }
  //   if (isError) {
  //     toast.error(isError)
  //     // setIsOpen(!isOpen)
  //     dispatch({ type: 'UPDATE_USER_RESET' })
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isSuccess, isError, dispatch, setIsOpen])

  const onSubmit = async (data: any) => {
    try {
      const warehouseName = data.warehousename;
      // const address = data.address;
      const isNewAddress = true;
      const phonenumber = data.phonenumber;
      const avatar = imageUrl;
      const res = await Axios.post(`/warehouse/createWarehouse`, {
        warehouseName,
        phonenumber,
        avatar,
        warehouseLocation: location,
        isNewAddress
      });
      setIsAddNewWarehouse(!isAddNewWarehouse);
      setIsOpen(!isOpen);
      toast.success(`Tạo kho thành công`);
      // Alert.alert('Success', 'Item created successfully');
      } catch (error) {
        console.log(error);
      }
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
                Tạo kho
            </Typography>

            <Grid container spacing={2} sx={{ mt: '20px'}}>
                <Grid item xs={12} sm={9} >
                  <Uploader setImageUrl={setImageUrl} imageUrl={imageUrl} imageUpdateUrl={imageUpdateUrl} {...register('avatar')}/>
                </Grid>
                <Grid item xs={12} sm={3} >
                  <ImagePreview image={imageUrl} name="user-image"/>
                </Grid>
            </Grid>

            <TextField
              id="warehousename"
              label="Tên kho"
              variant="outlined"
              {...register('warehousename')}
              error={!!errors.warehousename}
              helperText={errors.warehousename?.message || ''}
              sx={{ mt: '20px', width:'100%' }}
            />

            <TextField
              id="phonenumber"
              label="Số điện thoại"
              variant="outlined"
              {...register('phonenumber')}
              error={!!errors.phonenumber}
              helperText={errors.phonenumber?.message || ''}
              sx={{ mt: '20px', width:'100%' }}
            />

            {
              location && 
              <TextField
                value={location.address}
                id="address"
                label="Địa chỉ"
                variant="outlined"
                {...register('address')}
                error={!!errors.address}
                helperText={errors.address?.message || ''}
                sx={{ mt: '20px', width:'100%' }}
              />
            }
            

            {/* <TextField
              id="avatar"
              label="Avatar"
              variant="outlined"
              {...register('avatar')}
              error={!!errors.avatar}
              helperText={errors.avatar?.message || ''}
              sx={{ mt: '20px'
              , width:'100%' }}
            />     */}

          <Grid item xs={12} sx={{ mt: '20px' }}>
              <Button fullWidth sx={{height: '55px', width: '100%'}} variant="outlined" startIcon={<LocationOnIcon />}
                  onClick={handleOpenMap}>
                  Chọn vị trí kho
              </Button>
              <Modal
                  open={openMap}
                  onClose={handleCloseMap}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
              >
                  <Box sx={style}>
                      <MapSelectAddress setLocation={setLocation} handleClose={handleCloseMap} isUser {...register('address')}/>
                  </Box>
              </Modal>
          </Grid>
            


            <Stack direction='row' justifyContent='end' mt={4} spacing={2}>
              <Button variant='contained' color='error' onClick={() => {handleOpen()}}>Hủy</Button>
              <Button variant='contained' type="submit" >Tạo</Button>
            </Stack>
          </Box>
        </>
      </Modal>
  )
}

export default ModalCreateCollaborator
