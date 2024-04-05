import React from 'react'
import ItemTabComponent from './components/ItemTabComponent'
import { AvatarComponent, ContainerComponent, HeaderComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { Text, View, Image } from 'react-native'
import OrdersScreen from '../collaborator/OrdersScreen'
import OrderDetailsScreen from '../collaborator/OrderDetailsScreen'
import StatisticScreen from '../collaborator/StatisticScreen'
import { globalStyles } from '../../styles/globalStyles'
import { fontFamilies } from '../../constants/fontFamilies'
import { Clock, Heart, Message } from 'iconsax-react-native'
import { appColors } from '../../constants/appColors'
import { SimpleLineIcons } from '@expo/vector-icons'
import CardComponent from '../../components/CardComponent'

const HomeScreen = ({navigation} : any) => {
  return (
    <ContainerComponent right title='Trang chủ'>
      {/* <StatisticScreen/> */}
      <ItemTabComponent />
    </ContainerComponent>
  )
}

export default HomeScreen