/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { getAllCollaboratorsAction, createCollaboratorAction } from '../../../../redux/actions/collaboratorActions'
import { AppDispatch, RootState, useAppDispatch } from '../../../../redux/store'
import { CreateWarehouseValidation, EditUserInfoValidation } from '../../../../validation/userValidation'
import Loader from '../../../../components/notification/Loader'
import axios from 'axios'

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

interface WarehouseLocation {
  address: string;
  longitude: number; // Sử dụng kiểu `number` cho cả giá trị kiểu float
  latitude: number;
  addressid?: number;
}

function ModalCreateCollaborator(props: Props) {
  const { isOpen, handleOpen, setIsOpen, pageState, sortModel, filterModel} = props;
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

  useEffect(() => {
    setValue('warehousename', '')
    setValue('address', '')
    setValue('avatar', '')
    setValue('phonenumber', '')
    // setValue('phoneNumber', '')
  }, [isOpen])


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
    console.log(data);

    try {
      const warehouseName = data.warehousename;
      // const address = data.address;
      const isNewAddress = true;
      const phonenumber = data.phonenumber;
      const avatar = 'https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/anh-den-ngau.jpeg';
      const res = await axios.post(`http://localhost:3000/warehouse/createWarehouse`, {
        warehouseName,
        phonenumber,
        avatar,
        warehouseLocation,
        isNewAddress
      });
      setIsOpen(!isOpen);
      toast.success(`Create warehouse successfully`);
      console.log(res.data.warehouseCreated);
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
                Create Warehouse
            </Typography>

            <TextField
              id="warehousename"
              label="WarehouseName"
              variant="outlined"
              {...register('warehousename')}
              error={!!errors.warehousename}
              helperText={errors.warehousename?.message || ''}
              sx={{ mt: '20px', width:'100%' }}
            />

            <TextField
              id="phonenumber"
              label="Phone"
              variant="outlined"
              {...register('phonenumber')}
              error={!!errors.phonenumber}
              helperText={errors.phonenumber?.message || ''}
              sx={{ mt: '20px', width:'100%' }}
            />


            <TextField
              id="address"
              label="Address"
              variant="outlined"
              {...register('address')}
              error={!!errors.address}
              helperText={errors.address?.message || ''}
              sx={{ mt: '20px', width:'100%' }}
            />

            <TextField
              id="avatar"
              label="Avatar"
              variant="outlined"
              {...register('avatar')}
              error={!!errors.avatar}
              helperText={errors.avatar?.message || ''}
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
