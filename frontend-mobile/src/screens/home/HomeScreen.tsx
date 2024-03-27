import React from 'react'
import { ContainerComponent, HeaderComponent } from '../../components'
import { Text } from 'react-native'
import OrdersScreen from '../collaborator/OrdersScreen'
import OrderDetailsScreen from '../collaborator/OrderDetailsScreen'
import StatisticScreen from '../collaborator/StatisticScreen'

const HomeScreen = ({navigation} : any) => {
  return (
    <ContainerComponent isScroll title='Home Screen' right>
      {/* <HeaderComponent/> */}
      <StatisticScreen/>
    </ContainerComponent>
  )
}

export default HomeScreen