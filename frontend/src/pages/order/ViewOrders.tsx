import { Box, Stack } from '@mui/material'
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react'
import OrderCard from './OrderCard';
import Grid from '@mui/material/Unstable_Grid2';
import { getOrderListByStatus } from '../../redux/services/orderServices';

const LIMIT: any = 6;

function getStatusAndMethod(status: string, locationOfItem: string) {
  let statusArray: any = [];
  let methodArray: any = [];

  if (locationOfItem === '1') {
      methodArray = ['2', '3', '4', '5'];
  } else if (locationOfItem === '2') {
      methodArray = ['1'];
  }

  if (locationOfItem === '1') {
      if (status === '1') {
          statusArray = ['Chờ người cho giao hàng', 'Chờ cộng tác viên lấy hàng'];
      } else if (status === '2') {
          statusArray = ['Hàng đã nhập kho', 'Hàng đang được đến lấy', 'Chờ người nhận lấy hàng'];
      } else if (status === '3') {
          statusArray = ['Hoàn tất'];
      } else if (status === '4') {
          statusArray = [];
      }
  } else if (locationOfItem === '2') {
      if (status === '1') {
          statusArray = ['Đã duyệt', 'Chờ người nhận lấy hàng'];
      } else if (status === '2') {
          statusArray = ['Người nhận đã nhận hàng', 'Hoàn tất'];
      } else if (status === '3') {
          statusArray = ['Hủy'];
      }
  }

  return { status: statusArray, method: methodArray };
}

export default function ViewOrders({ locationOfItem, status }: any) {
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const userID = '29'

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  
  const effectData = async () => {
    try {
      const result = await getOrderListByStatus(
        userID,
        getStatusAndMethod(locationOfItem, status).status,
        getStatusAndMethod(locationOfItem, status).method,
        LIMIT, page - 1);
      setOrders(result.orders);
      setTotalItems(result.totalItems);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    effectData();
  }, [page]);

  return (
    <>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {/* Lặp qua danh sách đơn hàng và render OrderCard cho mỗi đơn hàng */}
        {orders.map((order: any, index: number) => (
          <Grid xs={12} sm={4} md={4} key={index}>
            <OrderCard order={order} />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Stack>
          <Pagination count={Math.ceil(totalItems / LIMIT)} page={page} onChange={handleChange} />
        </Stack>
      </Box>
    </>
  )
}
