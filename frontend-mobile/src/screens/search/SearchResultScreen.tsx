import { StyleSheet, Text, View, Image } from 'react-native'
import React, {useState, useEffect} from 'react'
import { ContainerComponent } from '../../components'
import CardItemResult from './CardItemResult'
import FilterSearch from './FilterSearch'
import postsAPI from '../../apis/postApi'
import axios, { AxiosResponse } from 'axios';
import { GetCurrentLocation } from '../../utils/GetCurrenLocation'
import { useSelector } from 'react-redux'
import { authSelector } from '../../redux/reducers/authReducers'
import userAPI from '../../apis/userApi'

// const data = [
//   {
//     "userid": "3",
//     "firstname": "John",
//     "lastname": "Mass",
//     "avatar": "https://source.unsplash.com/random",
//     "postid": "40",
//     "title": "Cho Cái Bàn Đẹp Nè",
//     "description": "UA Tech is our original go-to training gear: Under Armour men Tech polos are loose, light, and keep you cool. Basically, they are built to be everything you need",
//     "createdat": "2024-03-25 22:14:09.238764",
//     "address": "Đh Khoa Học Tự Nhiên",
//     "longitude": "106.68249312376167",
//     "latitude": "10.763025311133902",
//     "path": "https://m.media-amazon.com/images/I/617iMeLtb+L._AC_SX679_.jpg"
//   }
// ]

const LIMIT = 3;

export interface MyData {
  userid?: string;
  username?: string;
  firstname: string;
  lastname: string;
  avatar: string;
  postid: string;
  title?: string;
  description: string;
  createdat: string;
  address: string;
  longitude: string;
  latitude: string;
  path: string;
}

const SearchResultScreen = ({ route } : any) => {
  const auth = useSelector(authSelector);

  const { searchQuery } = route.params;
  const [isPosts, setIsPosts] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isEmpty, setIsEmpty] = useState(false);
  const [shouldFetchData, setShouldFetchData] = useState(false);
  const [likeNumber, setLikeNumber] = useState<number[]>([]);
  const [likesPosts, setLikePosts] = useState<number[]>([]);

  const [filterValue, setFilterValue] = useState({
    distance: 5,
    time: 14,
    category: "Tất cả",
    sort: "Mới nhất"
  })

  useEffect(() => {
    setShouldFetchData(true); // Đánh dấu rằng cần fetch dữ liệu mới
    setPage(0);
    setIsEmpty(false);
    setData([]);
  }, [filterValue, isPosts]);

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

      const response: AxiosResponse<MyData[]> = await postsAPI.HandlePost(
        `/search?keyword=${ searchQuery ? searchQuery.toLowerCase() : ''}&iswarehousepost=${!isPosts}&page=${page}&limit=${LIMIT}&distance=${filterValue.distance}&time=${filterValue.time}&category=${filterValue.category}&sort=${filterValue.sort}&latitude=${location.latitude}&longitude=${location.longitude}`,
        'get'
      );
      const newData: MyData[] = response.data;

      if (newData.length <= 0 && data.length <= 0)
        setIsEmpty(true)
      if (newData.length > 0)
        setPage(page + 1); // Tăng số trang lên

      setData((prevData) => [...prevData, ...newData]); // Nối dữ liệu mới với dữ liệu cũ

      const likes: number[] =  newData.length > 0 ? newData.map((item: any) => item.like_count) : [];
      
      setLikeNumber(likes);
  
    } catch (error) {
      console.error('Error fetching data:', error);
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

  return (
    <ContainerComponent back>
      <FilterSearch filterValue={filterValue} setFilterValue={setFilterValue} isPosts={isPosts} setIsPosts={setIsPosts}/>
      {
        isEmpty ? (
          <View style={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image
                source={require('../../../assets/images/shopping.png')}
                style={styles.image} 
                resizeMode="contain"
            />
          </View>
        ) : (
          <CardItemResult data={data} handleEndReached={handleEndReached} isLoading={isLoading} likesPosts={likesPosts} likeNumber={likeNumber} handleItemPress={handleItemPress} />
        )
      }
    </ContainerComponent>
  )
}

export default SearchResultScreen

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 80,
  }
})