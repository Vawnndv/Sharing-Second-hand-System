/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup'
import { Backdrop, Box, Button, FormControl, Grid, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material'
import { useEffect } from 'react'
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
}

interface WarehouseLocation {
  address: string;
  longitude: number; // Sử dụng kiểu `number` cho cả giá trị kiểu float
  latitude: number;
  addressid?: number;
}

function ModalEditWarehouse(props: Props) {
  const { isOpen, handleOpen, setWarehouseRow, warehouseRow, setIsOpen, pageState, sortModel, filterModel, isEdit, setIsEdit} = props;

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { isLoading, isError: editError, isSuccess: editSuccess } = useSelector(
    (state: RootState) => state.adminEditCollaborator
  )

  const navigate = useNavigate()

  const warehouseLocation: WarehouseLocation = {
    address: "123 Main St, Anytown, AN",
    longitude: 123.4567,
    latitude: 312.219,
    addressid: 14
};


  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(EditWarehouseInfoValidation)
  })

  useEffect(() => {
    if (warehouseRow) {
      setValue('warehousename', warehouseRow?.warehousename)
      setValue('phonenumber', warehouseRow?.phonenumber)
      setValue('address', warehouseRow?.address)
      setValue('avatar', warehouseRow?.avatar)
      setValue('warehouseid', warehouseRow?.warehouseid)
    }
  }, [warehouseRow, setValue])

  useEffect(() => {
    if (editSuccess) {
      // dispatch(getAllCollaboratorsAction(pageState.page, pageState.pageSize, filterModel, sortModel))
      setIsOpen(!isOpen)
      // dispatch({ type: 'UPDATE_USER_RESET' })
    }
    if (editError) {
      toast.error(editError)
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
      if(data.address !== warehouseRow?.address){
        isNewAddress = true;
      }
      const warehouseid = data.warehouseid;
      const phonenumber = data.phonenumber;
      const avatar = 'https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/anh-den-ngau.jpeg';
      const res = await axios.post(`http://localhost:3000/warehouse/updateWarehouse`, {
        phonenumber,
        warehouseName,
        warehouseLocation,
        avatar,
        isNewAddress,
        warehouseid,
      });

      toast.success(`Update warehouse info successfully`);
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
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight:'bold', color:'#005B48' }}>
                Edit Warehouse
            </Typography>

            <TextField
              id="warehousename"
              label="Warehouse Name"
              variant="outlined"
              disabled={!isEdit}
              {...register('warehousename')}
              error={!!errors.warehousename}
              helperText={errors.warehousename?.message || ''}
              sx={{ mt: '20px', width:'100%' }}

            />

            <TextField
              id="phonenumber"
              label="Phone Number"
              variant="outlined"
              disabled={!isEdit}
              {...register('phonenumber')}
              error={!!errors.phonenumber}
              helperText={errors.phonenumber?.message || ''}
              sx={{ mt: '20px', width:'100%' }}
            /> 

            <TextField
              id="address"
              label="Address"
              variant="outlined"
              disabled={!isEdit}
              {...register('address')}
              error={!!errors.address}
              helperText={errors.address?.message || ''}
              sx={{ mt: '20px', width:'100%' }}
            />


            <TextField
              id="avatar"
              label="Avatar"
              variant="outlined"
              disabled={!isEdit}
              {...register('avatar')}
              error={!!errors.avatar}
              helperText={errors.avatar?.message || ''}
              sx={{ mt: '20px', width:'100%' }}
            />

  

            <Stack direction='row' justifyContent='end' mt={4} spacing={2}>
              <Button variant='contained' color='error' onClick={() => {handleOpen(); setWarehouseRow(null)}}>Cancel</Button>
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

export default ModalEditWarehouse
