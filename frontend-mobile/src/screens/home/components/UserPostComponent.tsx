import { SimpleLineIcons } from '@expo/vector-icons'
import { Clock, Heart, Message } from 'iconsax-react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, Image, StyleSheet, View } from 'react-native'
import { AvatarComponent, RowComponent, SpaceComponent, TextComponent } from '../../../components'
import CardComponent from '../../../components/CardComponent'
import { appColors } from '../../../constants/appColors'
import { fontFamilies } from '../../../constants/fontFamilies'
import { globalStyles } from '../../../styles/globalStyles'
import { useNavigation } from '@react-navigation/native'
import userAPI from '../../../apis/userApi'
import postsAPI from '../../../apis/postApi'
import LoadingComponent from '../../../components/LoadingComponent'
import moment from 'moment';
import 'moment/locale/vi';
import { useSelector } from 'react-redux'
import { authSelector } from '../../../redux/reducers/authReducers'

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

  const navigation: any = useNavigation();
  const [posts, setPosts] = useState<any>([]);
  const [likeNumber, setLikeNumber] = useState<number[]>([]);;
  const [isLoading, setIsLoading] = useState(false);
  const [likesPosts, setLikePosts] = useState<number[]>([]);

  useEffect(() => {
    getAllPosts();
    getUserLikePosts();
  }, [])

  const getAllPosts = async () => {
    setIsLoading(true);
    try {
      const res: any = await postsAPI.HandlePost('/user-post/all');
      setPosts(res.allPosts);
      const likes: number[] = Array.isArray(res.allPosts) && res.allPosts.length > 0 ? res.allPosts.map((item: any) => item.like_count) : [];
      
      setLikeNumber(likes);
  
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  } 

  const getUserLikePosts = async () => {
    const res: any = await userAPI.HandleUser(`/get-like-posts?userId=${auth.id}`);
    const postIds: number[] = Array.isArray(res.data) && res.data.length > 0 ? res.data.map((item: any) => item.postid) : [];

    setLikePosts(postIds);
  }

  const setUserLikePosts = async (index: number) => {
    const newLikePosts = [...likesPosts];
    newLikePosts.push(posts[index].postid);
    setLikePosts(newLikePosts);

    const newLikeNumber = [...likeNumber];
    newLikeNumber[index] += 1;
    setLikeNumber(newLikeNumber);

    try {
      const res: any = await userAPI.HandleUser(`/update-like-post?userId=${auth.id}`, {userId: auth.id, postId: posts[index].postid}, 'post');
    } catch (error) {
      console.log(error);
    }
  }

  const deleteUserLikePosts = async (index: number) => {
    let newLikePosts = [...likesPosts];
    newLikePosts = newLikePosts.filter(item => item !== posts[index].postid);
    setLikePosts(newLikePosts);

    const newLikeNumber = [...likeNumber];
    newLikeNumber[index] -= 1;
    setLikeNumber(newLikeNumber);

    try {
      const res: any = await userAPI.HandleUser(`/delete-like-post?userId=${auth.id}&postId=${posts[index].postid}`, null,'delete');
    } catch (error) {
      console.log(error);
    }
  }

  const handleItemPress = (index: number) => {
    if ( likesPosts.includes(posts[index].postid)) {
      deleteUserLikePosts(index);
    } else {
      setUserLikePosts(index);
    }
  };

  return posts ? (
    <FlatList
      data={posts}
      renderItem={({item, index}) => (
        <CardComponent 
          key={item.postid}
          color={appColors.white4}
          isShadow
          onPress={() => navigation.navigate('ItemDetailScreen')}
        >
          <RowComponent>
            <AvatarComponent
              username={item.username} 
              size={50}
            />
            <SpaceComponent width={12} />
            <View style={[globalStyles.col]}>
              <RowComponent>
                <TextComponent text={item.username} size={18} font={fontFamilies.medium} />
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
                <TextComponent text={item.address} />
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
              <TextComponent size={14} text='2 Receiver' font={fontFamilies.regular} /> 
            </RowComponent>
            <SpaceComponent width={16} />
          <RowComponent key={`like-${item.postid}`} onPress={() => handleItemPress(index)}>
              <Heart size={24} color={appColors.black} variant={likesPosts.includes(item.postid) ? 'Bold' : 'Outline' }/>
              <SpaceComponent width={4} />
              <TextComponent size={14} text={`${likeNumber[index]} Loves`} font={fontFamilies.regular} /> 
            </RowComponent>
          </RowComponent>
        </CardComponent>
      )}
    />
  ) : (
    <LoadingComponent isLoading={isLoading} values={posts.length} message='Không có bài đăng nào!' />
  )
}

export default UserPostComponent
