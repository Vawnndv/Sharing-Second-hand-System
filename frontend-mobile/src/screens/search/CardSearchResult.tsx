import React, { useState } from 'react';
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

interface DataItem {
  userid: string;
  firstname: string;
  lastname: string;
  avatar: string;
  postid: string;
  title: string;
  description: string;
  createdat: string;
  address: string;
  longitude: string;
  latitude: string;
  path: string;
}

interface Props {
  data: DataItem[];
  isLoading: boolean;
  handleEndReached: () => void;
}

const CardSearchResult: React.FC<Props> = ({ data, handleEndReached, isLoading }) => {
  const navigation: any = useNavigation();

  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  const handleItemPress = ({index} : any) => {
    console.log(123);
    setSelectedItemIndex(index);
  };

  return (
    <FlatList
      data={data}
      renderItem={({item, index}) => (
        <CardComponent 
          key={index}
          color={appColors.white4}
          isShadow
          onPress={() => navigation.navigate('ItemDetailScreen')}
        >
          <RowComponent>
            <AvatarComponent
              username={item.firstname ? item.firstname : 'A'} 
              avatar={item.avatar}
              size={50}
            />
            <SpaceComponent width={12} />
            <View style={[globalStyles.col]}>
              <RowComponent>
                <TextComponent text={item.firstname} size={18} font={fontFamilies.medium} />
                <SpaceComponent width={5} />
                <TextComponent text={item.lastname} size={18} font={fontFamilies.medium} />
                <SpaceComponent width={10} />
                <RowComponent>
                  <Clock size={14} color={appColors.black} />
                  <SpaceComponent width={4} />
                  <TextComponent text={formatDateTime(item.createdat)} font={fontFamilies.light} />
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
          <Image
            style={{width: '100%', height: 160, resizeMode: 'cover'}}
            source={{ uri: item.path }}
          />
          <RowComponent justify='flex-end' 
            styles={globalStyles.bottomCard}>
            <RowComponent>
              <Message size={18} color={appColors.black}/>
              <SpaceComponent width={4} />
              <TextComponent size={14} text='2 Receiver' font={fontFamilies.medium} /> 
            </RowComponent>
            <SpaceComponent width={16} />
            <RowComponent onPress={() => handleItemPress(index)}>
              <Heart size={18} color={appColors.black} variant={selectedItemIndex === index ? 'Bold' : 'Outline' }/>
              <SpaceComponent width={4} />
              <TextComponent size={14} text='10 Loves' font={fontFamilies.medium} /> 
            </RowComponent>
          </RowComponent>
        </CardComponent>
      )}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={handleEndReached} // Khi người dùng kéo xuống cuối cùng
      onEndReachedThreshold={0.1} // Kích hoạt khi còn 10% phía dưới còn lại của danh sách
      ListFooterComponent={isLoading ? <ActivityIndicator size="large" color="#000" /> : null} // Hiển thị indicator khi đang tải dữ liệu
    />
  )
}

export default CardSearchResult;

const styles = StyleSheet.create({});
