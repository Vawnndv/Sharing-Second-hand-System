import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator  } from 'react-native';
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
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducers';

interface DataItem {
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
}

interface Props {
  data: DataItem[];
  isLoading: boolean;
  handleEndReached: () => void;
  setData?: (newData: any[]) => void;
  isRefresh?: boolean;
}

const CardItemResult: React.FC<Props> = ({ data, handleEndReached, isLoading, setData, isRefresh }) => {
  moment.locale();

  const auth = useSelector(authSelector);
  const navigation: any = useNavigation();

  const [likeNumber, setLikeNumber] = useState<number[]>([]);
  const [likesPosts, setLikePosts] = useState<number[]>([]);

  // useEffect(() => {
  //   getUserLikePosts();
  // }, []);

  useEffect(() => {
    getUserLikePosts();
    const newLikeNumber: number[] = data.length > 0 ? data.map((item: any) => item.like_count) : [];
      
    setLikeNumber(newLikeNumber);

  }, [data])
  
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
    if (isRefresh && setData) {
      const newData = [...data];
      newData.splice(index, 1); 
      setData(newData);
    }
    
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
    <FlatList
      data={data}
      renderItem={({item, index}) => (
        <CardComponent 
          key={index}
          color={appColors.white4}
          isShadow
          onPress={() => navigation.navigate('ItemDetailScreen', {
            postId : item.postid,
          })}
        >
          <RowComponent>
            <AvatarComponent
              username={item.name} 
              avatar={item.avatar}
              size={50}
              onPress={() => {
                console.log('abcdefgh', item.iswarehousepost);
                !item.iswarehousepost && navigation.navigate('Profile', {
                  screen: 'ProfileScreen',
                  params: {
                    id: item.userid
                  },
                });
              }}
            />
            <SpaceComponent width={12} />
            <View style={[globalStyles.col]}>
              <RowComponent>
                <TextComponent text={item.name} size={16} font={fontFamilies.medium} />
                <SpaceComponent width={10} />
                <RowComponent>
                  <Clock size={14} color={appColors.black} />
                  <SpaceComponent width={4} />
                  <TextComponent text={`${moment(item.createdat).fromNow()}`} font={fontFamilies.light} />
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
          <TextComponent text={item.description} />
          <SpaceComponent height={8} />
          {item.path && 
            <Image
              style={{width: '100%', height: 160, resizeMode: 'cover'}}
              source={{ uri: item.path }}
            />  
          }
          <RowComponent justify='flex-end' 
            styles={globalStyles.bottomCard}>
            <RowComponent>
              <Message size={24} color={appColors.black}/>
              <SpaceComponent width={4} />
              <TextComponent size={14} text='0 Người xin' font={fontFamilies.medium} /> 
            </RowComponent>
            <SpaceComponent width={16} />
            <RowComponent key={`like-${item.postid}`} onPress={() => handleItemPress(index)}>
              <Heart size={24} color={appColors.black} variant={likesPosts.includes(item.postid) ? 'Bold' : 'Outline' }/>
              <SpaceComponent width={4} />
              <TextComponent size={14} text={`${likeNumber[index]} Thích`} font={fontFamilies.medium} /> 
            </RowComponent>
          </RowComponent>
        </CardComponent>
      )}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={handleEndReached} // Khi người dùng kéo xuống cuối cùng
      onEndReachedThreshold={0.1} // Kích hoạt khi còn 10% phía dưới còn lại của danh sách
      ListFooterComponent={isLoading ? <ActivityIndicator size="large" color="#000" style={{ marginTop: 10 }} /> : null} // Hiển thị indicator khi đang tải dữ liệu
    />
  )
}

export default CardItemResult;

const styles = StyleSheet.create({
  container: {
    width: '95%', // Đảm bảo phần tử cha có chiều rộng 100%
    overflow: 'hidden', // Ẩn văn bản bị tràn ra ngoài phần tử cha
  },

});
