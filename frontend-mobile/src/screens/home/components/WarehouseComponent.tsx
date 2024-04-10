import moment from 'moment'
import 'moment/locale/vi'
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import postsAPI from '../../../apis/postApi'
import { GetCurrentLocation } from '../../../utils/GetCurrenLocation'
import CardItemResult from '../../search/CardItemResult'
import { MyData } from '../../search/SearchResultScreen'
import { filterValue } from './ItemTabComponent'
const itemList: any = [
  {
    name: 'Kho số 1',
    time: '1 hour',
    address: 'Quận 5, thành phố Hồ Chí Minh',
    description: 'Chiếc ghế này không chỉ là một sản phẩm nội thất đơn thuần mà còn là một trải nghiệm thoải mái và thú vị. Được chọn lựa với sự kỹ lưỡng ...',
    image: 'https://erado.vn/img/i/ghe-an-boc-da-ma-b448-20381.jpg',
  },
  {
    name: 'Kho số 2',
    time: '1 hour',
    address: 'Quận 5, thành phố Hồ Chí Minh',
    description: 'Chiếc ghế này không chỉ là một sản phẩm nội thất đơn thuần mà còn là một trải nghiệm thoải mái và thú vị. Được chọn lựa với sự kỹ lưỡng ...',
    image: 'https://erado.vn/img/i/ghe-an-boc-da-ma-b448-20381.jpg',
  },
  {
    name: 'Kho số 3',
    time: '1 hour',
    address: 'Quận 5, thành phố Hồ Chí Minh',
    description: 'Chiếc ghế này không chỉ là một sản phẩm nội thất đơn thuần mà còn là một trải nghiệm thoải mái và thú vị. Được chọn lựa với sự kỹ lưỡng ...',
    image: 'https://erado.vn/img/i/ghe-an-boc-da-ma-b448-20381.jpg',
  },
]

interface Props {
  filterValue: filterValue;
}

const WarehouseComponent: React.FC<Props> = ({filterValue}) => {
 
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [shouldFetchData, setShouldFetchData] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const LIMIT = 5;

  useEffect(() => {
    setShouldFetchData(true); // Đánh dấu rằng cần fetch dữ liệu mới
    setPage(0);
    setIsEmpty(false);
    setData([]);

  }, [filterValue])

  useEffect(() => {
    if (shouldFetchData) {
      fetchData(); // Fetch dữ liệu chỉ khi shouldFetchData là true
      setShouldFetchData(false); // Đặt lại shouldFetchData về false sau khi đã fetch dữ liệu
    }
  }, [shouldFetchData]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let location = await GetCurrentLocation();
      if (!location) {
        console.log("Failed to get location.");
        return;
      }
      
      const res: any = await postsAPI.HandlePost(`/warehouse?page=${page}&limit=${LIMIT}&distance=${filterValue.distance}&time=${filterValue.time}&category=${filterValue.category}&sort=${filterValue.sort}&latitude=${location.latitude}&longitude=${location.longitude}`);

      const newData: MyData[] = res.allPosts;

      if (newData.length <= 0 && data.length <= 0)
        setIsEmpty(true)
      if (newData.length > 0)
        setPage(page + 1); // Tăng số trang lên

      setData((prevData) => [...prevData, ...newData]); // Nối dữ liệu mới với dữ liệu cũ

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndReached = () => {
    if (!isLoading && !isEmpty) {
      fetchData(); // Khi người dùng kéo xuống cuối cùng của danh sách, thực hiện fetch dữ liệu mới
    }
  };


  return isEmpty ? (
    <View style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={require('../../../../assets/images/shopping.png')}
        style={styles.image} 
        resizeMode="contain"
      />
    </View>
  ) : (
    <CardItemResult data={data} handleEndReached={handleEndReached} isLoading={isLoading} />
  )
}

export default WarehouseComponent

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 80,
  }
})