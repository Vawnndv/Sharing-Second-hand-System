/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getOrderDetailsCollaborator } from '../../redux/services/inventoryServices';
import { Box, CircularProgress, Divider, Grid, Typography } from '@mui/material';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import item from '../../assets/item.png';
import deliveryBike from '../../assets/delivery-bike.png'
import deliveryTruck from '../../assets/delivery-truck.png'
import { formatDateTime } from '../../utils/FormatDateTime';

function ViewInventoryDetail() {
  const { orderid } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetail= async () => {
    try {
      const response = await getOrderDetailsCollaborator(orderid);
      console.log(response.orders[0])
      setOrder(response.orders[0]);
      setLoading(false); // Set loading state to false after fetching data
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setLoading(false); // Set loading state to false in case of error
    }
  };

  useEffect(() => {

    fetchOrderDetail();
  }, []);

  return (
    loading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    ) : (
      <Box sx={{ m: 2 }}>
        <Typography variant='h5'>{order?.order.title}</Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={0.5} sx={{ display: 'flex', alignItems: 'center' }}>
            <FmdGoodOutlinedIcon />
          </Grid>
          <Grid item xs={11.5} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', }}>
            <Typography variant='body1' fontWeight='bold'>Nguời cho</Typography>
            <Typography variant='body1'>{order?.order.giver.firstName} {order?.order.giver.lastName} - {order?.order.giver.phoneNumber}</Typography>
            <Typography variant='body1'>{order?.order.addressGive.address}</Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={0.5} sx={{ display: 'flex', alignItems: 'center' }}>
            <FmdGoodOutlinedIcon sx={{ color: 'red' }} />
          </Grid>
          <Grid item xs={11.5} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', }}>
            <Typography variant='body1' fontWeight='bold'>Nguời nhận</Typography>
            <Typography variant='body1'>{order?.order.receiver.firstName} {order?.order.receiver.lastName} - {order?.order.receiver.phoneNumber}</Typography>
            <Typography variant='body1'>{order?.order.addressReceive.address}</Typography>
          </Grid>
        </Grid>

        <Typography sx={{my: 2}} variant='body1' fontWeight='bold'>Thông tin đơn hàng</Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={deliveryTruck} alt="Image" style={{ maxWidth: '70px', height: 'auto' }} />
          </Grid>
          <Grid item xs={10} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', }}>
            <Typography variant='body1' fontWeight='bold'>Lấy hàng trong ngày</Typography>
            <Typography variant='body1'>Hết hạn vào {formatDateTime(order?.order.post.timeend)}</Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={deliveryBike} alt="Image" style={{ maxWidth: '70px', height: 'auto' }} />
          </Grid>
          <Grid item xs={10} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', }}>
            <Typography variant='body1' fontWeight='bold'>Xe máy</Typography>
            <Typography variant='body1'>Hàng hoá tối đa 30kg (50x40x50cm)</Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={item} alt="Image" style={{ maxWidth: '70px', height: 'auto' }} />
          </Grid>
          <Grid item xs={10} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', }}>
            <Typography variant='body1' fontWeight='bold'>Hàng hóa</Typography>
            <Typography variant='body1'>Số lượng {order?.order.item.quantity} - {order?.order.item.name}</Typography>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <img src={order?.image} alt="Image" style={{ maxWidth: '300px', height: 'auto' }} />
        </Box>

        <Divider />

        <Typography sx={{my: 2}} variant='body1' fontWeight='bold'>Xác nhận đơn</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <img src={order?.imgConfirm} alt="Image" style={{ maxWidth: '300px', height: 'auto' }} />
        </Box>

      </Box>
    )
  )
}

export default ViewInventoryDetail