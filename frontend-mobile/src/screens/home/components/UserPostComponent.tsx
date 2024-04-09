import { SimpleLineIcons } from '@expo/vector-icons'
import { Clock, Heart, Message } from 'iconsax-react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, Image, StyleSheet, View } from 'react-native'
import { AvatarComponent, RowComponent, SpaceComponent, TextComponent } from '../../../components'
import CardComponent from '../../../components/CardComponent'
import { appColors } from '../../../constants/appColors'
import { fontFamilies } from '../../../constants/fontFamilies'
import { globalStyles } from '../../../styles/globalStyles'
import { useNavigation, useRoute } from '@react-navigation/native'
import userAPI from '../../../apis/userApi'
import postsAPI from '../../../apis/postApi'
import LoadingComponent from '../../../components/LoadingComponent'
import moment from 'moment';
import 'moment/locale/vi';
import { useSelector } from 'react-redux'
import { authSelector } from '../../../redux/reducers/authReducers'
import { GetCurrentLocation } from '../../../utils/GetCurrenLocation'
import { MyData } from '../../search/SearchResultScreen'
import CardItemResult from '../../search/CardItemResult'

const itemList: any = [
  {
    name: 'julia',
    time: '1 hour',
    address: 'Quận 5, thành phố Hồ Chí Minh',
    description: 'Chiếc ghế này không chỉ là một sản phẩm nội thất đơn thuần mà còn là một trải nghiệm thoải mái và thú vị. Được chọn lựa với sự kỹ lưỡng ...',
    image: 'https://erado.vn/img/i/ghe-an-boc-da-ma-b448-20381.jpg',
  },
  {
    name: 'julia',
    time: '1 hour',
    address: 'Quận 5, thành phố Hồ Chí Minh',
    description: 'Chiếc ghế này không chỉ là một sản phẩm nội thất đơn thuần mà còn là một trải nghiệm thoải mái và thú vị. Được chọn lựa với sự kỹ lưỡng ...',
    image: 'https://erado.vn/img/i/ghe-an-boc-da-ma-b448-20381.jpg',
  },
  {
    name: 'julia',
    time: '1 hour',
    address: 'Quận 5, thành phố Hồ Chí Minh',
    description: 'Chiếc ghế này không chỉ là một sản phẩm nội thất đơn thuần mà còn là một trải nghiệm thoải mái và thú vị. Được chọn lựa với sự kỹ lưỡng ...',
    image: 'https://erado.vn/img/i/ghe-an-boc-da-ma-b448-20381.jpg',
  },
]

interface Posts {
  avatar: string;
  username: string;
  firstname: string; 
  lastname: string; 
  description: string; 
  updatedat: string; 
  createdat: string;
  postid: string;
  location: string;
  path: string;
};


const UserPostComponent = () => {
  moment.locale();
  const auth = useSelector(authSelector);

  const route = useRoute();
  const params: any = route.params;
  const filterValue = params.filterValue;

  const navigation: any = useNavigation();
  const [likeNumber, setLikeNumber] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [likesPosts, setLikePosts] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [shouldFetchData, setShouldFetchData] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const LIMIT = 3;

  useEffect(() => {
    setShouldFetchData(true); // Đánh dấu rằng cần fetch dữ liệu mới
    getUserLikePosts();
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
      
      const res: any = await postsAPI.HandlePost(`/user-post?page=${page}&limit=${LIMIT}&distance=${filterValue.distance}&time=${filterValue.time}&category=${filterValue.category}&sort=${filterValue.sort}&latitude=${location.latitude}&longitude=${location.longitude}`);
      console.log(res)
      const newData: MyData[] = res.allPosts;

      if (newData.length <= 0 && data.length <= 0)
        setIsEmpty(true)
      if (newData.length > 0)
        setPage(page + 1); // Tăng số trang lên

      setData((prevData) => [...prevData, ...newData]); // Nối dữ liệu mới với dữ liệu cũ

      const newLikeNumber: number[] = Array.isArray(res.allPosts) && res.allPosts.length > 0 ? res.allPosts.map((item: any) => item.like_count) : [];
      
      setLikeNumber((prevData) => [...prevData, ...newLikeNumber]);
  
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

  const getUserLikePosts = async () => {
    const res: any = await userAPI.HandleUser(`/get-like-posts?userId=${auth.id}`);
    const postIds: number[] = Array.isArray(res.data) && res.data.length > 0 ? res.data.map((item: any) => item.postid) : [];

    setLikePosts(postIds);
  }

  const setUserLikePosts = async (index: number) => {
    const newLikePosts = [...likesPosts];
    newLikePosts.push(data[index].postid);
    setLikePosts(newLikePosts);

    const newLikeNumber = [...likeNumber];
    newLikeNumber[index] += 1;
    setLikeNumber(newLikeNumber);

    try {
      const res: any = await userAPI.HandleUser(`/update-like-post?userId=${auth.id}`, {userId: auth.id, postId: data[index].postid}, 'post');
    } catch (error) {
      console.log(error);
    }
  }

  const deleteUserLikePosts = async (index: number) => {
    let newLikePosts = [...likesPosts];
    newLikePosts = newLikePosts.filter(item => item !== data[index].postid);
    setLikePosts(newLikePosts);

    const newLikeNumber = [...likeNumber];
    newLikeNumber[index] -= 1;
    setLikeNumber(newLikeNumber);

    try {
      const res: any = await userAPI.HandleUser(`/delete-like-post?userId=${auth.id}&postId=${data[index].postid}`, null,'delete');
    } catch (error) {
      console.log(error);
    }
  }

  const handleItemPress = (index: number) => {
    if ( likesPosts.includes(data[index].postid)) {
      deleteUserLikePosts(index);
    } else {
      setUserLikePosts(index);
    }
  };

  return isEmpty ? (
    <View style={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Image
          source={require('../../../../assets/images/shopping.png')}
          style={styles.image} 
          resizeMode="contain"
      />
    </View>
  ) : (
    <CardItemResult data={data} handleEndReached={handleEndReached} isLoading={isLoading} likesPosts={likesPosts} likeNumber={likeNumber} handleItemPress={handleItemPress} />
  )
}

export default UserPostComponent


const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 80,
  }
})