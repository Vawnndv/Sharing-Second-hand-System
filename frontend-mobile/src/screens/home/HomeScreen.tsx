import React from 'react'
import { ContainerComponent, HeaderComponent, TextComponent } from '../../components'
import { Text } from 'react-native'
import OrdersScreen from '../collaborator/OrdersScreen'
import OrderDetailsScreen from '../collaborator/OrderDetailsScreen'
import StatisticScreen from '../collaborator/StatisticScreen'

const HomeScreen = ({navigation} : any) => {
  return (
    <ContainerComponent isScroll title='Bai dang   Kho hang' right>
      {/* <HeaderComponent/> */}
      {/* <StatisticScreen/> */}
      <TextComponent text='Home' />
    </ContainerComponent>
  )
}

export default HomeScreen