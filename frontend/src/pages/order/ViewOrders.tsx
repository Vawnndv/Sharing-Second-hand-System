import { Box, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react'
import OrderCard from './OrderCard';
import { getOrderListByStatus } from '../../redux/services/orderServices';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';


const LIMIT: any = 6;

function getStatusAndMethod(status: number, locationOfItem: number) {
  let statusArray: any = [];
  let methodArray: any = [];

  if (locationOfItem === 1) {
      methodArray = ['2', '3', '4', '5'];
  } else if (locationOfItem === 2) {
      methodArray = ['1'];
  }

  // TH xem những đơn hàng đã hoàn tất
  if (!status)
    return { status: ['Hoàn tất'], method: methodArray };

  // TH Theo dõi những đơn hàng
  if (locationOfItem === 1) {
      if (status === 1) {
          statusArray = ['Chờ người cho giao hàng', 'Chờ cộng tác viên lấy hàng'];
      } else if (status === 2) {
          statusArray = ['Hàng đã nhập kho', 'Hàng đang được đến lấy', 'Chờ người nhận lấy hàng'];
      } else if (status === 3) {
          statusArray = ['Người nhận đã nhận hàng', 'Hoàn tất'];
      } else if (status === 4) {
          statusArray = [];
      }
  } else if (locationOfItem === 2) {
      if (status === 1) {
          statusArray = ['Đã duyệt', 'Chờ người nhận lấy hàng'];
      } else if (status === 2) {
          statusArray = ['Người nhận đã nhận hàng', 'Hoàn tất'];
      } else if (status === 3) {
          statusArray = ['Hủy'];
      }
  }

  return { status: statusArray, method: methodArray };
}

export default function ViewOrders({ filterValue, locationOfItem, status }: any) {
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { userInfo } = useSelector((state: RootState) => state.userLogin);

  const userID = userInfo?.id;

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const effectData = async () => {
    if (userID === undefined) return;

    setIsLoading(true);
    try {
      const result = await getOrderListByStatus(
        userID,
        getStatusAndMethod(status, locationOfItem).status,
        getStatusAndMethod(status, locationOfItem).method,
        LIMIT,
        page - 1,
        status === 4,
        filterValue
      );
      setOrders(result.orders);
      setTotalItems(result.totalItems);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    effectData();
  }, [page, filterValue, locationOfItem, status, userID]);

  return (
    <Box>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {orders.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="h6">Không có đơn hàng nào</Typography>
            </Box>
          ) : (
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {orders.map((order: any, index: number) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <OrderCard order={order} />
                </Grid>
              ))}
            </Grid>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Stack>
              <Pagination count={Math.ceil(totalItems / LIMIT)} page={page} onChange={handleChange} />
            </Stack>
          </Box>
        </>
      )}
    </Box>
  );
}