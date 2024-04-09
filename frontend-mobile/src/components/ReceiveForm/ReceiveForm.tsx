import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { appInfo } from '../../constants/appInfos';

interface Props {
  method: string;
  postID: number
}


interface Warehouse {
  warehouseid: number;
  address: string;
  warehousename: string;
}


interface FormData {
  warehouseName: string;
  warehouseAddress: string;
  owmerName: string;
  ownerPhone: string;
  receiverName: string;
  giveType: string;
  address: string;
  // Định nghĩa thêm các thuộc tính khác ở đây nếu cần
}




export const ReceiveForm: React.FC<Props> = ({ method, postID }) => {

  const [isLoading, setIsLoading] = useState(false);

  const [wareHouses, setWarehouses] = useState<Warehouse[]>([]);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${appInfo.BASE_URL}/warehouses`)
        // const res = await postsAPI.HandlePost(
        //   `/${postID}`,
        // );
        if (!res) {
          throw new Error('Failed to fetch warehouses'); // Xử lý lỗi nếu request không thành công
        }
        console.log(res.data.wareHouses);
        setWarehouses(res.data.wareHouses); // Cập nhật state với dữ liệu nhận được từ API
      } catch (error) {
        console.error('Error fetching warehouses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWarehouses();
}, [])

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
}
  return (
    <View>
      <Text>Bạn đã chọn phương thức: {method}</Text>
      <Text>Bài đăng: {postID}</Text>
      {/* Render form tương ứng với phương thức đã chọn */}
    </View>
  );
};