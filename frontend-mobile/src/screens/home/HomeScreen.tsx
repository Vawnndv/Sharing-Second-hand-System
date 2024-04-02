import React from 'react'
import { ContainerComponent, HeaderComponent, TextComponent } from '../../components'
import { Text } from 'react-native'
import OrdersScreen from '../collaborator/OrdersScreen'
import OrderDetailsScreen from '../collaborator/OrderDetailsScreen'
import StatisticScreen from '../collaborator/StatisticScreen'
import ItemTabComponent from './components/ItemTabComponent'

const HomeScreen = ({navigation} : any) => {
  return (
    <ContainerComponent right title='Trang chủ'>
      {/* <StatisticScreen/> */}
      <ItemTabComponent />
    </ContainerComponent>
  )
}

export default HomeScreen