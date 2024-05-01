/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress } from '@mui/material';
import InventoryCard from './InventoryCard';
import { getOrdersCollaborator } from '../../redux/services/inventoryServices';

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

function ViewInventoryList({typeCard, status} : any) {
  const [inventoryList, setInventoryList] = useState([]);
  const [tab, setTab] = useState('Hàng đang được đến lấy')
  const [loading, setLoading] = useState(true);
  const [filterValue, setFilterValue] = useState({
    distance: 'Tất cả',
    time: 'Tất cả',
    // eslint-disable-next-line object-shorthand
    category: category,
    sort: 'Mới nhất'
})
  
  const fetchInventoryList = async () => {
    try {
      const response = await getOrdersCollaborator(userID, tab, filterValue, categoryQuery);
      setInventoryList(response.orders);
      setLoading(false); // Set loading state to false after fetching data
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setLoading(false); // Set loading state to false in case of error
    }
  };
  useEffect(() => {

    fetchInventoryList();
  }, []);

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
            <InventoryCard data={item} />
          </Grid>
        ))
      )}
    </Grid>
  );
}

export default ViewInventoryList;
