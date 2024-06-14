/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress } from '@mui/material';
import { getOrdersCollaborator } from '../../../redux/services/inventoryServices';
import InventoryCard from '../InventoryCard';

const userID = '30'
const categoryQuery = 'Tất cả'
const category = [
  "Quần áo",
  "Giày dép",
  "Đồ nội thất",
  "Công cụ",
  "Dụng cụ học tập",
  "Thể thao",
  "Khác"
]

function OutputCardScreen({searchQuery, filterValue}: any) {
  const [inventoryList, setInventoryList] = useState([]);
  const [tab, setTab] = useState('Hàng đang được đến lấy')
  const [loading, setLoading] = useState(true);
  
  const fetchInventoryList = async () => {
    try {
      setLoading(true)
      const response = await getOrdersCollaborator(userID, tab, filterValue, categoryQuery, searchQuery, "outputcard");
      setInventoryList(response.orders);
      setLoading(false); // Set loading state to false after fetching data
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setLoading(false); // Set loading state to false in case of error
    }
  };
  useEffect(() => {
    fetchInventoryList();
  }, [filterValue]);

  return (
    <Grid container spacing={2}>
      {loading ? (
        // Hiển thị một vòng tròn tiến trình khi đang tải dữ liệu
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        // Render mỗi mục trong inventoryList vào component InventoryCard
        inventoryList.map((item, index) => (
          <Grid item key={index} xs={12}>
            <InventoryCard typeCard="outputcard" data={item} />
          </Grid>
        ))
      )}
    </Grid>
  );
}

export default OutputCardScreen