import { MaterialIcons } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native'
import { Clock } from 'iconsax-react-native'
import React from 'react'
import { FlatList, View } from 'react-native'
import { AvatarComponent, RowComponent, SpaceComponent, TextComponent } from '../../../components'
import { appColors } from '../../../constants/appColors'
import { fontFamilies } from '../../../constants/fontFamilies'
import { globalStyles } from '../../../styles/globalStyles'


const UnreadNotifComponent = () => {
  const route = useRoute();
  const params: any = route.params;
  const itemList = params.itemList2;

  return (
    <FlatList
      data={itemList}
      renderItem={({item, index}) => (
        <RowComponent 
          key={`event${index}`}
          onPress={() => {}}
          styles={{padding: 12, backgroundColor: '#A2C3F6', marginBottom: 4}}
        >
          <AvatarComponent
            username={item.name} 
            size={78}
          />
          <SpaceComponent width={12} />
          <View style={[globalStyles.col]}>
            <RowComponent>
              <TextComponent text={`${item.name} `} font={fontFamilies.medium} text2={item.content} isConcat />
            </RowComponent>
            <RowComponent justify='space-between'>
              <RowComponent>
                <Clock size={14} color={appColors.black} />
                <SpaceComponent width={4} />
                <TextComponent text={item.time} font={fontFamilies.light} />
              </RowComponent>
              <RowComponent>
                <MaterialIcons name="more-horiz" color={appColors.black} variant='Bold' size={24}/>
              </RowComponent>
            </RowComponent>
          </View>
        </RowComponent>
      )}
    />
  )
}

export default UnreadNotifComponent