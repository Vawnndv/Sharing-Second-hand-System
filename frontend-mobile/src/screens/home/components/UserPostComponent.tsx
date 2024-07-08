import moment from 'moment'
import 'moment/locale/vi'
import React, { useEffect, useRef, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import postsAPI from '../../../apis/postApi'
import { GetCurrentLocation } from '../../../utils/GetCurrenLocation'
import CardItemResult from '../../search/CardItemResult'
import { PostData } from '../../search/SearchResultScreen'
import { filterValue } from './ItemTabComponent'
import { useNavigation } from '@react-navigation/native'
import { limit } from 'firebase/firestore'
import { filter } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import userAPI from '../../../apis/userApi'
import { updateCountOrder } from '../../../redux/reducers/userReducers'
import { authSelector } from '../../../redux/reducers/authReducers'

interface Props {
  filterValue: filterValue;
  warehousesID: any
}
const UserPostComponent: React.FC<Props> = ({filterValue, warehousesID}) => {
  moment.locale();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const auth = useSelector(authSelector)


  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [shouldFetchData, setShouldFetchData] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [isEndOfData, setIsEndOfData] = useState(false);

  const LIMIT = 5;

  const handleRefresh = () => {
    setRefresh(prevRefresh => !prevRefresh);
  }

  useEffect(() => {
    setShouldFetchData(true); // Đánh dấu rằng cần fetch dữ liệu mới
    setPage(0);
    setIsEmpty(false);
    setData([]);
    setIsEndOfData(false);

  }, [filterValue, refresh])

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
        return;
      }
      
      const res: any = await postsAPI.HandlePost(
        `/user-post`,
        {
          page: page,
          limit: LIMIT,
          distance: filterValue.distance,
          time: filterValue.time,
          sort: filterValue.sort,
          latitude: location.latitude,
          longitude: location.longitude,
          category: filterValue.category,
          warehouses: warehousesID
        },
        'post'
      )
      const newData: PostData[] = res.allPosts;

      
        if (newData === null) {
          setIsEndOfData(true)
        } else {
          if (newData.length <= 0 && page === 0)
            setIsEmpty(true)
          if (newData.length <= 0 && data.length > 0)
            setIsEndOfData(true)
        }
  
        if (newData.length > 0){
          setPage(page + 1); // Tăng số trang lên
  
          setData((prevData) => [...prevData, ...newData]); // Nối dữ liệu mới với dữ liệu cũ
        }
          
        // dispatch(removeStatusReceivePost());
        getUserCountOrder();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserCountOrder = async () => {
    try {
      const response: any = await userAPI.HandleUser(`/get-count-order?userId=${auth.id}`);
      if(response.data === null){
        dispatch(updateCountOrder({"giveCount": "0", "receiveCount": "0"}));
      } else {
        dispatch(updateCountOrder(response.data));
      }
    } catch(error: any) {
      dispatch(updateCountOrder({"giveCount": "0", "receiveCount": "0"}));
    }
  }

  const handleEndReached = () => {
    if (!isLoading && !isEmpty && !isEndOfData) {
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
    <CardItemResult data={data} handleEndReached={handleEndReached} isLoading={isLoading} handleRefresh={handleRefresh}/>
  )
}

export default UserPostComponent


const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 80,
  }
})