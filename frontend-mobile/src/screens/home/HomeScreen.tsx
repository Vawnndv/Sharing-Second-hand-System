import React from 'react'
import { ContainerComponent, HeaderComponent } from '../../components'
import { Text } from 'react-native'

const HomeScreen = () => {
  return (
    <ContainerComponent isScroll>
      <HeaderComponent />
      <Text>HomeScreen</Text>
    </ContainerComponent>
  )
}

export default HomeScreen