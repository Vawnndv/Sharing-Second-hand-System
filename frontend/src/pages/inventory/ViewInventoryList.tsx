/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress, Box, Typography } from '@mui/material';
import InventoryCard from './InventoryCard';
import { getOrdersCollaborator } from '../../redux/services/inventoryServices';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const categoryQuery = 'Tất cả'

function ViewInventoryList({searchQuery, filterValue, typeCard, status} : any) {
  const [inventoryList, setInventoryList] = useState([]);
  const [tab, setTab] = useState<any>(null)
  const [loading, setLoading] = useState(true);

  const { userInfo } = useSelector(
    (state: RootState) => state.userLogin
  );

  const userID = userInfo?.id
  
  const fetchInventoryList = async () => {
    if (userID === undefined)
      return

    try {
      setLoading(true);
      const response = await getOrdersCollaborator(userID, tab, filterValue, categoryQuery, searchQuery, "inputcard");
      setInventoryList(response.orders);
      setLoading(false); // Set loading state to false after fetching data
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setLoading(false); // Set loading state to false in case of error
    }
  };
  useEffect(() => {
    fetchInventoryList();
  }, [tab, searchQuery, filterValue]);

  useEffect(() => {
    if (status === 1) {
      setTab('Hàng đang được đến lấy')
    } else if (status === 2) {
      setTab('Hàng đã nhập kho')
    } else {
      setTab('Chờ người cho giao hàng')
    }
  }, []);

  return (
    <Grid container spacing={2}>
      {loading ? (
        // Hiển thị một vòng tròn tiến trình khi đang tải dữ liệu
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : inventoryList.length === 0 ? (
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h6">Không có phiếu nào</Typography>
        </Grid>
      ) :(
        // Render mỗi mục trong inventoryList vào component InventoryCard
        inventoryList.map((item, index) => (
          <Grid item key={index} xs={12}>
            <InventoryCard data={item} />
          </Grid>
        ))
      )}
    </Grid>
  );
}

export default ViewInventoryList;
