import { View, Text } from 'react-native'
import React from 'react'
import { ContainerComponent, HeaderComponent } from '../../components'

const NotificationScreen = () => {
  return (
    <ContainerComponent isScroll>
      <HeaderComponent />
      <Text>NotificationScreen</Text>
    </ContainerComponent>
  )
}

export default NotificationScreen