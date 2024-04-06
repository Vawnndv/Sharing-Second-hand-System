import { SimpleLineIcons } from '@expo/vector-icons'
import { Clock, Heart, Message } from 'iconsax-react-native'
import React from 'react'
import { FlatList, Image, View } from 'react-native'
import { AvatarComponent, RowComponent, SpaceComponent, TextComponent } from '../../../components'
import CardComponent from '../../../components/CardComponent'
import { appColors } from '../../../constants/appColors'
import { fontFamilies } from '../../../constants/fontFamilies'
import { globalStyles } from '../../../styles/globalStyles'

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
  return (
    <FlatList
      data={itemList}
      renderItem={({item, index}) => (
        <CardComponent 
          key={`event${index}`}
          isShadow
          color={appColors.white4}
        >
          <RowComponent justify='flex-start'>
            <AvatarComponent
              username={item.name} 
              size={50}
            />
            <SpaceComponent width={12} />
            <View style={[globalStyles.col]}>
              <RowComponent justify='flex-start'>
                <TextComponent text='julia' size={18} font={fontFamilies.medium}/>
                <SpaceComponent width={10} />
                <RowComponent justify='flex-start'>
                  <Clock size={14} color={appColors.black} />
                  <SpaceComponent width={4} />
                  <TextComponent text={item.time} font={fontFamilies.light} />
                </RowComponent>
              </RowComponent>
              <SpaceComponent height={4} />
              <RowComponent justify='flex-start'>
                <SimpleLineIcons name="location-pin" size={14} color={appColors.black} />
                <SpaceComponent width={4} />
                <TextComponent text={item.address} />
              </RowComponent>
            </View>
          </RowComponent>
          <SpaceComponent height={8} />
          <TextComponent text={item.description} />
          <SpaceComponent height={8} />
          <Image
            style={{width: '100%', height: 160, resizeMode: 'cover'}}
            source={{ uri: item.image }}
          />
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
  )
}

export default WarehouseComponent