import { useNavigation } from '@react-navigation/native'
import { HambergerMenu, Location } from 'iconsax-react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { appColors } from '../constants/appColors'
import RowComponent from './RowComponent'
import SpaceComponent from './SpaceComponent'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'

const HeaderComponent = () => {
  const navigation: any = useNavigation();

  return (
    <RowComponent justify='flex-end'>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Ionicons name="notifications-outline" size={26} color={'black'} />
      </TouchableOpacity>
      <SpaceComponent width={10} />
      <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
        <Ionicons name="search-outline" size={26} color={'black'} />
      </TouchableOpacity>
      <SpaceComponent width={10} />
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Ionicons name="location-outline" size={26} color={'black'} />
      </TouchableOpacity>
      <SpaceComponent width={10} />
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu-outline" size={30} color={'black'} />
      </TouchableOpacity>
    </RowComponent>
  )
}

export default HeaderComponent