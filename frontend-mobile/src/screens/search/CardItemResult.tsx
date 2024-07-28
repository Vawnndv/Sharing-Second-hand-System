import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator, RefreshControl  } from 'react-native';
import { Clock, Heart, Message } from 'iconsax-react-native'
import { SimpleLineIcons } from '@expo/vector-icons'
import { AvatarComponent, RowComponent, SpaceComponent, TextComponent } from '../../components';
import CardComponent from '../../components/CardComponent';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { globalStyles } from '../../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import { formatDateTime } from '../../utils/FormatDateTime';
import moment from 'moment';
import 'moment/locale/vi';
import userAPI from '../../apis/userApi';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducers';
import LoadingComponent from '../../components/LoadingComponent';
import { addStatusLikePost, removeStatusLikePost, removeStatusReceivePost, updateIsLikePostRefresh, userSelector } from '../../redux/reducers/userReducers';

export interface DataItem {
  userid: string;
  iswarehousepost: boolean;
  avatar: string;
  postid: number;
  title: string;
  description: string;
  createdat: string;
  address: string;
  longitude: string;
  latitude: string;
  path: string;
  like_count: number;
  name: string;
  receiver_count: number;
}

interface Props {
  data: DataItem[];
  isLoading: boolean;
  handleEndReached: () => void;
  setData?: (newData: any[]) => void;
  isRefresh?: boolean;
  handleRefresh?: any;
  isPosts?: boolean;
}

