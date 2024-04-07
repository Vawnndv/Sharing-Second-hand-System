import { SimpleLineIcons } from '@expo/vector-icons'
import { Clock, Heart, Message } from 'iconsax-react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, Image, View } from 'react-native'
import { AvatarComponent, RowComponent, SpaceComponent, TextComponent } from '../../../components'
import CardComponent from '../../../components/CardComponent'
import { appColors } from '../../../constants/appColors'
import { fontFamilies } from '../../../constants/fontFamilies'
import { globalStyles } from '../../../styles/globalStyles'
import postsAPI from '../../../apis/postApi'
import { useNavigation } from '@react-navigation/native'
import LoadingComponent from '../../../components/LoadingComponent'
import moment from 'moment'
import 'moment/locale/vi';

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


const WarehouseComponent = () => {
  const navigation: any = useNavigation();
  const [posts, setPosts] = useState<any>([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getAllPosts();
  }, [])

  const getAllPosts = async () => {
    setIsLoading(true);
    try {
      const res: any = await postsAPI.HandlePost('/warehouse/all');
      setPosts(res.allPosts);
      console.log(posts)
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  } 
  
  return posts ? (
    <FlatList
      data={posts}
      renderItem={({item, index}) => (
        <CardComponent 
          key={`posts${index}`}
          isShadow
          color={appColors.white4}
        >
          <RowComponent>
            <AvatarComponent
              username={item.warehousename} 
              size={50}
            />
            <SpaceComponent width={12} />
            <View style={[globalStyles.col]}>
              <RowComponent>
                <TextComponent text={item.warehousename} size={18} font={fontFamilies.medium}/>
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
          <RowComponent justify='flex-end' styles={{padding: 12, backgroundColor: appColors.white5, margin: -12, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, marginTop: 8}}>
            <RowComponent>
              <Message size={18} color={appColors.black}/>
              <SpaceComponent width={4} />
              <TextComponent size={14} text='2 Receiver' font={fontFamilies.medium} /> 
            </RowComponent>
            <SpaceComponent width={16} />
            <RowComponent>
              <Heart size={18} color={appColors.black}/>
              <SpaceComponent width={4} />
              <TextComponent size={14} text='10 Loves' font={fontFamilies.medium} /> 
            </RowComponent>
          </RowComponent>
        </CardComponent>
      )}
    />
  ) : (
    <LoadingComponent isLoading={isLoading} values={posts.length} message='Không có bài đăng nào!' />
  )
}

export default WarehouseComponent