/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup'
import { Backdrop, Box, Button, FormControl, Grid, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { getAllCollaboratorsAction, updateCollaboratorAction } from '../../../../redux/actions/collaboratorActions'
import { resetCollaboratorPasswordService } from '../../../../redux/services/collaboratorServices'
import { AppDispatch, RootState, useAppDispatch } from '../../../../redux/store'
import { EditUserInfoValidation, EditWarehouseInfoValidation } from '../../../../validation/userValidation'
import Loader from '../../../../components/notification/Loader'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import MapSelectAddress from '../../../../components/Map/MapSelectAddress';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Uploader from '../../../../components/Uploader/Uploader'
import ImagePreview from '../../../../components/ImagePreview/ImagePreview'
import Axios from '../../../../redux/APIs/Axios'



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
  warehouseRow: any;
  setWarehouseRow: (val: any) => void;
  setIsOpen: (val: boolean) => void;
  pageState: any;
  sortModel: any;
  warehouseNameList: any;
  filterModel: any;
  isEdit: boolean;
  setIsEdit: (val: boolean) => void;
  isUpdateWarehouse: any;
  setIsUpdateWarehouse: (val: any) => void;
}

interface WarehouseLocation {
  address: string;
  longitude: number; // Sử dụng kiểu `number` cho cả giá trị kiểu float
  latitude: number;
  addressid?: number;
}

function ModalEditWarehouse(props: Props) {
  const { isOpen, handleOpen, setWarehouseRow, warehouseRow, setIsOpen, pageState, sortModel, filterModel, isEdit, setIsEdit, isUpdateWarehouse, setIsUpdateWarehouse} = props;
  const [imageUrl, setImageUrl] = useState<any>('');
  const [imageUpdateUrl, setImageUpdateUrl] = useState<any>(null);
  const [openMap, setOpenMap] = useState(false);
  const [location, setLocation] = useState<any>({address: ''});


  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { isLoading, isError: editError, isSuccess: editSuccess } = useSelector(
    (state: RootState) => state.adminEditCollaborator
  )

  const navigate = useNavigate();



  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(EditWarehouseInfoValidation)
  });

  
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


  useEffect(() => {
    if (warehouseRow) {
      setValue('warehousename', warehouseRow?.warehousename);
      setValue('phonenumber', warehouseRow?.phonenumber);
      setValue('address', location?.address || warehouseRow?.address);
      setValue('avatar', imageUrl || warehouseRow.avatar);
      setValue('warehouseid', warehouseRow?.warehouseid);

    }
  }, [warehouseRow, setValue, isOpen, location, imageUrl])

  useEffect(() => {
    if (editSuccess) {
      // dispatch(getAllCollaboratorsAction(pageState.page, pageState.pageSize, filterModel, sortModel))
      setIsOpen(!isOpen)
      // dispatch({ type: 'UPDATE_USER_RESET' })

    }
    if (editError) {
      toast.error('Cập nhật kho thất bại',editError)
      setIsOpen(!isOpen)
      // dispatch({ type: 'UPDATE_USER_RESET' })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editSuccess, editError, setIsOpen])

  const onSubmit = async (data: any) => {
    try {
      const warehouseName = data.warehousename;
      // const address = data.address;
      let isNewAddress = false;
      let warehouseLocation : any = {address: warehouseRow.address, longitude: warehouseRow.longitude, latitude: warehouseRow.latitude, warehouseid: warehouseRow.warehouseid};
      if(data.address !== warehouseRow?.address && location){
        isNewAddress = true;
        warehouseLocation = location;
      }
      const warehouseid = data.warehouseid;
      const phonenumber = data.phonenumber;
      let avatar = warehouseRow.avatar;
      if(imageUrl){
        avatar = imageUrl;
      }
      const res = await Axios.post(`/warehouse/updateWarehouse`, {
        phonenumber,
        warehouseName,
        warehouseLocation,
        avatar,
        isNewAddress,
        warehouseid,
      });

      toast.success(`Cập nhật kho thành công`);
      setIsUpdateWarehouse(!isUpdateWarehouse);
      setIsOpen(!isOpen);

      // Alert.alert('Success', 'Item created successfully');
      } catch (error) {
        console.log(error);
      }
  }

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={() => { handleOpen(); setWarehouseRow(null) }}
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
            <Typography id="modal-modal-title" variant="h5"  sx={{ fontWeight:'bold', color: 'primary.main' }}>
                Cập nhật thông tin kho
            </Typography>

            
            {warehouseRow &&
            <Grid container spacing={2} sx={{ mt: '20px'}}>
                <Grid item xs={12} sm={9} >
                  <Uploader setImageUrl={setImageUrl} imageUrl={imageUrl} imageUpdateUrl={imageUpdateUrl} {...register('avatar')}/>
                </Grid>
                <Grid item xs={12} sm={3} >
                  <ImagePreview image={imageUrl || warehouseRow.avatar} name="user-image"/>
                </Grid>
            </Grid>
            }

            <TextField
              id="warehousename"
              label="Tên kho"
              variant="outlined"
              disabled={!isEdit}
              {...register('warehousename')}
              error={!!errors.warehousename}
              helperText={errors.warehousename?.message || ''}
              sx={{ mt: '20px', width:'100%' }}

            />

            <TextField
              id="phonenumber"
              label="Số điện thoại"
              variant="outlined"
              disabled={!isEdit}
              {...register('phonenumber')}
              error={!!errors.phonenumber}
              helperText={errors.phonenumber?.message || ''}
              sx={{ mt: '20px', width:'100%' }}
            /> 

            <TextField
              id="address"
              label="Địa chỉ"
              variant="outlined"
              disabled={!isEdit}
              {...register('address')}
              error={!!errors.address}
              helperText={errors.address?.message || ''}
              sx={{ mt: '20px', width:'100%' }}
              inputProps={{readOnly: true}}
              
            />

            <Grid item xs={12} sx={{ mt: '20px' }}>
              <Button fullWidth sx={{height: '55px', width: '100%'}} variant="outlined" startIcon={<LocationOnIcon />}
                  onClick={handleOpenMap}>
                  Cập nhật vị trí kho
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
              <Button variant='contained' color='error' onClick={() => {handleOpen(); setWarehouseRow(null); setIsEdit(true); setLocation({address: ''}); setImageUrl('')}}>Bỏ qua</Button>
              {!isEdit && (
                <Button variant='contained' onClick={() => {setIsEdit(true); setIsUpdateWarehouse(!isUpdateWarehouse)}}>Cập nhật</Button>
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

export default ModalEditWarehouse