const CardItemResult: React.FC<Props> = ({ data, handleEndReached, isLoading, setData, isRefresh, handleRefresh, isPosts }) => {
  moment.locale();
  const auth = useSelector(authSelector);
  const user = useSelector(userSelector);

  const navigation: any = useNavigation();
  const dispatch = useDispatch();

  const [likeNumber, setLikeNumber] = useState<number[]>([]);
  const [receiveNumber, setReceiveNumber] = useState<number[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Giả sử bạn load lại dữ liệu từ API
    setTimeout(() => {
      // Ví dụ này chỉ là load lại dữ liệu cũ, bạn có thể thay thế bằng API call
      handleRefresh()
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // getUserLikePosts();
    const newLikeNumber: number[] = data.length > 0 ? data.map((item: any) => {
      if (user.statusLikePosts && user.statusLikePosts.length > 0) {
        user.statusLikePosts.forEach((element: number) => {
          if (Math.abs(element) === Math.abs(item.postid)) {
            if (element > 0) {
              item.like_count += 1;
            } else {
              item.like_count -= 1;
            }
          }
        });
      }

      return item.like_count;
    }) : [];
    setLikeNumber(newLikeNumber);
    dispatch(removeStatusLikePost());
  }, [data, user.likePosts])


  useEffect(() => {
    const newReceiveNumber: number[] = data.length > 0 ? data.map((item: any) =>{
      if (user.statsReceivePosts && user.statsReceivePosts.length > 0) {
        user.statsReceivePosts.forEach((element: number) => {
          if (Math.abs(element) === Math.abs(item.postid)) {
            if (element > 0) {
              item.receiver_count += 1;
            } else {
              item.receiver_count -= 1;
            }
          }
        });
      }
      
      return item.receiver_count
    }) : [];
    setReceiveNumber(newReceiveNumber);
    dispatch(removeStatusReceivePost());
  }, [data, user.receivePosts])

  const setUserLikePosts = async (index: number) => {
    dispatch(addStatusLikePost(data[index].postid));

    try {
      const res: any = await userAPI.HandleUser(`/update-like-post?userId=${auth.id}`, {userId: auth.id, postId: data[index].postid}, 'post');
    } catch (error) {
      console.log(error);
    }
  }

  const deleteUserLikePosts = async (index: number) => {
    if (isRefresh && setData) {
      const newData = [...data];
      newData.splice(index, 1); 
      setData(newData);
    } else {
      dispatch(updateIsLikePostRefresh(true));
    }
    
    dispatch(addStatusLikePost(-Math.abs(data[index].postid)));

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
    if (user.likePosts.includes(data[index].postid)) {
      deleteUserLikePosts(index);
    } else {
      setUserLikePosts(index);
    }
  };

  // Filter data based on isPosts prop
  const filteredData = data.filter((item) => {
    if (isPosts === true) {
      return !item.iswarehousepost;
    } else if (isPosts === false) {
      return item.iswarehousepost === true;
    }
    return true;
  });

  return (
    <FlatList
      data={filteredData}
      renderItem={({item, index}) => (
        <CardComponent 
          key={index}
          color={appColors.white4}
          isShadow
          onPress={() => navigation.navigate('ItemDetailScreen', {
            postID : item.postid,
            handleRefresh: handleRefresh
          })}
        >
          <RowComponent
          styles={styles.rowComponent}>
            <AvatarComponent
              username={"item.name"} 
              avatar={item.avatar}
              size={50}
              onPress={() => {
                !item.iswarehousepost && navigation.navigate(
                  'ProfileScreen',
                  {
                    id: item.userid,
                    // isNavigate
                  },
                );
              }}
              styles={styles.avatar}
            />
            <SpaceComponent width={12} />
            <View style={[globalStyles.col]}>
              <RowComponent>
                <TextComponent text={item.name} size={16} font={fontFamilies.medium} />
                <SpaceComponent width={10} />
                <RowComponent>
                  <Clock size={14} color={appColors.black} />
                  <SpaceComponent width={4} />
                  <TextComponent text={`${moment(item.createdat).subtract(7, 'hours').fromNow()}`} font={fontFamilies.light} />
                </RowComponent>
              </RowComponent>
              <SpaceComponent height={4} />
              <RowComponent>
                <SimpleLineIcons name="location-pin" size={14} color={appColors.black} />
                <SpaceComponent width={4} />
                <View style={styles.container}>
                  <TextComponent numberOfLines={1} text={item.address} />
                </View>
              </RowComponent>
            </View>
          </RowComponent>
          <SpaceComponent height={8} />
          <TextComponent numberOfLines={2} styles={styles.description} text={item.description} />
          <SpaceComponent height={8} />
          {item.path && 
            <Image
              style={{width: '100%', height: 170, resizeMode: 'cover'}}
              source={{ uri: item.path }}
            />  
          }
          <View style={{paddingHorizontal: 12}}>
          <RowComponent justify='flex-end' 
            styles={globalStyles.bottomCard}>
            <RowComponent>
              <Message size={24} color={appColors.primary} variant={user.receivePosts.includes(item.postid) ? 'Bold' : 'Outline'} />
              <SpaceComponent width={4} />
              <TextComponent
                size={14}
                text={`${receiveNumber[index]} Người xin`} 
                font={fontFamilies.medium}
              />

            </RowComponent>
            <SpaceComponent width={16} />
            <RowComponent key={`like-${item.postid}`} onPress={() => handleItemPress(index)}>
              <Heart size={24} color={appColors.heart} variant={user.likePosts.includes(item.postid) ? 'Bold' : 'Outline' }/>
              <SpaceComponent width={4} />
              <TextComponent size={14} text={`${likeNumber[index]} Thích`} font={fontFamilies.medium} /> 
            </RowComponent>
          </RowComponent>
          </View>
          
        </CardComponent>
      )}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={handleEndReached} // Khi người dùng kéo xuống cuối cùng
      onEndReachedThreshold={0.1} // Kích hoạt khi còn 10% phía dưới còn lại của danh sách
      ListFooterComponent={isLoading ? <LoadingComponent isLoading={isLoading} /> : null} // Hiển thị indicator khi đang tải dữ liệu
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  )
}

export default CardItemResult;

const styles = StyleSheet.create({
  container: {
    width: '95%', // Đảm bảo phần tử cha có chiều rộng 100%
    overflow: 'hidden', // Ẩn văn bản bị tràn ra ngoài phần tử cha
  },
  avatar: {
    
  },
  rowComponent: {
    paddingHorizontal: 12,
    paddingTop: 12
  },
  description: {
    paddingHorizontal: 12,
  }

});
